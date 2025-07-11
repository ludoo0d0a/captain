import { Connector, ConnectorConfig, ConnectorResult, QueryOptions } from './abstract';

export class DockerConnector extends Connector {
  private baseUrl: string;
  private credentials?: { username?: string; password?: string };

  constructor(config: ConnectorConfig) {
    super(config);
    this.baseUrl = config.settings?.baseUrl || 'http://localhost:2375';
    this.credentials = config.credentials;
  }

  async connect(): Promise<ConnectorResult> {
    try {
      // Test connection by fetching Docker info
      const response = await fetch(`${this.baseUrl}/info`, {
        headers: this.getHeaders()
      });

      if (!response.ok) {
        return {
          success: false,
          error: `Docker API error: ${response.status} ${response.statusText}`
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
    // Docker doesn't require explicit disconnection
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
      // Get Docker images as applications
      const response = await fetch(`${this.baseUrl}/images/json`, {
        headers: this.getHeaders()
      });

      if (!response.ok) {
        return {
          success: false,
          error: `Docker API error: ${response.status} ${response.statusText}`
        };
      }

      const images = await response.json();
      const applications = images.map((image: any) => ({
        id: image.Id,
        name: image.RepoTags?.[0] || image.Id.substring(0, 12),
        tags: image.RepoTags || [],
        metadata: {
          size: image.Size,
          created: image.Created,
          labels: image.Labels
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
      // Get Docker networks as environments
      const response = await fetch(`${this.baseUrl}/networks`, {
        headers: this.getHeaders()
      });

      if (!response.ok) {
        return {
          success: false,
          error: `Docker API error: ${response.status} ${response.statusText}`
        };
      }

      const networks = await response.json();
      const environments = networks.Networks?.map((network: any) => ({
        id: network.Id,
        name: network.Name,
        tags: ['docker', 'network'],
        metadata: {
          driver: network.Driver,
          scope: network.Scope,
          ipam: network.IPAM
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
      // Get Docker image tags as versions
      const response = await fetch(`${this.baseUrl}/images/json`, {
        headers: this.getHeaders()
      });

      if (!response.ok) {
        return {
          success: false,
          error: `Docker API error: ${response.status} ${response.statusText}`
        };
      }

      const images = await response.json();
      const versions = images.map((image: any) => ({
        id: image.Id,
        name: image.RepoTags?.[0] || image.Id.substring(0, 12),
        createdAt: new Date(image.Created * 1000).toISOString(),
        isSnapshot: image.RepoTags?.some((tag: string) => tag.includes('latest') || tag.includes('dev')),
        metadata: {
          size: image.Size,
          labels: image.Labels
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
      // Get Docker containers as deployments
      const response = await fetch(`${this.baseUrl}/containers/json?all=true`, {
        headers: this.getHeaders()
      });

      if (!response.ok) {
        return {
          success: false,
          error: `Docker API error: ${response.status} ${response.statusText}`
        };
      }

      const containers = await response.json();
      const deployments = containers.map((container: any) => ({
        id: container.Id,
        environment: container.NetworkSettings?.Networks?.[Object.keys(container.NetworkSettings.Networks)[0]]?.NetworkID || 'default',
        status: container.State,
        createdAt: container.Created,
        metadata: {
          image: container.Image,
          command: container.Command,
          ports: container.Ports
        }
      }));

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
      // Create a new container from the image
      const response = await fetch(`${this.baseUrl}/containers/create`, {
        method: 'POST',
        headers: {
          ...this.getHeaders(),
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          Image: versionId,
          NetworkMode: environmentId,
          name: `deployment-${Date.now()}`
        })
      });

      if (!response.ok) {
        return {
          success: false,
          error: `Docker API error: ${response.status} ${response.statusText}`
        };
      }

      const container = await response.json();

      // Start the container
      const startResponse = await fetch(`${this.baseUrl}/containers/${container.Id}/start`, {
        method: 'POST',
        headers: this.getHeaders()
      });

      if (!startResponse.ok) {
        return {
          success: false,
          error: `Failed to start container: ${startResponse.status} ${startResponse.statusText}`
        };
      }

      return {
        success: true,
        data: container
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  async promoteVersion(versionId: string, fromEnv: string, toEnv: string): Promise<ConnectorResult> {
    // For Docker, promotion is typically done by creating a new container in the target network
    return this.deployVersion(versionId, toEnv);
  }

  async rollbackVersion(environmentId: string, versionId: string): Promise<ConnectorResult> {
    // For Docker, rollback is typically done by stopping current containers and starting with previous image
    try {
      // Stop all containers in the environment
      const containersResponse = await fetch(`${this.baseUrl}/containers/json?all=true`, {
        headers: this.getHeaders()
      });

      if (!containersResponse.ok) {
        return {
          success: false,
          error: `Docker API error: ${containersResponse.status} ${containersResponse.statusText}`
        };
      }

      const containers = await containersResponse.json();
      const envContainers = containers.filter((container: any) => 
        container.NetworkSettings?.Networks?.[environmentId]
      );

      // Stop containers
      for (const container of envContainers) {
        await fetch(`${this.baseUrl}/containers/${container.Id}/stop`, {
          method: 'POST',
          headers: this.getHeaders()
        });
      }

      // Deploy the rollback version
      return this.deployVersion(versionId, environmentId);
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

    if (this.credentials?.username && this.credentials?.password) {
      const auth = Buffer.from(`${this.credentials.username}:${this.credentials.password}`).toString('base64');
      headers['Authorization'] = `Basic ${auth}`;
    }

    return headers;
  }
} 