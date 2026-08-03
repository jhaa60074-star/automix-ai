import { getScopesString } from '@/lib/integrations/meta/permissions';

const META_API_VERSION = 'v19.0';
const FACEBOOK_OAUTH_URL = `https://www.facebook.com/${META_API_VERSION}/dialog/oauth`;
const FACEBOOK_GRAPH_URL = `https://graph.facebook.com/${META_API_VERSION}`;

export class MetaOAuth {
  static getAuthUrl(state: string) {
    const appId = process.env.NEXT_PUBLIC_META_APP_ID;
    const redirectUri = process.env.META_REDIRECT_URI || `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/api/auth/facebook/callback`;

    if (!appId) throw new Error('NEXT_PUBLIC_META_APP_ID is not configured');

    const params = new URLSearchParams({
      client_id: appId,
      redirect_uri: redirectUri,
      state: state,
      scope: getScopesString(),
      response_type: 'code',
      config_id: process.env.META_CONFIG_ID || '' // for future specialized configs
    });

    return `${FACEBOOK_OAUTH_URL}?${params.toString()}`;
  }

  static async exchangeCodeForToken(code: string) {
    const appId = process.env.NEXT_PUBLIC_META_APP_ID;
    const appSecret = process.env.META_APP_SECRET;
    const redirectUri = process.env.META_REDIRECT_URI || `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/api/auth/facebook/callback`;

    const response = await fetch(`${FACEBOOK_GRAPH_URL}/oauth/access_token?client_id=${appId}&redirect_uri=${redirectUri}&client_secret=${appSecret}&code=${code}`);

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Failed to exchange code: ${JSON.stringify(errorData)}`);
    }

    const data = await response.json();
    return data; // { access_token, token_type, expires_in }
  }

  static async getLongLivedToken(shortLivedToken: string) {
    const appId = process.env.NEXT_PUBLIC_META_APP_ID;
    const appSecret = process.env.META_APP_SECRET;

    const response = await fetch(`${FACEBOOK_GRAPH_URL}/oauth/access_token?grant_type=fb_exchange_token&client_id=${appId}&client_secret=${appSecret}&fb_exchange_token=${shortLivedToken}`);

    if (!response.ok) {
      throw new Error('Failed to exchange for long-lived token');
    }

    const data = await response.json();
    return data; // { access_token, token_type, expires_in }
  }
}
