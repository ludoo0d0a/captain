import { defineEventHandler, readBody } from 'h3';
import db from '../db';

export default defineEventHandler(async (event) => {
  if (event.method === 'GET') {
    const envs = await db.query('SELECT * FROM environments');
    return envs.map((env: any) => ({ ...env, tags: env.tags ? JSON.parse(env.tags) : [] }));
  }

  if (event.method === 'POST') {
    const body = await readBody(event);
    await db.execute('INSERT INTO environments (id, name, tags) VALUES (?, ?, ?)', 
      [body.id, body.name, JSON.stringify(body.tags || [])]);
    return { success: true };
  }

  if (event.method === 'DELETE') {
    const { id } = await readBody(event);
    await db.execute('DELETE FROM environments WHERE id = ?', [id]);
    return { success: true };
  }
}); 