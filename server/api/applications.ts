import { defineEventHandler, readBody } from 'h3';
import db from '../db';

export default defineEventHandler(async (event) => {
  if (event.method === 'GET') {
    const apps = await db.query('SELECT * FROM applications');
    return apps.map((app: any) => ({ ...app, tags: app.tags ? JSON.parse(app.tags) : [] }));
  }

  if (event.method === 'POST') {
    const body = await readBody(event);
    await db.execute('INSERT INTO applications (id, name, tags) VALUES (?, ?, ?)', 
      [body.id, body.name, JSON.stringify(body.tags || [])]);
    return { success: true };
  }

  if (event.method === 'DELETE') {
    const { id } = await readBody(event);
    await db.execute('DELETE FROM applications WHERE id = ?', [id]);
    return { success: true };
  }
}); 