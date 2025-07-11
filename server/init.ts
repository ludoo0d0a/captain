import { createTables, prefillWithMockData } from './db/index';

export async function initializeDatabase() {
  try {
    console.log('Initializing database...');
    await createTables();
    console.log('Database tables created successfully');
    
    // Optionally prefill with mock data in development
    if (process.env.NODE_ENV === 'development' && process.env.PREFILL_DB === 'true') {
      console.log('Prefilling database with mock data...');
      await prefillWithMockData();
      console.log('Database prefilled with mock data');
    }
  } catch (error) {
    console.error('Failed to initialize database:', error);
    throw error;
  }
} 