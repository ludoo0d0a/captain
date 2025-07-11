import { DatabaseAdapter } from './abstract';
import { SQLiteAdapter } from './sqlite';
import { D1Adapter } from './d1';

let db: DatabaseAdapter;

export function getDatabase(): DatabaseAdapter {
  if (!db) {
    if (process.env.NODE_ENV === 'production') {
      // Use Cloudflare D1 in production
      try {
        const d1Db = hubDatabase();
        db = new D1Adapter(d1Db);
      } catch (error) {
        console.error('Failed to initialize D1 database:', error);
        throw new Error('D1 database not available');
      }
    } else {
      // Use SQLite in development
      try {
        db = new SQLiteAdapter('data.db');
      } catch (error) {
        console.error('Failed to initialize SQLite database:', error);
        throw new Error('SQLite database not available');
      }
    }
  }
  return db;
}

export async function createTables() {
  const database = getDatabase();
  
  await database.execute(`
    CREATE TABLE IF NOT EXISTS applications (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      tags TEXT
    )
  `);

  await database.execute(`
    CREATE TABLE IF NOT EXISTS environments (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      tags TEXT
    )
  `);

  await database.execute(`
    CREATE TABLE IF NOT EXISTS versions (
      id TEXT PRIMARY KEY,
      appId TEXT NOT NULL,
      name TEXT NOT NULL,
      createdAt TEXT NOT NULL,
      isSnapshot INTEGER,
      metadata TEXT
    )
  `);

  await database.execute(`
    CREATE TABLE IF NOT EXISTS deployments (
      id TEXT PRIMARY KEY,
      appId TEXT NOT NULL,
      envId TEXT NOT NULL,
      versionId TEXT NOT NULL,
      status TEXT,
      deployedAt TEXT
    )
  `);
}

export async function clearDatabase() {
  const database = getDatabase();
  
  await database.execute('DELETE FROM deployments');
  await database.execute('DELETE FROM versions');
  await database.execute('DELETE FROM environments');
  await database.execute('DELETE FROM applications');
}

export async function prefillWithMockData() {
  await clearDatabase();
  
  const database = getDatabase();
  
  // Mock applications
  const mockApps = [
    { id: 'app-1', name: 'Frontend App', tags: JSON.stringify(['web', 'react', 'production']) },
    { id: 'app-2', name: 'Backend API', tags: JSON.stringify(['api', 'nodejs', 'critical']) },
    { id: 'app-3', name: 'Mobile App', tags: JSON.stringify(['mobile', 'ios', 'android']) },
    { id: 'app-4', name: 'Admin Dashboard', tags: JSON.stringify(['web', 'admin', 'internal']) },
    { id: 'app-5', name: 'Payment Service', tags: JSON.stringify(['api', 'payment', 'critical']) }
  ];
  
  // Mock environments
  const mockEnvs = [
    { id: 'env-1', name: 'Development', tags: JSON.stringify(['dev', 'local']) },
    { id: 'env-2', name: 'Staging', tags: JSON.stringify(['staging', 'pre-prod']) },
    { id: 'env-3', name: 'Production', tags: JSON.stringify(['prod', 'live']) },
    { id: 'env-4', name: 'Testing', tags: JSON.stringify(['test', 'qa']) }
  ];
  
  // Mock versions
  const mockVersions = [
    { id: 'ver-1', appId: 'app-1', name: '1.2.3', createdAt: '2024-01-15T10:00:00Z', isSnapshot: 0, metadata: JSON.stringify({ build: '123', commit: 'abc123' }) },
    { id: 'ver-2', appId: 'app-1', name: '1.2.4-SNAPSHOT', createdAt: '2024-01-16T14:30:00Z', isSnapshot: 1, metadata: JSON.stringify({ build: '124', commit: 'def456' }) },
    { id: 'ver-3', appId: 'app-2', name: '2.1.0', createdAt: '2024-01-14T09:15:00Z', isSnapshot: 0, metadata: JSON.stringify({ build: '201', commit: 'ghi789' }) },
    { id: 'ver-4', appId: 'app-2', name: '2.1.1-SNAPSHOT', createdAt: '2024-01-17T16:45:00Z', isSnapshot: 1, metadata: JSON.stringify({ build: '202', commit: 'jkl012' }) },
    { id: 'ver-5', appId: 'app-3', name: '3.0.0', createdAt: '2024-01-13T11:20:00Z', isSnapshot: 0, metadata: JSON.stringify({ build: '300', commit: 'mno345' }) },
    { id: 'ver-6', appId: 'app-4', name: '1.0.1', createdAt: '2024-01-12T08:30:00Z', isSnapshot: 0, metadata: JSON.stringify({ build: '101', commit: 'pqr678' }) },
    { id: 'ver-7', appId: 'app-5', name: '4.2.0', createdAt: '2024-01-11T13:45:00Z', isSnapshot: 0, metadata: JSON.stringify({ build: '420', commit: 'stu901' }) }
  ];
  
  // Mock deployments
  const mockDeployments = [
    { id: 'dep-1', appId: 'app-1', envId: 'env-1', versionId: 'ver-2', status: 'deployed', deployedAt: '2024-01-16T15:00:00Z' },
    { id: 'dep-2', appId: 'app-1', envId: 'env-2', versionId: 'ver-1', status: 'deployed', deployedAt: '2024-01-15T11:00:00Z' },
    { id: 'dep-3', appId: 'app-1', envId: 'env-3', versionId: 'ver-1', status: 'deployed', deployedAt: '2024-01-15T12:00:00Z' },
    { id: 'dep-4', appId: 'app-2', envId: 'env-1', versionId: 'ver-4', status: 'deployed', deployedAt: '2024-01-17T17:00:00Z' },
    { id: 'dep-5', appId: 'app-2', envId: 'env-2', versionId: 'ver-3', status: 'deployed', deployedAt: '2024-01-14T10:00:00Z' },
    { id: 'dep-6', appId: 'app-2', envId: 'env-3', versionId: 'ver-3', status: 'deployed', deployedAt: '2024-01-14T13:00:00Z' },
    { id: 'dep-7', appId: 'app-3', envId: 'env-1', versionId: 'ver-5', status: 'deployed', deployedAt: '2024-01-13T12:00:00Z' },
    { id: 'dep-8', appId: 'app-3', envId: 'env-2', versionId: 'ver-5', status: 'deployed', deployedAt: '2024-01-13T14:00:00Z' },
    { id: 'dep-9', appId: 'app-4', envId: 'env-1', versionId: 'ver-6', status: 'deployed', deployedAt: '2024-01-12T09:00:00Z' },
    { id: 'dep-10', appId: 'app-5', envId: 'env-1', versionId: 'ver-7', status: 'deployed', deployedAt: '2024-01-11T14:00:00Z' },
    { id: 'dep-11', appId: 'app-5', envId: 'env-3', versionId: 'ver-7', status: 'deployed', deployedAt: '2024-01-11T15:00:00Z' }
  ];
  
  // Insert mock data
  for (const app of mockApps) {
    await database.execute('INSERT INTO applications (id, name, tags) VALUES (?, ?, ?)', [app.id, app.name, app.tags]);
  }
  
  for (const env of mockEnvs) {
    await database.execute('INSERT INTO environments (id, name, tags) VALUES (?, ?, ?)', [env.id, env.name, env.tags]);
  }
  
  for (const version of mockVersions) {
    await database.execute('INSERT INTO versions (id, appId, name, createdAt, isSnapshot, metadata) VALUES (?, ?, ?, ?, ?, ?)', 
      [version.id, version.appId, version.name, version.createdAt, version.isSnapshot, version.metadata]);
  }
  
  for (const deployment of mockDeployments) {
    await database.execute('INSERT INTO deployments (id, appId, envId, versionId, status, deployedAt) VALUES (?, ?, ?, ?, ?, ?)', 
      [deployment.id, deployment.appId, deployment.envId, deployment.versionId, deployment.status, deployment.deployedAt]);
  }
}

// Export the database instance for direct use
export default getDatabase(); 