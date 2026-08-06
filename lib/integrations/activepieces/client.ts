/**
 * Activepieces Client Foundation
 * Handles communication with the Activepieces API.
 */

export class ActivepiecesClient {
  private baseUrl: string;
  private apiKey: string;

  constructor() {
    this.baseUrl = process.env.ACTIVEPIECES_BASE_URL || 'https://activepieces.autrixgpt.com';
    this.apiKey = process.env.ACTIVEPIECES_API_KEY || '';
  }

  private async fetchAPI(endpoint: string, options: RequestInit = {}) {
    const response = await fetch(`${this.baseUrl}/api/v1${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`,
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`Activepieces API Error: ${response.statusText}`);
    }

    return response.json();
  }

  // Example: fetch all projects
  async getProjects() {
    return this.fetchAPI('/projects');
  }
}
