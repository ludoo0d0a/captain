import db from '../db';
import { defineEventHandler, readBody } from 'h3';

export default defineEventHandler(async (event) => {
  if (event.method === 'GET') {
    const versions = await db.prepare('SELECT * FROM versions').all();
    return versions.results.map(v => ({
      ...v,
      isSnapshot: !!v.isSnapshot,
      metadata: v.metadata ? JSON.parse(v.metadata as string) : {},
    }));
  }

  if (event.method === 'POST') {
    const body = await readBody(event);
    db.prepare('INSERT INTO versions (id, appId, name, createdAt, isSnapshot, metadata) VALUES (?, ?, ?, ?, ?, ?)')
      .bind(body.id, body.appId, body.name, body.createdAt, body.isSnapshot ? 1 : 0, JSON.stringify(body.metadata || {})).run();
    return { success: true };
  }

  if (event.method === 'DELETE') {
    const { id } = await readBody(event);
    db.prepare('DELETE FROM versions WHERE id = ?').bind(id).run();
    return { success: true };
  }
}); 