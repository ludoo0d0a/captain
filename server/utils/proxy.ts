import { getDatabase } from '../db/index';
import { ProxyAgent } from 'proxy-agent';

export async function getGlobalProxyAgent(): Promise<any | undefined> {
  const db = getDatabase();
  const rows = await db.query('SELECT value FROM settings WHERE scope = ? AND key = ?', ['global', 'proxy']);
  if (!rows.length) return undefined;
  try {
    const config = JSON.parse(rows[0].value);
    if (!config || !config.host || !config.port) return undefined;
    const options: any = {
      protocol: (config.protocol || 'http') + ':',
      host: config.host,
      port: config.port
    };
    if (config.username && config.password) {
      options.auth = `${config.username}:${config.password}`;
    }
    return new ProxyAgent(options);
  } catch (e) {
    return undefined;
  }
} 