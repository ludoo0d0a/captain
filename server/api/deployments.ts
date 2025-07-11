import db from '../db';
import { defineEventHandler, readBody } from 'h3';

export default defineEventHandler(async (event) => {
  if (event.method === 'GET') {
    const deployments = await db.prepare('SELECT * FROM deployments').all();
    return deployments.results;
  }

  if (event.method === 'POST') {
    const body = await readBody(event);
    db.prepare('INSERT INTO deployments (id, appId, envId, versionId, status, deployedAt) VALUES (?, ?, ?, ?, ?, ?)')
      .bind(body.id, body.appId, body.envId, body.versionId, body.status, body.deployedAt).run();
    return { success: true };
  }

  if (event.method === 'DELETE') {
    const { id } = await readBody(event);
    db.prepare('DELETE FROM deployments WHERE id = ?').bind(id).run();
    return { success: true };
  }
}); 