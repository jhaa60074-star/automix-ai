import { createClient } from '@supabase/supabase-js';

const url = 'https://gqtmufehgqsdddotifiw.supabase.co';
const key = 'sb_publishable_6-VywE6Zfge1X5EKYZwCzA_hvYHf5fC';

const supabase = createClient(url, key);

async function testUpload() {
  console.log("Testing upload...");
  
  // Create a simple dummy text file buffer
  const buffer = Buffer.from('test upload file content');
  
  // We need to simulate being authenticated. Since we don't have a user session easily here without creating one,
  // let's just try an anonymous upload. If RLS blocks it, we know RLS is enabled.
  const { data, error } = await supabase.storage.from('ai_uploads').upload(`test_${Date.now()}.txt`, buffer, {
    contentType: 'text/plain'
  });

  if (error) {
    console.error("Upload error:", error);
  } else {
    console.log("Upload success:", data);
  }
}

testUpload();
