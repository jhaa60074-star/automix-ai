import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

export const dynamic = 'force-dynamic'

async function handleRequest(request: Request) {
  const supabase = createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return redirect('/login')
  }

  const clientId = process.env.NEXT_PUBLIC_META_CLIENT_ID
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
  
  if (!clientId) {
    console.error("Missing NEXT_PUBLIC_META_CLIENT_ID")
    return redirect('/dashboard/automations/instagram?error=missing_meta_credentials')
  }

  const redirectUri = `${appUrl}/api/instagram/callback`
  const scope = 'instagram_basic,instagram_manage_comments,pages_show_list,pages_read_engagement,business_management'
  
  const state = user.id // Pass user ID as state to identify user in callback
  
  const oauthUrl = `https://www.facebook.com/v20.0/dialog/oauth?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${encodeURIComponent(scope)}&response_type=code&state=${state}`

  return redirect(oauthUrl)
}

export async function GET(request: Request) {
  return handleRequest(request)
}

export async function POST(request: Request) {
  return handleRequest(request)
}
