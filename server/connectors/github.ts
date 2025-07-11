import { Connector, ConnectorConfig, ConnectorResult, QueryOptions } from './abstract';

export class GitHubConnector extends Connector {
  private apiToken?: string;
  private baseUrl = 'https://api.github.com';

  constructor(config: ConnectorConfig) {
    super(config);
    this.apiToken = config.credentials?.token;
  }

  async connect(): Promise<ConnectorResult> {
    try {
      if (!this.apiToken) {
        return {
          success: false,
          error: 'GitHub API token is required'
        };
      }

      // Test connection by fetching user info
      const response = await fetch(`${this.baseUrl}/user`, {
        headers: {
          'Authorization': `token ${this.apiToken}`,
          'Accept': 'application/vnd.github.v3+json'
        }
      });

      if (!response.ok) {
        return {
          success: false,
          error: `GitHub API error: ${response.status} ${response.statusText}`
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
    // GitHub doesn't require explicit disconnection
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
      const org = this.config.settings?.organization;
      if (!org) {
        return {
          success: false,
          error: 'GitHub organization is required in settings'
        };
      }

      const response = await fetch(`${this.baseUrl}/orgs/${org}/repos`, {
        headers: {
          'Authorization': `token ${this.apiToken}`,
          'Accept': 'application/vnd.github.v3+json'
        }
      });

      if (!response.ok) {
        return {
          success: false,
          error: `GitHub API error: ${response.status} ${response.statusText}`
        };
      }

      const repos = await response.json();
      const applications = repos.map((repo: any) => ({
        id: repo.id.toString(),
        name: repo.name,
        tags: [repo.language, repo.private ? 'private' : 'public'],
        metadata: {
          description: repo.description,
          url: repo.html_url,
          stars: repo.stargazers_count,
          forks: repo.forks_count
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
      const repo = this.config.settings?.repository;
      if (!repo) {
        return {
          success: false,
          error: 'GitHub repository is required in settings'
        };
      }

      const response = await fetch(`${this.baseUrl}/repos/${repo}/environments`, {
        headers: {
          'Authorization': `token ${this.apiToken}`,
          'Accept': 'application/vnd.github.v3+json'
        }
      });

      if (!response.ok) {
        return {
          success: false,
          error: `GitHub API error: ${response.status} ${response.statusText}`
        };
      }

      const environments = await response.json();
      const envs = environments.environments?.map((env: any) => ({
        id: env.id.toString(),
        name: env.name,
        tags: ['github', 'environment'],
        metadata: {
          protection_rules: env.protection_rules
        }
      })) || [];

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
      const repo = this.config.settings?.repository;
      if (!repo) {
        return {
          success: false,
          error: 'GitHub repository is required in settings'
        };
      }

      const response = await fetch(`${this.baseUrl}/repos/${repo}/releases`, {
        headers: {
          'Authorization': `token ${this.apiToken}`,
          'Accept': 'application/vnd.github.v3+json'
        }
      });

      if (!response.ok) {
        return {
          success: false,
          error: `GitHub API error: ${response.status} ${response.statusText}`
        };
      }

      const releases = await response.json();
      const versions = releases.map((release: any) => ({
        id: release.id.toString(),
        name: release.tag_name,
        createdAt: release.created_at,
        isSnapshot: release.prerelease,
        metadata: {
          body: release.body,
          url: release.html_url,
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
      const repo = this.config.settings?.repository;
      if (!repo) {
        return {
          success: false,
          error: 'GitHub repository is required in settings'
        };
      }

      const response = await fetch(`${this.baseUrl}/repos/${repo}/deployments`, {
        headers: {
          'Authorization': `token ${this.apiToken}`,
          'Accept': 'application/vnd.github.v3+json'
        }
      });

      if (!response.ok) {
        return {
          success: false,
          error: `GitHub API error: ${response.status} ${response.statusText}`
        };
      }

      const deployments = await response.json();
      const deps = deployments.map((deployment: any) => ({
        id: deployment.id.toString(),
        environment: deployment.environment,
        status: deployment.state,
        createdAt: deployment.created_at,
        metadata: {
          ref: deployment.ref,
          sha: deployment.sha,
          task: deployment.task
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
      const repo = this.config.settings?.repository;
      if (!repo) {
        return {
          success: false,
          error: 'GitHub repository is required in settings'
        };
      }

      // Create a deployment
      const response = await fetch(`${this.baseUrl}/repos/${repo}/deployments`, {
        method: 'POST',
        headers: {
          'Authorization': `token ${this.apiToken}`,
          'Accept': 'application/vnd.github.v3+json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ref: versionId,
          environment: environmentId,
          auto_merge: false
        })
      });

      if (!response.ok) {
        return {
          success: false,
          error: `GitHub API error: ${response.status} ${response.statusText}`
        };
      }

      const deployment = await response.json();
      return {
        success: true,
        data: deployment
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  async promoteVersion(versionId: string, fromEnv: string, toEnv: string): Promise<ConnectorResult> {
    // For GitHub, promotion is typically done by creating a new deployment
    return this.deployVersion(versionId, toEnv);
  }

  async rollbackVersion(environmentId: string, versionId: string): Promise<ConnectorResult> {
    // For GitHub, rollback is typically done by creating a new deployment with a previous ref
    return this.deployVersion(versionId, environmentId);
  }

  async healthCheck(): Promise<ConnectorResult> {
    return this.connect();
  }
} 