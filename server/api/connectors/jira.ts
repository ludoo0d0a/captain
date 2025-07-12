import { defineEventHandler, readBody } from 'h3';
import { JiraConnector } from '../../connectors/JiraConnector';

export default defineEventHandler(async (event) => {
  if (event.method !== 'POST') {
    return { error: 'Method not allowed' };
  }
  const { baseUrl, email, apiToken } = await readBody(event);
  if (!baseUrl || !email || !apiToken) {
    return { success: false, message: 'Missing required fields' };
  }
  const connector = new JiraConnector({ baseUrl, email, apiToken });
  const result = await connector.testConnection();
  return result;
}); 