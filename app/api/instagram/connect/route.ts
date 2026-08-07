import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

export async function POST(request: Request) {
  const supabase = createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return redirect('/login')
  }

  // Check if already connected
  const { data: existing } = await supabase
    .from('instagram_connected_accounts')
    .select('id')
    .eq('user_id', user.id)
    .limit(1)

  if (!existing || existing.length === 0) {
    // Mock connection
    await supabase.from('instagram_connected_accounts').insert({
      user_id: user.id,
      instagram_user_id: 'mock_ig_' + Math.floor(Math.random() * 1000000),
      username: 'autrix_demo_' + Math.floor(Math.random() * 100),
      facebook_page_id: 'mock_fb_' + Math.floor(Math.random() * 1000000),
      facebook_page_name: 'Autrix Demo Page',
      access_token: 'mock_token_123',
      profile_picture_url: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=100&q=80',
      status: 'connected'
    })
  }

  return redirect('/dashboard/automations/instagram')
}
