import { defineEventHandler, readBody } from 'h3';
import db from '../db';

export default defineEventHandler(async (event) => {
  if (event.method === 'GET') {
    const versions = await db.query('SELECT * FROM versions');
    return versions.map((v: any) => ({
      ...v,
      isSnapshot: !!v.isSnapshot,
      metadata: v.metadata ? JSON.parse(v.metadata) : {},
    }));
  }

  if (event.method === 'POST') {
    const body = await readBody(event);
    await db.execute('INSERT INTO versions (id, appId, name, createdAt, isSnapshot, metadata) VALUES (?, ?, ?, ?, ?, ?)', 
      [body.id, body.appId, body.name, body.createdAt, body.isSnapshot ? 1 : 0, JSON.stringify(body.metadata || {})]);
    return { success: true };
  }

  if (event.method === 'DELETE') {
    const { id } = await readBody(event);
    await db.execute('DELETE FROM versions WHERE id = ?', [id]);
    return { success: true };
  }
}); 