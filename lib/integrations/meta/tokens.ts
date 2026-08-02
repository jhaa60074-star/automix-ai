import { createClient } from '@/utils/supabase/server';
import crypto from 'crypto';

const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || 'default-encryption-key-32-chars!!'; // Must be 32 bytes
const IV_LENGTH = 16;

function encrypt(text: string) {
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY.substring(0, 32)), iv);
  let encrypted = cipher.update(text);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return iv.toString('hex') + ':' + encrypted.toString('hex');
}

function decrypt(text: string) {
  const textParts = text.split(':');
  const iv = Buffer.from(textParts.shift()!, 'hex');
  const encryptedText = Buffer.from(textParts.join(':'), 'hex');
  const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY.substring(0, 32)), iv);
  let decrypted = decipher.update(encryptedText);
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return decrypted.toString();
}

export class TokenService {
  static async storeToken(userId: string, accessToken: string, expiresIn?: number) {
    const supabase = createClient();
    
    const encryptedToken = encrypt(accessToken);
    let expiresAt = null;
    if (expiresIn) {
      expiresAt = new Date(Date.now() + expiresIn * 1000).toISOString();
    }

    const { error } = await supabase
      .from('oauth_tokens')
      .upsert({
        user_id: userId,
        provider: 'facebook',
        access_token: encryptedToken,
        expires_at: expiresAt,
        updated_at: new Date().toISOString()
      }, { onConflict: 'user_id,provider' });

    if (error) {
      console.error('[TokenService] Failed to store token:', error);
      throw error;
    }
  }

  static async getToken(userId: string): Promise<string | null> {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('oauth_tokens')
      .select('access_token')
      .eq('user_id', userId)
      .eq('provider', 'facebook')
      .single();

    if (error || !data) return null;

    try {
      return decrypt(data.access_token);
    } catch (e) {
      console.error('[TokenService] Failed to decrypt token', e);
      return null;
    }
  }

  static async revokeToken(userId: string) {
    const supabase = createClient();
    await supabase.from('oauth_tokens').delete().eq('user_id', userId).eq('provider', 'facebook');
  }
}
