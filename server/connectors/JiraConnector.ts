import fetch from 'node-fetch';

export class JiraConnector {
  baseUrl: string;
  email: string;
  apiToken: string;

  constructor({ baseUrl, email, apiToken }: { baseUrl: string; email: string; apiToken: string }) {
    this.baseUrl = baseUrl;
    this.email = email;
    this.apiToken = apiToken;
  }

  async testConnection(): Promise<{ success: boolean; message: string }> {
    try {
      const response = await fetch(`${this.baseUrl}/rest/api/3/myself`, {
        headers: {
          'Authorization': 'Basic ' + Buffer.from(`${this.email}:${this.apiToken}`).toString('base64'),
          'Accept': 'application/json'
        }
      });
      if (!response.ok) {
        return { success: false, message: `Jira API error: ${response.status} ${response.statusText}` };
      }
      const data = await response.json();
      if (data && data.accountId) {
        return { success: true, message: `Connected as ${data.displayName}` };
      }
      return { success: false, message: 'Jira API did not return expected user info.' };
    } catch (error: any) {
      return { success: false, message: error.message || 'Unknown error' };
    }
  }
} 