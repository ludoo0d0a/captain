import { defineEventHandler, getQuery } from 'h3';
import db from '../db/index';

interface ViewRow {
  envId: string;
  envName: string;
  envTags: string;
  appId: string;
  appName: string;
  appTags: string;
  deploymentId: string;
  deploymentStatus: string;
  deployedAt: string;
  versionId: string;
  versionName: string;
  isSnapshot: number;
  versionCreatedAt: string;
}

interface GroupedEnvironment {
  id: string;
  name: string;
  tags: string[];
  applications: Array<{
    id: string;
    name: string;
    tags: string[];
    deployment: {
      id: string;
      status: string;
      deployedAt: string;
      version: {
        id: string;
        name: string;
        isSnapshot: boolean;
        createdAt: string;
      };
    } | null;
  }>;
}

interface GroupedApplication {
  id: string;
  name: string;
  tags: string[];
  environments: Array<{
    id: string;
    name: string;
    tags: string[];
    deployment: {
      id: string;
      status: string;
      deployedAt: string;
      version: {
        id: string;
        name: string;
        isSnapshot: boolean;
        createdAt: string;
        features: any[];
      };
    } | null;
  }>;
}

async function getEnvironmentsView() {
  const environments = await db.query(`
    SELECT 
      e.id as envId,
      e.name as envName,
      e.tags as envTags,
      a.id as appId,
      a.name as appName,
      a.tags as appTags,
      d.id as deploymentId,
      d.status as deploymentStatus,
      d.deployedAt,
      v.id as versionId,
      v.name as versionName,
      v.isSnapshot,
      v.createdAt as versionCreatedAt
    FROM environments e
    LEFT JOIN deployments d ON e.id = d.envId
    LEFT JOIN applications a ON d.appId = a.id
    LEFT JOIN versions v ON d.versionId = v.id
    ORDER BY e.name, a.name
  `) as ViewRow[];

  const groupedEnvironments = environments.reduce((acc: Record<string, GroupedEnvironment>, row: ViewRow) => {
    const envId = row.envId;
    if (!acc[envId]) {
      acc[envId] = {
        id: envId,
        name: row.envName,
        tags: row.envTags ? JSON.parse(row.envTags) : [],
        applications: []
      };
    }
    if (row.appId) {
      const existingApp = acc[envId].applications.find((app: any) => app.id === row.appId);
      if (!existingApp) {
        acc[envId].applications.push({
          id: row.appId,
          name: row.appName,
          tags: row.appTags ? JSON.parse(row.appTags) : [],
          deployment: row.deploymentId ? {
            id: row.deploymentId,
            status: row.deploymentStatus,
            deployedAt: row.deployedAt,
            version: {
              id: row.versionId,
              name: row.versionName,
              isSnapshot: !!row.isSnapshot,
              createdAt: row.versionCreatedAt
            }
          } : null
        });
      }
    }
    return acc;
  }, {});
  return Object.values(groupedEnvironments);
}

async function getApplicationsView() {
  const applications = await db.query(`
    SELECT 
      a.id as appId,
      a.name as appName,
      a.tags as appTags,
      e.id as envId,
      e.name as envName,
      e.tags as envTags,
      d.id as deploymentId,
      d.status as deploymentStatus,
      d.deployedAt,
      v.id as versionId,
      v.name as versionName,
      v.isSnapshot,
      v.createdAt as versionCreatedAt,
      (
        SELECT GROUP_CONCAT(f.id || ':' || f.name || ':' || IFNULL(f.ticketNumber, '') || ':' || IFNULL(f.link, ''))
        FROM feature_versions fv
        JOIN features f ON f.id = fv.featureId
        WHERE fv.versionId = v.id
      ) as featuresRaw
    FROM applications a
    LEFT JOIN deployments d ON a.id = d.appId
    LEFT JOIN environments e ON d.envId = e.id
    LEFT JOIN versions v ON d.versionId = v.id
    ORDER BY a.name, e.name
  `) as (ViewRow & { featuresRaw?: string })[];

  const groupedApplications = applications.reduce((acc: Record<string, GroupedApplication>, row) => {
    const appId = row.appId;
    if (!acc[appId]) {
      acc[appId] = {
        id: appId,
        name: row.appName,
        tags: row.appTags ? JSON.parse(row.appTags) : [],
        environments: []
      };
    }
    if (row.envId) {
      const existingEnv = acc[appId].environments.find((env: any) => env.id === row.envId);
      if (!existingEnv) {
        // Parse features for this version
        let features: any[] = [];
        if (row.featuresRaw) {
          features = row.featuresRaw.split(',').map((f: string) => {
            const [id, name, ticketNumber, link] = f.split(':');
            return { id, name, ticketNumber, link };
          });
        }
        acc[appId].environments.push({
          id: row.envId,
          name: row.envName,
          tags: row.envTags ? JSON.parse(row.envTags) : [],
          deployment: row.deploymentId ? {
            id: row.deploymentId,
            status: row.deploymentStatus,
            deployedAt: row.deployedAt,
            version: {
              id: row.versionId,
              name: row.versionName,
              isSnapshot: !!row.isSnapshot,
              createdAt: row.versionCreatedAt,
              features
            }
          } : null
        });
      }
    }
    return acc;
  }, {});
  return Object.values(groupedApplications);
}

export default defineEventHandler(async (event) => {
  if (event.method === 'GET') {
    const query = getQuery(event);
    const viewType = query.type as string;
    if (viewType === 'environments') {
      return await getEnvironmentsView();
    } else if (viewType === 'applications') {
      return await getApplicationsView();
    } else {
      // Return both views
      return {
        environments: await getEnvironmentsView(),
        applications: await getApplicationsView()
      };
    }
  }
  return { error: 'Method not allowed' };
}); 