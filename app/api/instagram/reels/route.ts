import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  try {
    const supabase = createClient()
    
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get the connected Instagram account
    const { data: accounts, error: accountError } = await supabase
      .from('instagram_connected_accounts')
      .select('instagram_user_id, access_token')
      .eq('user_id', user.id)
      .limit(1)

    if (accountError || !accounts || accounts.length === 0) {
      return NextResponse.json({ error: 'No Instagram account connected' }, { status: 404 })
    }

    const { instagram_user_id, access_token } = accounts[0]

    if (!instagram_user_id || !access_token) {
      return NextResponse.json({ error: 'Incomplete account details' }, { status: 400 })
    }

    let metaApiUrl = `https://graph.facebook.com/v20.0/${instagram_user_id}/media?fields=id,caption,media_type,media_url,thumbnail_url,timestamp,like_count,comments_count&access_token=${access_token}`
    
    let metaResponse = await fetch(metaApiUrl)
    
    if (!metaResponse.ok) {
      const errorData = await metaResponse.json().catch(() => ({}))
      console.error('Meta API Error on initial fetch:', errorData)

      // If token expired, try to refresh it automatically
      if (errorData?.error?.type === 'OAuthException' || errorData?.error?.code === 190) {
        console.log('Attempting automatic token refresh...')
        
        const clientId = process.env.NEXT_PUBLIC_META_CLIENT_ID
        const clientSecret = process.env.META_CLIENT_SECRET
        
        if (clientId && clientSecret) {
          const refreshUrl = `https://graph.facebook.com/v20.0/oauth/access_token?grant_type=fb_exchange_token&client_id=${clientId}&client_secret=${clientSecret}&fb_exchange_token=${access_token}`
          const refreshResponse = await fetch(refreshUrl)
          
          if (refreshResponse.ok) {
            const refreshData = await refreshResponse.json()
            const newAccessToken = refreshData.access_token
            
            if (newAccessToken) {
              // Save new token to Supabase
              await supabase
                .from('instagram_connected_accounts')
                .update({
                  access_token: newAccessToken,
                  last_sync: new Date().toISOString(),
                  updated_at: new Date().toISOString()
                })
                .eq('user_id', user.id)
                
              console.log('Token refreshed successfully, retrying reels fetch...')
              
              // Retry fetch with new token
              metaApiUrl = `https://graph.facebook.com/v20.0/${instagram_user_id}/media?fields=id,caption,media_type,media_url,thumbnail_url,timestamp,like_count,comments_count&access_token=${newAccessToken}`
              metaResponse = await fetch(metaApiUrl)
            }
          } else {
            console.error('Token refresh failed:', await refreshResponse.text())
          }
        }
      }

      // If it still failed after retry (or no retry happened)
      if (!metaResponse.ok) {
        const finalErrorData = await metaResponse.json().catch(() => ({}))
        return NextResponse.json(
          { 
            error: 'meta_api_error', 
            message: 'Failed to fetch reels from Instagram. The access token may have expired and refresh failed. Please reconnect.',
            details: finalErrorData
          }, 
          { status: 400 }
        )
      }
    }

    const metaData = await metaResponse.json()
    
    // Filter only REELs (media_type === 'VIDEO')
    const reels = (metaData.data || []).filter((item: any) => item.media_type === 'VIDEO')

    return NextResponse.json({ reels })

  } catch (error: any) {
    console.error('Instagram Reels API Error:', error)
    return NextResponse.json(
      { error: 'internal_error', message: 'An unexpected error occurred while fetching reels.' },
      { status: 400 } // Don't throw 500
    )
  }
}
