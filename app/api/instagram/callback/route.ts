import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get('code')
  const state = searchParams.get('state') // user_id passed from connect route
  const error = searchParams.get('error')
  const errorReason = searchParams.get('error_reason')

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
  const redirectUri = `${appUrl}/dashboard/automations/instagram`

  if (error) {
    console.error('OAuth Error from Meta:', error, errorReason)
    return NextResponse.redirect(`${redirectUri}?error=${error}`)
  }

  if (!code || !state) {
    return NextResponse.redirect(`${redirectUri}?error=missing_oauth_params`)
  }

  const clientId = process.env.NEXT_PUBLIC_META_CLIENT_ID
  const clientSecret = process.env.META_CLIENT_SECRET
  const callbackUrl = `${appUrl}/api/instagram/callback`

  if (!clientId || !clientSecret) {
    console.error("Missing META credentials")
    return NextResponse.redirect(`${redirectUri}?error=missing_meta_credentials`)
  }

  try {
    const supabase = createClient()
    const userId = state

    // 1. Exchange code for Short-Lived Access Token
    const tokenResponse = await fetch(`https://graph.facebook.com/v20.0/oauth/access_token?client_id=${clientId}&redirect_uri=${encodeURIComponent(callbackUrl)}&client_secret=${clientSecret}&code=${code}`)
    
    if (!tokenResponse.ok) {
      const errData = await tokenResponse.json()
      console.error('Short-lived token error:', errData)
      return NextResponse.redirect(`${redirectUri}?error=token_exchange_failed`)
    }
    
    const tokenData = await tokenResponse.json()
    const shortLivedToken = tokenData.access_token

    // 2. Exchange Short-Lived Token for Long-Lived Token
    const longLivedResponse = await fetch(`https://graph.facebook.com/v20.0/oauth/access_token?grant_type=fb_exchange_token&client_id=${clientId}&client_secret=${clientSecret}&fb_exchange_token=${shortLivedToken}`)
    
    if (!longLivedResponse.ok) {
      const errData = await longLivedResponse.json()
      console.error('Long-lived token error:', errData)
      return NextResponse.redirect(`${redirectUri}?error=long_lived_exchange_failed`)
    }
    
    const longLivedData = await longLivedResponse.json()
    const longLivedToken = longLivedData.access_token
    const expiresIn = longLivedData.expires_in // typically 60 days in seconds

    // Calculate expiration timestamp
    const expiresAt = new Date()
    expiresAt.setSeconds(expiresAt.getSeconds() + expiresIn)

    // 3. Fetch user's Facebook Pages
    const pagesResponse = await fetch(`https://graph.facebook.com/v20.0/me/accounts?access_token=${longLivedToken}`)
    const pagesData = await pagesResponse.json()
    
    if (!pagesData.data || pagesData.data.length === 0) {
      return NextResponse.redirect(`${redirectUri}?error=no_facebook_pages`)
    }
    
    const fbPage = pagesData.data[0] // Taking the first page for simplicity
    const pageId = fbPage.id
    const pageName = fbPage.name
    const pageToken = fbPage.access_token // Page access token might be needed for some IG operations

    // 4. Fetch associated Instagram Business Account ID
    const igAccountResponse = await fetch(`https://graph.facebook.com/v20.0/${pageId}?fields=instagram_business_account&access_token=${pageToken || longLivedToken}`)
    const igAccountData = await igAccountResponse.json()

    if (!igAccountData.instagram_business_account) {
      return NextResponse.redirect(`${redirectUri}?error=no_instagram_business_account`)
    }

    const igUserId = igAccountData.instagram_business_account.id

    // 5. Fetch Instagram profile info
    const igProfileResponse = await fetch(`https://graph.facebook.com/v20.0/${igUserId}?fields=username,profile_picture_url&access_token=${longLivedToken}`)
    const igProfileData = await igProfileResponse.json()

    const username = igProfileData.username || 'Unknown'
    const profilePic = igProfileData.profile_picture_url || ''

    // 6. Store securely in Supabase
    const { error: dbError } = await supabase
      .from('instagram_connected_accounts')
      .upsert({
        user_id: userId,
        instagram_user_id: igUserId,
        username: username,
        profile_picture_url: profilePic,
        facebook_page_id: pageId,
        facebook_page_name: pageName,
        access_token: longLivedToken, // Encrypt this in a real prod environment if desired via Postgres extensions
        status: 'connected',
        last_sync: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }, { onConflict: 'user_id' }) // Assuming one account per user for simplicity, or adjust schema if unique

    if (dbError) {
      console.error('Database error storing IG account:', dbError)
      return NextResponse.redirect(`${redirectUri}?error=database_error`)
    }

    return NextResponse.redirect(redirectUri)

  } catch (error: any) {
    console.error('OAuth Callback Error:', error)
    return NextResponse.redirect(`${redirectUri}?error=internal_error`)
  }
}
