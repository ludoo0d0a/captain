import { Connector, ConnectorConfig, ConnectorResult, QueryOptions } from './abstract';

export class XLDeployConnector extends Connector {
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
          error: 'XL Deploy base URL is required in settings'
        };
      }

      // Test connection by fetching XL Deploy info
      const response = await fetch(`${this.baseUrl}/api/v1/info`, {
        headers: this.getHeaders()
      });

      if (!response.ok) {
        return {
          success: false,
          error: `XL Deploy API error: ${response.status} ${response.statusText}`
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
      const response = await fetch(`${this.baseUrl}/api/v1/applications`, {
        headers: this.getHeaders()
      });

      if (!response.ok) {
        return {
          success: false,
          error: `XL Deploy API error: ${response.status} ${response.statusText}`
        };
      }

      const applications = await response.json();
      const apps = applications.map((app: any) => ({
        id: app.id,
        name: app.name,
        tags: ['xldeploy', 'application'],
        metadata: {
          description: app.description,
          version: app.version,
          type: app.type
        }
      }));

      return {
        success: true,
        data: apps
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
      const response = await fetch(`${this.baseUrl}/api/v1/environments`, {
        headers: this.getHeaders()
      });

      if (!response.ok) {
        return {
          success: false,
          error: `XL Deploy API error: ${response.status} ${response.statusText}`
        };
      }

      const environments = await response.json();
      const envs = environments.map((env: any) => ({
        id: env.id,
        name: env.name,
        tags: ['xldeploy', 'environment'],
        metadata: {
          description: env.description,
          type: env.type,
          properties: env.properties
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
      const applicationId = this.config.settings?.applicationId;
      if (!applicationId) {
        return {
          success: false,
          error: 'Application ID is required in settings'
        };
      }

      const response = await fetch(`${this.baseUrl}/api/v1/applications/${applicationId}/versions`, {
        headers: this.getHeaders()
      });

      if (!response.ok) {
        return {
          success: false,
          error: `XL Deploy API error: ${response.status} ${response.statusText}`
        };
      }

      const versions = await response.json();
      const vers = versions.map((version: any) => ({
        id: version.id,
        name: version.name,
        createdAt: version.createdAt,
        isSnapshot: version.isSnapshot || false,
        metadata: {
          description: version.description,
          application: version.application,
          type: version.type
        }
      }));

      return {
        success: true,
        data: vers
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
      const response = await fetch(`${this.baseUrl}/api/v1/deployments`, {
        headers: this.getHeaders()
      });

      if (!response.ok) {
        return {
          success: false,
          error: `XL Deploy API error: ${response.status} ${response.statusText}`
        };
      }

      const deployments = await response.json();
      const deps = deployments.map((deployment: any) => ({
        id: deployment.id,
        environment: deployment.environment,
        status: deployment.status,
        createdAt: deployment.createdAt,
        metadata: {
          application: deployment.application,
          version: deployment.version,
          type: deployment.type,
          description: deployment.description
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
      const response = await fetch(`${this.baseUrl}/api/v1/deployments`, {
        method: 'POST',
        headers: {
          ...this.getHeaders(),
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          application: this.config.settings?.applicationId,
          version: versionId,
          environment: environmentId,
          type: 'deploy'
        })
      });

      if (!response.ok) {
        return {
          success: false,
          error: `XL Deploy API error: ${response.status} ${response.statusText}`
        };
      }

      const result = await response.json();
      return {
        success: true,
        data: result
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  async promoteVersion(versionId: string, fromEnv: string, toEnv: string): Promise<ConnectorResult> {
    try {
      const response = await fetch(`${this.baseUrl}/api/v1/deployments`, {
        method: 'POST',
        headers: {
          ...this.getHeaders(),
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          application: this.config.settings?.applicationId,
          version: versionId,
          environment: toEnv,
          type: 'promote',
          sourceEnvironment: fromEnv
        })
      });

      if (!response.ok) {
        return {
          success: false,
          error: `XL Deploy API error: ${response.status} ${response.statusText}`
        };
      }

      const result = await response.json();
      return {
        success: true,
        data: result
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  async rollbackVersion(environmentId: string, versionId: string): Promise<ConnectorResult> {
    try {
      const response = await fetch(`${this.baseUrl}/api/v1/deployments`, {
        method: 'POST',
        headers: {
          ...this.getHeaders(),
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          application: this.config.settings?.applicationId,
          version: versionId,
          environment: environmentId,
          type: 'rollback'
        })
      });

      if (!response.ok) {
        return {
          success: false,
          error: `XL Deploy API error: ${response.status} ${response.statusText}`
        };
      }

      const result = await response.json();
      return {
        success: true,
        data: result
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  async healthCheck(): Promise<ConnectorResult> {
    return this.connect();
  }

  private getHeaders(): Record<string, string> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json'
    };

    if (this.apiToken) {
      headers['Authorization'] = `Bearer ${this.apiToken}`;
    } else if (this.username && this.password) {
      const auth = Buffer.from(`${this.username}:${this.password}`).toString('base64');
      headers['Authorization'] = `Basic ${auth}`;
    }

    return headers;
  }
} 