import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'

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

    // Fetch from real Meta Graph API
    const metaApiUrl = `https://graph.facebook.com/v20.0/${instagram_user_id}/media?fields=id,caption,media_type,media_url,thumbnail_url,timestamp,like_count,comments_count&access_token=${access_token}`
    
    const metaResponse = await fetch(metaApiUrl)
    
    if (!metaResponse.ok) {
      const errorData = await metaResponse.json().catch(() => ({}))
      console.error('Meta API Error:', errorData)
      return NextResponse.json(
        { 
          error: 'meta_api_error', 
          message: 'Failed to fetch reels from Instagram. The access token may have expired.',
          details: errorData
        }, 
        { status: 400 }
      )
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
