import { Connector, ConnectorConfig, ConnectorResult, QueryOptions } from './abstract';

export class JenkinsConnector extends Connector {
  private baseUrl: string;
  private username?: string;
  private password?: string;
  private apiToken?: string;

  constructor(config: ConnectorConfig) {
    super(config);
    this.baseUrl = config.settings?.baseUrl || '';
    this.username = config.credentials?.username;
    this.password = config.credentials?.password;
    this.apiToken = config.credentials?.apiToken;
  }

  async connect(): Promise<ConnectorResult> {
    try {
      if (!this.baseUrl) {
        return {
          success: false,
          error: 'Jenkins base URL is required in settings'
        };
      }

      // Test connection by fetching Jenkins info
      const response = await fetch(`${this.baseUrl}/api/json`, {
        headers: this.getHeaders()
      });

      if (!response.ok) {
        return {
          success: false,
          error: `Jenkins API error: ${response.status} ${response.statusText}`
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
      const response = await fetch(`${this.baseUrl}/api/json?tree=jobs[name,url,color,description]`, {
        headers: this.getHeaders()
      });

      if (!response.ok) {
        return {
          success: false,
          error: `Jenkins API error: ${response.status} ${response.statusText}`
        };
      }

      const data = await response.json();
      const applications = data.jobs?.map((job: any) => ({
        id: job.name,
        name: job.name,
        tags: ['jenkins', 'job'],
        metadata: {
          url: job.url,
          status: job.color,
          description: job.description
        }
      })) || [];

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
      // Jenkins environments are typically represented by different views or folders
      const response = await fetch(`${this.baseUrl}/api/json?tree=views[name,url,description]`, {
        headers: this.getHeaders()
      });

      if (!response.ok) {
        return {
          success: false,
          error: `Jenkins API error: ${response.status} ${response.statusText}`
        };
      }

      const data = await response.json();
      const environments = data.views?.map((view: any) => ({
        id: view.name,
        name: view.name,
        tags: ['jenkins', 'environment'],
        metadata: {
          url: view.url,
          description: view.description
        }
      })) || [];

      return {
        success: true,
        data: environments
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
      const jobName = this.config.settings?.jobName;
      if (!jobName) {
        return {
          success: false,
          error: 'Job name is required in settings'
        };
      }

      const response = await fetch(`${this.baseUrl}/job/${jobName}/api/json?tree=builds[number,url,timestamp,result,description]`, {
        headers: this.getHeaders()
      });

      if (!response.ok) {
        return {
          success: false,
          error: `Jenkins API error: ${response.status} ${response.statusText}`
        };
      }

      const data = await response.json();
      const versions = data.builds?.map((build: any) => ({
        id: build.number.toString(),
        name: `#${build.number}`,
        createdAt: new Date(build.timestamp).toISOString(),
        isSnapshot: build.result === 'UNSTABLE' || build.result === 'FAILURE',
        metadata: {
          url: build.url,
          result: build.result,
          description: build.description
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
      const jobName = this.config.settings?.jobName;
      if (!jobName) {
        return {
          success: false,
          error: 'Job name is required in settings'
        };
      }

      const response = await fetch(`${this.baseUrl}/job/${jobName}/api/json?tree=builds[number,url,timestamp,result,description,actions[*]]`, {
        headers: this.getHeaders()
      });

      if (!response.ok) {
        return {
          success: false,
          error: `Jenkins API error: ${response.status} ${response.statusText}`
        };
      }

      const data = await response.json();
      const deployments = data.builds?.map((build: any) => ({
        id: build.number.toString(),
        environment: this.config.settings?.environment || 'default',
        status: build.result === 'SUCCESS' ? 'deployed' : 'failed',
        createdAt: new Date(build.timestamp).toISOString(),
        metadata: {
          url: build.url,
          result: build.result,
          description: build.description
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
      const jobName = this.config.settings?.jobName;
      if (!jobName) {
        return {
          success: false,
          error: 'Job name is required in settings'
        };
      }

      // Trigger a build with parameters
      const response = await fetch(`${this.baseUrl}/job/${jobName}/buildWithParameters`, {
        method: 'POST',
        headers: {
          ...this.getHeaders(),
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams({
          VERSION: versionId,
          ENVIRONMENT: environmentId
        }).toString()
      });

      if (!response.ok) {
        return {
          success: false,
          error: `Jenkins API error: ${response.status} ${response.statusText}`
        };
      }

      return {
        success: true,
        data: { message: 'Build triggered successfully' }
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  async promoteVersion(versionId: string, fromEnv: string, toEnv: string): Promise<ConnectorResult> {
    // For Jenkins, promotion is typically done by triggering a promotion job
    return this.deployVersion(versionId, toEnv);
  }

  async rollbackVersion(environmentId: string, versionId: string): Promise<ConnectorResult> {
    // For Jenkins, rollback is typically done by triggering a rollback job
    return this.deployVersion(versionId, environmentId);
  }

  async healthCheck(): Promise<ConnectorResult> {
    return this.connect();
  }

  private getHeaders(): Record<string, string> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json'
    };

    if (this.apiToken) {
      // Use API token authentication
      const auth = Buffer.from(`${this.username}:${this.apiToken}`).toString('base64');
      headers['Authorization'] = `Basic ${auth}`;
    } else if (this.username && this.password) {
      // Use username/password authentication
      const auth = Buffer.from(`${this.username}:${this.password}`).toString('base64');
      headers['Authorization'] = `Basic ${auth}`;
    }

    return headers;
  }
} 