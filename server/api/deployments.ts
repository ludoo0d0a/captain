import { defineEventHandler, readBody } from 'h3';
import db from '../db';

export default defineEventHandler(async (event) => {
  if (event.method === 'GET') {
    const deployments = await db.query('SELECT * FROM deployments');
    return deployments;
  }

  if (event.method === 'POST') {
    const body = await readBody(event);
    await db.execute('INSERT INTO deployments (id, appId, envId, versionId, status, deployedAt) VALUES (?, ?, ?, ?, ?, ?)', 
      [body.id, body.appId, body.envId, body.versionId, body.status, body.deployedAt]);
    return { success: true };
  }

  if (event.method === 'DELETE') {
    const { id } = await readBody(event);
    await db.execute('DELETE FROM deployments WHERE id = ?', [id]);
    return { success: true };
  }
}); 