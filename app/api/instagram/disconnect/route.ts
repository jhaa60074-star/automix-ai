import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

export async function POST(request: Request) {
  const supabase = createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return redirect('/login')
  }

  // Delete connected account
  await supabase
    .from('instagram_connected_accounts')
    .delete()
    .eq('user_id', user.id)

  return redirect('/dashboard/automations/instagram')
}
