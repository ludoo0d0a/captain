import db from '../db';
import { defineEventHandler, readBody } from 'h3';

export default defineEventHandler(async (event) => {
  if (event.method === 'GET') {
    const versions = db.prepare('SELECT * FROM versions').all();
    return versions.map(v => ({
      ...v,
      isSnapshot: !!v.isSnapshot,
      metadata: v.metadata ? JSON.parse(v.metadata) : {},
    }));
  }

  if (event.method === 'POST') {
    const body = await readBody(event);
    db.prepare('INSERT INTO versions (id, appId, name, createdAt, isSnapshot, metadata) VALUES (?, ?, ?, ?, ?, ?)')
      .run(body.id, body.appId, body.name, body.createdAt, body.isSnapshot ? 1 : 0, JSON.stringify(body.metadata || {}));
    return { success: true };
  }

  if (event.method === 'DELETE') {
    const { id } = await readBody(event);
    db.prepare('DELETE FROM versions WHERE id = ?').run(id);
    return { success: true };
  }
}); 