import { Connector, ConnectorConfig, ConnectorResult, QueryOptions } from './abstract';

export class HttpConnector extends Connector {
  private baseUrl: string;
  private headers: Record<string, string>;
  private auth?: { type: 'basic' | 'bearer' | 'api-key'; credentials: any };

  constructor(config: ConnectorConfig) {
    super(config);
    this.baseUrl = config.settings?.baseUrl || '';
    this.headers = config.settings?.headers || {};
    this.auth = config.credentials as { type: 'basic' | 'bearer' | 'api-key'; credentials: any };
  }

  async connect(): Promise<ConnectorResult> {
    try {
      if (!this.baseUrl) {
        return {
          success: false,
          error: 'Base URL is required in settings'
        };
      }

      // Test connection by making a health check request
      const response = await fetch(`${this.baseUrl}/health`, {
        headers: this.getHeaders()
      });

      if (!response.ok) {
        return {
          success: false,
          error: `HTTP API error: ${response.status} ${response.statusText}`
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
      const endpoint = this.config.settings?.applicationsEndpoint || '/applications';
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        headers: this.getHeaders()
      });

      if (!response.ok) {
        return {
          success: false,
          error: `HTTP API error: ${response.status} ${response.statusText}`
        };
      }

      const data = await response.json();
      const applications = Array.isArray(data) ? data : data.applications || [];

      return {
        success: true,
        data: applications.map((app: any) => ({
          id: app.id || app.name,
          name: app.name,
          tags: app.tags || [],
          metadata: app.metadata || {}
        }))
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
      const endpoint = this.config.settings?.environmentsEndpoint || '/environments';
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        headers: this.getHeaders()
      });

      if (!response.ok) {
        return {
          success: false,
          error: `HTTP API error: ${response.status} ${response.statusText}`
        };
      }

      const data = await response.json();
      const environments = Array.isArray(data) ? data : data.environments || [];

      return {
        success: true,
        data: environments.map((env: any) => ({
          id: env.id || env.name,
          name: env.name,
          tags: env.tags || ['http', 'environment'],
          metadata: env.metadata || {}
        }))
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
      const endpoint = this.config.settings?.versionsEndpoint || '/versions';
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        headers: this.getHeaders()
      });

      if (!response.ok) {
        return {
          success: false,
          error: `HTTP API error: ${response.status} ${response.statusText}`
        };
      }

      const data = await response.json();
      const versions = Array.isArray(data) ? data : data.versions || [];

      return {
        success: true,
        data: versions.map((version: any) => ({
          id: version.id || version.name,
          name: version.name,
          createdAt: version.createdAt || version.created_at,
          isSnapshot: version.isSnapshot || false,
          metadata: version.metadata || {}
        }))
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
      const endpoint = this.config.settings?.deploymentsEndpoint || '/deployments';
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        headers: this.getHeaders()
      });

      if (!response.ok) {
        return {
          success: false,
          error: `HTTP API error: ${response.status} ${response.statusText}`
        };
      }

      const data = await response.json();
      const deployments = Array.isArray(data) ? data : data.deployments || [];

      return {
        success: true,
        data: deployments.map((deployment: any) => ({
          id: deployment.id,
          environment: deployment.environment,
          status: deployment.status,
          createdAt: deployment.createdAt || deployment.created_at,
          metadata: deployment.metadata || {}
        }))
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
      const endpoint = this.config.settings?.deployEndpoint || '/deploy';
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: 'POST',
        headers: {
          ...this.getHeaders(),
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          versionId,
          environmentId
        })
      });

      if (!response.ok) {
        return {
          success: false,
          error: `HTTP API error: ${response.status} ${response.statusText}`
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
      const endpoint = this.config.settings?.promoteEndpoint || '/promote';
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: 'POST',
        headers: {
          ...this.getHeaders(),
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          versionId,
          fromEnv,
          toEnv
        })
      });

      if (!response.ok) {
        return {
          success: false,
          error: `HTTP API error: ${response.status} ${response.statusText}`
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
      const endpoint = this.config.settings?.rollbackEndpoint || '/rollback';
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: 'POST',
        headers: {
          ...this.getHeaders(),
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          environmentId,
          versionId
        })
      });

      if (!response.ok) {
        return {
          success: false,
          error: `HTTP API error: ${response.status} ${response.statusText}`
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
    const headers = { ...this.headers };

    if (this.auth) {
      switch (this.auth.type) {
        case 'basic':
          const basicAuth = Buffer.from(`${this.auth.credentials.username}:${this.auth.credentials.password}`).toString('base64');
          headers['Authorization'] = `Basic ${basicAuth}`;
          break;
        case 'bearer':
          headers['Authorization'] = `Bearer ${this.auth.credentials.token}`;
          break;
        case 'api-key':
          headers[this.auth.credentials.header || 'X-API-Key'] = this.auth.credentials.key;
          break;
      }
    }

    return headers;
  }
} 