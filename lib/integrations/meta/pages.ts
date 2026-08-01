const FACEBOOK_GRAPH_URL = `https://graph.facebook.com/v19.0`;

export class MetaPages {
  static async getConnectedPages(accessToken: string) {
    // Fetches all pages the user has granted access to
    const response = await fetch(`${FACEBOOK_GRAPH_URL}/me/accounts?access_token=${accessToken}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch Facebook Pages');
    }
    
    const data = await response.json();
    return data.data; // Array of pages { id, name, access_token }
  }
}
