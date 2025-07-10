import db from '../db';
import { defineEventHandler, readBody } from 'h3';

export default defineEventHandler(async (event) => {
  if (event.method === 'GET') {
    const deployments = db.prepare('SELECT * FROM deployments').all();
    return deployments;
  }

  if (event.method === 'POST') {
    const body = await readBody(event);
    db.prepare('INSERT INTO deployments (id, appId, envId, versionId, status, deployedAt) VALUES (?, ?, ?, ?, ?, ?)')
      .run(body.id, body.appId, body.envId, body.versionId, body.status, body.deployedAt);
    return { success: true };
  }

  if (event.method === 'DELETE') {
    const { id } = await readBody(event);
    db.prepare('DELETE FROM deployments WHERE id = ?').run(id);
    return { success: true };
  }
}); 