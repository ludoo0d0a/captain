import { Connector, ConnectorConfig, ConnectorResult, QueryOptions } from './abstract';

export class KubernetesConnector extends Connector {
  private baseUrl: string;
  private token?: string;
  private namespace?: string;

  constructor(config: ConnectorConfig) {
    super(config);
    this.baseUrl = config.settings?.baseUrl || 'https://kubernetes.default.svc';
    this.token = config.credentials?.token;
    this.namespace = config.settings?.namespace || 'default';
  }

  async connect(): Promise<ConnectorResult> {
    try {
      // Test connection by fetching API resources
      const response = await fetch(`${this.baseUrl}/api/v1/namespaces`, {
        headers: this.getHeaders()
      });

      if (!response.ok) {
        return {
          success: false,
          error: `Kubernetes API error: ${response.status} ${response.statusText}`
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
    // Kubernetes doesn't require explicit disconnection
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
      // Get Deployments as applications
      const response = await fetch(`${this.baseUrl}/apis/apps/v1/namespaces/${this.namespace}/deployments`, {
        headers: this.getHeaders()
      });

      if (!response.ok) {
        return {
          success: false,
          error: `Kubernetes API error: ${response.status} ${response.statusText}`
        };
      }

      const deployments = await response.json();
      const applications = deployments.items?.map((deployment: any) => ({
        id: deployment.metadata.uid,
        name: deployment.metadata.name,
        tags: deployment.metadata.labels ? Object.values(deployment.metadata.labels) : [],
        metadata: {
          replicas: deployment.spec.replicas,
          image: deployment.spec.template.spec.containers[0]?.image,
          labels: deployment.metadata.labels,
          annotations: deployment.metadata.annotations
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
      // Get Namespaces as environments
      const response = await fetch(`${this.baseUrl}/api/v1/namespaces`, {
        headers: this.getHeaders()
      });

      if (!response.ok) {
        return {
          success: false,
          error: `Kubernetes API error: ${response.status} ${response.statusText}`
        };
      }

      const namespaces = await response.json();
      const environments = namespaces.items?.map((namespace: any) => ({
        id: namespace.metadata.uid,
        name: namespace.metadata.name,
        tags: ['kubernetes', 'namespace'],
        metadata: {
          status: namespace.status.phase,
          labels: namespace.metadata.labels,
          annotations: namespace.metadata.annotations
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
      // Get Deployments and extract image versions
      const response = await fetch(`${this.baseUrl}/apis/apps/v1/namespaces/${this.namespace}/deployments`, {
        headers: this.getHeaders()
      });

      if (!response.ok) {
        return {
          success: false,
          error: `Kubernetes API error: ${response.status} ${response.statusText}`
        };
      }

      const deployments = await response.json();
      const versions = deployments.items?.map((deployment: any) => ({
        id: deployment.metadata.uid,
        name: deployment.spec.template.spec.containers[0]?.image || 'unknown',
        createdAt: deployment.metadata.creationTimestamp,
        isSnapshot: deployment.spec.template.spec.containers[0]?.image?.includes('latest') || false,
        metadata: {
          replicas: deployment.spec.replicas,
          labels: deployment.metadata.labels,
          annotations: deployment.metadata.annotations
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
      // Get ReplicaSets as deployments
      const response = await fetch(`${this.baseUrl}/apis/apps/v1/namespaces/${this.namespace}/replicasets`, {
        headers: this.getHeaders()
      });

      if (!response.ok) {
        return {
          success: false,
          error: `Kubernetes API error: ${response.status} ${response.statusText}`
        };
      }

      const replicasets = await response.json();
      const deployments = replicasets.items?.map((rs: any) => ({
        id: rs.metadata.uid,
        environment: rs.metadata.namespace,
        status: rs.status.readyReplicas === rs.status.replicas ? 'ready' : 'pending',
        createdAt: rs.metadata.creationTimestamp,
        metadata: {
          replicas: rs.status.replicas,
          readyReplicas: rs.status.readyReplicas,
          image: rs.spec.template.spec.containers[0]?.image,
          labels: rs.metadata.labels
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
      // Create a new deployment with the specified image
      const deployment = {
        apiVersion: 'apps/v1',
        kind: 'Deployment',
        metadata: {
          name: `deployment-${Date.now()}`,
          namespace: environmentId
        },
        spec: {
          replicas: 1,
          selector: {
            matchLabels: {
              app: `deployment-${Date.now()}`
            }
          },
          template: {
            metadata: {
              labels: {
                app: `deployment-${Date.now()}`
              }
            },
            spec: {
              containers: [
                {
                  name: 'app',
                  image: versionId
                }
              ]
            }
          }
        }
      };

      const response = await fetch(`${this.baseUrl}/apis/apps/v1/namespaces/${environmentId}/deployments`, {
        method: 'POST',
        headers: {
          ...this.getHeaders(),
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(deployment)
      });

      if (!response.ok) {
        return {
          success: false,
          error: `Kubernetes API error: ${response.status} ${response.statusText}`
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
    // For Kubernetes, promotion is typically done by creating a new deployment in the target namespace
    return this.deployVersion(versionId, toEnv);
  }

  async rollbackVersion(environmentId: string, versionId: string): Promise<ConnectorResult> {
    try {
      // Get current deployments in the environment
      const response = await fetch(`${this.baseUrl}/apis/apps/v1/namespaces/${environmentId}/deployments`, {
        headers: this.getHeaders()
      });

      if (!response.ok) {
        return {
          success: false,
          error: `Kubernetes API error: ${response.status} ${response.statusText}`
        };
      }

      const deployments = await response.json();
      
      // Update the deployment to use the rollback version
      for (const deployment of deployments.items || []) {
        const patchResponse = await fetch(`${this.baseUrl}/apis/apps/v1/namespaces/${environmentId}/deployments/${deployment.metadata.name}`, {
          method: 'PATCH',
          headers: {
            ...this.getHeaders(),
            'Content-Type': 'application/strategic-merge-patch+json'
          },
          body: JSON.stringify({
            spec: {
              template: {
                spec: {
                  containers: [
                    {
                      name: 'app',
                      image: versionId
                    }
                  ]
                }
              }
            }
          })
        });

        if (!patchResponse.ok) {
          return {
            success: false,
            error: `Failed to rollback deployment: ${patchResponse.status} ${patchResponse.statusText}`
          };
        }
      }

      return {
        success: true,
        data: { message: 'Rollback completed' }
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

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    return headers;
  }
} 