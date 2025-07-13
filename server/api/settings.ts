import { defineEventHandler, readBody, getQuery } from 'h3';
import db from '../db/index';

export default defineEventHandler(async (event) => {
  if (event.method === 'GET') {
    const { connectorId } = getQuery(event);
    let rows;
    if (connectorId !== undefined) {
      rows = await db.query('SELECT key, value, connectorId FROM settings WHERE connectorId = ?', [connectorId]);
    } else {
      return { error: 'Missing connectorId' };
    }
    const settings: Record<string, any> = {};
    for (const row of rows) {
      try {
        settings[row.key] = JSON.parse(row.value);
      } catch {
        settings[row.key] = row.value;
      }
    }
    return { success: true, settings };
  }

  if (event.method === 'POST') {
    const { key, value, connectorId } = await readBody(event);
    if (!key || !connectorId) return { error: 'Missing key or connectorId' };
    await db.execute(
      'INSERT INTO settings (scope, key, value, connectorId) VALUES (?, ?, ?, ?) ON CONFLICT(scope, key, connectorId) DO UPDATE SET value = excluded.value',
      [null, key, JSON.stringify(value), connectorId]
    );
    return { success: true };
  }

  if (event.method === 'DELETE') {
    const { key, connectorId } = await readBody(event);
    if (!key || !connectorId) return { error: 'Missing key or connectorId' };
    await db.execute('DELETE FROM settings WHERE key = ? AND connectorId = ?', [key, connectorId]);
    return { success: true };
  }

  return { error: 'Method not allowed' };
}); 