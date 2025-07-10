import { defineEventHandler, readBody } from 'h3';
import { clearDatabase, prefillWithMockData } from '../db';

export default defineEventHandler(async (event) => {
  if (event.method === 'POST') {
    const body = await readBody(event);
    
    if (body.action === 'clear') {
      clearDatabase();
      return { success: true, message: 'Database cleared successfully' };
    }
    
    if (body.action === 'prefill') {
      prefillWithMockData();
      return { success: true, message: 'Database prefilled with mock data successfully' };
    }
    
    return { success: false, message: 'Invalid action' };
  }
  
  return { success: false, message: 'Method not allowed' };
}); 