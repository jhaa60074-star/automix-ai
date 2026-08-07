import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

// This endpoint can be hit via a CRON job or manually to refresh tokens
export async function GET(request: Request) {
  const supabase = createClient()
  
  // Basic security: require a secret key if hit via cron, or require auth if hit by user
  const { searchParams } = new URL(request.url)
  const cronSecret = searchParams.get('cron_secret')
  
  let accountsToRefresh: any[] = []

  if (cronSecret === process.env.CRON_SECRET) {
    // Fetch accounts expiring soon (e.g., within 7 days, or just refresh all active)
    const { data } = await supabase
      .from('instagram_connected_accounts')
      .select('*')
      .eq('status', 'connected')
      // Note: In a production app, you'd filter by an expires_at timestamp
    accountsToRefresh = data || []
  } else {
    // User triggered refresh
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const { data } = await supabase
      .from('instagram_connected_accounts')
      .select('*')
      .eq('user_id', user.id)
      .eq('status', 'connected')
    accountsToRefresh = data || []
  }

  if (accountsToRefresh.length === 0) {
    return NextResponse.json({ message: 'No accounts to refresh' })
  }

  const clientId = process.env.NEXT_PUBLIC_META_CLIENT_ID
  const clientSecret = process.env.META_CLIENT_SECRET
  
  if (!clientId || !clientSecret) {
    return NextResponse.json({ error: 'Missing META credentials' }, { status: 500 })
  }

  let refreshedCount = 0
  let failedCount = 0

  for (const account of accountsToRefresh) {
    try {
      // Endpoint for refreshing a long-lived token
      const refreshUrl = `https://graph.facebook.com/v20.0/oauth/access_token?grant_type=fb_exchange_token&client_id=${clientId}&client_secret=${clientSecret}&fb_exchange_token=${account.access_token}`
      
      const response = await fetch(refreshUrl)
      if (!response.ok) {
        throw new Error('Failed to refresh token from Meta')
      }
      
      const data = await response.json()
      const newAccessToken = data.access_token
      
      if (newAccessToken) {
        await supabase
          .from('instagram_connected_accounts')
          .update({
            access_token: newAccessToken,
            last_sync: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })
          .eq('id', account.id)
          
        refreshedCount++
      } else {
        failedCount++
      }
    } catch (err) {
      console.error(`Failed to refresh token for account ${account.id}:`, err)
      
      // Update status to failed so user is prompted to reconnect
      await supabase
        .from('instagram_connected_accounts')
        .update({
          status: 'expired',
          updated_at: new Date().toISOString()
        })
        .eq('id', account.id)
        
      failedCount++
    }
  }

  return NextResponse.json({
    message: 'Token refresh complete',
    refreshed: refreshedCount,
    failed: failedCount
  })
}
