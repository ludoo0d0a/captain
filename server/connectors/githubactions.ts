import { Connector, ConnectorConfig, ConnectorResult, QueryOptions } from './abstract';

export class GitHubActionsConnector extends Connector {
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
        tags: [repo.language, repo.private ? 'private' : 'public', 'github-actions'],
        metadata: {
          description: repo.description,
          url: repo.html_url,
          hasWorkflows: true
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
        tags: ['github-actions', 'environment'],
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

      // Get workflow runs as versions
      const response = await fetch(`${this.baseUrl}/repos/${repo}/actions/runs`, {
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

      const runs = await response.json();
      const versions = runs.workflow_runs?.map((run: any) => ({
        id: run.id.toString(),
        name: run.head_branch || run.run_number.toString(),
        createdAt: run.created_at,
        isSnapshot: run.head_branch !== 'main' && run.head_branch !== 'master',
        metadata: {
          status: run.status,
          conclusion: run.conclusion,
          workflow_name: run.name,
          commit_sha: run.head_sha
        }
      })) || [];

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

      // Get workflow runs as deployments
      const response = await fetch(`${this.baseUrl}/repos/${repo}/actions/runs?event=deployment`, {
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

      const runs = await response.json();
      const deployments = runs.workflow_runs?.map((run: any) => ({
        id: run.id.toString(),
        environment: run.environment || 'production',
        status: run.status,
        createdAt: run.created_at,
        metadata: {
          workflow_name: run.name,
          commit_sha: run.head_sha,
          branch: run.head_branch
        }
      })) || [];

      return {
        success: true,
        data: deployments
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

      // Trigger a workflow run for deployment
      const response = await fetch(`${this.baseUrl}/repos/${repo}/actions/workflows/deploy.yml/dispatches`, {
        method: 'POST',
        headers: {
          'Authorization': `token ${this.apiToken}`,
          'Accept': 'application/vnd.github.v3+json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ref: versionId,
          inputs: {
            environment: environmentId
          }
        })
      });

      if (!response.ok) {
        return {
          success: false,
          error: `GitHub API error: ${response.status} ${response.statusText}`
        };
      }

      return {
        success: true,
        data: { message: 'Workflow triggered successfully' }
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  async promoteVersion(versionId: string, fromEnv: string, toEnv: string): Promise<ConnectorResult> {
    // For GitHub Actions, promotion is typically done by triggering a promotion workflow
    return this.deployVersion(versionId, toEnv);
  }

  async rollbackVersion(environmentId: string, versionId: string): Promise<ConnectorResult> {
    // For GitHub Actions, rollback is typically done by triggering a rollback workflow
    return this.deployVersion(versionId, environmentId);
  }

  async healthCheck(): Promise<ConnectorResult> {
    return this.connect();
  }
} 