import db from '../db';
import { defineEventHandler, readBody } from 'h3';

export default defineEventHandler(async (event) => {
  if (event.method === 'GET') {
    const envs = await db.prepare('SELECT * FROM environments').all();
    return envs.results.map(env => ({ ...env, tags: env.tags ? JSON.parse(env.tags as string) : [] }));
  }

  if (event.method === 'POST') {
    const body = await readBody(event);
    db.prepare('INSERT INTO environments (id, name, tags) VALUES (?, ?, ?)')
      .bind(body.id, body.name, JSON.stringify(body.tags || [])).run();
    return { success: true };
  }

  if (event.method === 'DELETE') {
    const { id } = await readBody(event);
    db.prepare('DELETE FROM environments WHERE id = ?').bind(id).run();
    return { success: true };
  }
}); 