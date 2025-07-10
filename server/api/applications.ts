import db from '../db';
import { defineEventHandler, readBody } from 'h3';

export default defineEventHandler(async (event) => {
  if (event.method === 'GET') {
    const apps = db.prepare('SELECT * FROM applications').all();
    return apps.map(app => ({ ...app, tags: app.tags ? JSON.parse(app.tags) : [] }));
  }

  if (event.method === 'POST') {
    const body = await readBody(event);
    db.prepare('INSERT INTO applications (id, name, tags) VALUES (?, ?, ?)')
      .run(body.id, body.name, JSON.stringify(body.tags || []));
    return { success: true };
  }

  if (event.method === 'DELETE') {
    const { id } = await readBody(event);
    db.prepare('DELETE FROM applications WHERE id = ?').run(id);
    return { success: true };
  }
}); 