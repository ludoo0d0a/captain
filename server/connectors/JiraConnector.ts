import { request } from 'undici';
import { getGlobalProxyAgent } from '../utils/proxy';

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
      const proxyAgent = await getGlobalProxyAgent();
      const { statusCode, body } = await request(`${this.baseUrl}/rest/api/3/myself`, {
        method: 'GET',
        headers: {
          'Authorization': 'Basic ' + Buffer.from(`${this.email}:${this.apiToken}`).toString('base64'),
          'Accept': 'application/json'
        },
        dispatcher: proxyAgent
      });
      if (statusCode !== 200) {
        return { success: false, message: `Jira API error: ${statusCode}` };
      }
      const data = await body.json();
      if (data && data.accountId) {
        return { success: true, message: `Connected as ${data.displayName}` };
      }
      return { success: false, message: 'Jira API did not return expected user info.' };
    } catch (error: any) {
      return { success: false, message: error.message || 'Unknown error' };
    }
  }
} 