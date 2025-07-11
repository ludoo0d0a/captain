import { initializeDatabase } from '~/server/init';

export default defineNuxtPlugin(async () => {
  // Only run on server side
  if (import.meta.server) {
    try {
      await initializeDatabase();
    } catch (error) {
      console.error('Failed to initialize database in plugin:', error);
    }
  }
}); 