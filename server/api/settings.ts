import { defineEventHandler, readBody, getQuery } from 'h3';
import db from '../db/index';

export default defineEventHandler(async (event) => {
  if (event.method === 'GET') {
    const { scope, connectorId } = getQuery(event);
    if (!scope) return { error: 'Missing scope' };
    let rows;
    if (connectorId !== undefined) {
      rows = await db.query('SELECT key, value, connectorId FROM settings WHERE scope = ? AND (connectorId IS ? OR connectorId = ?)', [scope, connectorId, connectorId]);
    } else {
      rows = await db.query('SELECT key, value, connectorId FROM settings WHERE scope = ? AND connectorId IS NULL', [scope]);
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
    const { scope, key, value, connectorId } = await readBody(event);
    if (!scope || !key) return { error: 'Missing scope or key' };
    await db.execute(
      'INSERT INTO settings (scope, key, value, connectorId) VALUES (?, ?, ?, ?) ON CONFLICT(scope, key, connectorId) DO UPDATE SET value = excluded.value',
      [scope, key, JSON.stringify(value), connectorId || null]
    );
    return { success: true };
  }

  if (event.method === 'DELETE') {
    const { scope, key, connectorId } = await readBody(event);
    if (!scope || !key) return { error: 'Missing scope or key' };
    await db.execute('DELETE FROM settings WHERE scope = ? AND key = ? AND (connectorId IS ? OR connectorId = ?)', [scope, key, connectorId, connectorId]);
    return { success: true };
  }

  return { error: 'Method not allowed' };
}); 