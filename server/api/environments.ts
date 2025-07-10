import db from '../db';
import { defineEventHandler, readBody } from 'h3';

export default defineEventHandler(async (event) => {
  if (event.method === 'GET') {
    const envs = db.prepare('SELECT * FROM environments').all();
    return envs.map(env => ({ ...env, tags: env.tags ? JSON.parse(env.tags) : [] }));
  }

  if (event.method === 'POST') {
    const body = await readBody(event);
    db.prepare('INSERT INTO environments (id, name, tags) VALUES (?, ?, ?)')
      .run(body.id, body.name, JSON.stringify(body.tags || []));
    return { success: true };
  }

  if (event.method === 'DELETE') {
    const { id } = await readBody(event);
    db.prepare('DELETE FROM environments WHERE id = ?').run(id);
    return { success: true };
  }
}); 