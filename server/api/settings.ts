import { defineEventHandler, readBody, getQuery } from 'h3';
import db from '../db/index';

export default defineEventHandler(async (event) => {
  if (event.method === 'GET') {
    const { scope } = getQuery(event);
    if (!scope) return { error: 'Missing scope' };
    const rows = await db.query('SELECT key, value FROM settings WHERE scope = ?', [scope]);
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
    const { scope, key, value } = await readBody(event);
    if (!scope || !key) return { error: 'Missing scope or key' };
    await db.execute(
      'INSERT INTO settings (scope, key, value) VALUES (?, ?, ?) ON CONFLICT(scope, key) DO UPDATE SET value = excluded.value',
      [scope, key, JSON.stringify(value)]
    );
    return { success: true };
  }

  if (event.method === 'DELETE') {
    const { scope, key } = await readBody(event);
    if (!scope || !key) return { error: 'Missing scope or key' };
    await db.execute('DELETE FROM settings WHERE scope = ? AND key = ?', [scope, key]);
    return { success: true };
  }

  return { error: 'Method not allowed' };
}); 