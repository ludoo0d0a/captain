import { defineEventHandler, readBody } from 'h3';
import { clearDatabase, prefillWithMockData } from '../db/index';

export default defineEventHandler(async (event) => {
  if (event.method === 'POST') {
    const { action } = await readBody(event);
    
    if (action === 'clear') {
      await clearDatabase();
      return { success: true, message: 'Database cleared successfully' };
    }
    
    if (action === 'prefill') {
      await prefillWithMockData();
      return { success: true, message: 'Database prefilled with mock data' };
    }
    
    return { error: 'Invalid action' };
  }
  
  return { error: 'Method not allowed' };
}); 