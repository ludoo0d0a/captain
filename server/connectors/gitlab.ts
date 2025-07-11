import { Connector, ConnectorConfig, ConnectorResult, QueryOptions } from './abstract';

export class GitLabConnector extends Connector {
  private apiToken?: string;
  private baseUrl: string;

  constructor(config: ConnectorConfig) {
    super(config);
    this.apiToken = config.credentials?.token;
    this.baseUrl = config.settings?.baseUrl || 'https://gitlab.com/api/v4';
  }

  async connect(): Promise<ConnectorResult> {
    try {
      if (!this.apiToken) {
        return {
          success: false,
          error: 'GitLab API token is required'
        };
      }

      // Test connection by fetching user info
      const response = await fetch(`${this.baseUrl}/user`, {
        headers: {
          'Authorization': `Bearer ${this.apiToken}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        return {
          success: false,
          error: `GitLab API error: ${response.status} ${response.statusText}`
        };
      }

      return {
        success: true,
        data: await response.json()
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  async disconnect(): Promise<ConnectorResult> {
    // GitLab doesn't require explicit disconnection
    return { success: true };
  }

  async isConnected(): Promise<boolean> {
    try {
      const result = await this.connect();
      return result.success;
    } catch {
      return false;
    }
  }

  async queryApplications(options?: QueryOptions): Promise<ConnectorResult> {
    try {
      const groupId = this.config.settings?.groupId;
      if (!groupId) {
        return {
          success: false,
          error: 'GitLab group ID is required in settings'
        };
      }

      const response = await fetch(`${this.baseUrl}/groups/${groupId}/projects`, {
        headers: {
          'Authorization': `Bearer ${this.apiToken}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        return {
          success: false,
          error: `GitLab API error: ${response.status} ${response.statusText}`
        };
      }

      const projects = await response.json();
      const applications = projects.map((project: any) => ({
        id: project.id.toString(),
        name: project.name,
        tags: [project.language, project.visibility],
        metadata: {
          description: project.description,
          url: project.web_url,
          stars: project.star_count,
          forks: project.forks_count
        }
      }));

      return {
        success: true,
        data: applications
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  async queryEnvironments(options?: QueryOptions): Promise<ConnectorResult> {
    try {
      const projectId = this.config.settings?.projectId;
      if (!projectId) {
        return {
          success: false,
          error: 'GitLab project ID is required in settings'
        };
      }

      const response = await fetch(`${this.baseUrl}/projects/${projectId}/environments`, {
        headers: {
          'Authorization': `Bearer ${this.apiToken}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        return {
          success: false,
          error: `GitLab API error: ${response.status} ${response.statusText}`
        };
      }

      const environments = await response.json();
      const envs = environments.map((env: any) => ({
        id: env.id.toString(),
        name: env.name,
        tags: ['gitlab', 'environment'],
        metadata: {
          external_url: env.external_url,
          state: env.state
        }
      }));

      return {
        success: true,
        data: envs
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  async queryVersions(options?: QueryOptions): Promise<ConnectorResult> {
    try {
      const projectId = this.config.settings?.projectId;
      if (!projectId) {
        return {
          success: false,
          error: 'GitLab project ID is required in settings'
        };
      }

      const response = await fetch(`${this.baseUrl}/projects/${projectId}/releases`, {
        headers: {
          'Authorization': `Bearer ${this.apiToken}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        return {
          success: false,
          error: `GitLab API error: ${response.status} ${response.statusText}`
        };
      }

      const releases = await response.json();
      const versions = releases.map((release: any) => ({
        id: release.id.toString(),
        name: release.tag_name,
        createdAt: release.created_at,
        isSnapshot: false, // GitLab releases are typically not snapshots
        metadata: {
          description: release.description,
          assets: release.assets
        }
      }));

      return {
        success: true,
        data: versions
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  async queryDeployments(options?: QueryOptions): Promise<ConnectorResult> {
    try {
      const projectId = this.config.settings?.projectId;
      if (!projectId) {
        return {
          success: false,
          error: 'GitLab project ID is required in settings'
        };
      }

      const response = await fetch(`${this.baseUrl}/projects/${projectId}/deployments`, {
        headers: {
          'Authorization': `Bearer ${this.apiToken}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        return {
          success: false,
          error: `GitLab API error: ${response.status} ${response.statusText}`
        };
      }

      const deployments = await response.json();
      const deps = deployments.map((deployment: any) => ({
        id: deployment.id.toString(),
        environment: deployment.environment.name,
        status: deployment.status,
        createdAt: deployment.created_at,
        metadata: {
          ref: deployment.ref,
          sha: deployment.sha,
          user: deployment.user?.name
        }
      }));

      return {
        success: true,
        data: deps
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  async deployVersion(versionId: string, environmentId: string): Promise<ConnectorResult> {
    try {
      const projectId = this.config.settings?.projectId;
      if (!projectId) {
        return {
          success: false,
          error: 'GitLab project ID is required in settings'
        };
      }

      // Create a deployment by triggering a pipeline
      const response = await fetch(`${this.baseUrl}/projects/${projectId}/pipeline`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ref: versionId,
          variables: [
            {
              key: 'ENVIRONMENT',
              value: environmentId
            }
          ]
        })
      });

      if (!response.ok) {
        return {
          success: false,
          error: `GitLab API error: ${response.status} ${response.statusText}`
        };
      }

      const pipeline = await response.json();
      return {
        success: true,
        data: pipeline
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  async promoteVersion(versionId: string, fromEnv: string, toEnv: string): Promise<ConnectorResult> {
    // For GitLab, promotion is typically done by triggering a new pipeline
    return this.deployVersion(versionId, toEnv);
  }

  async rollbackVersion(environmentId: string, versionId: string): Promise<ConnectorResult> {
    // For GitLab, rollback is typically done by triggering a new pipeline with a previous ref
    return this.deployVersion(versionId, environmentId);
  }

  async healthCheck(): Promise<ConnectorResult> {
    return this.connect();
  }
} 