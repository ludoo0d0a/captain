import { Connector, ConnectorConfig, ConnectorResult, QueryOptions } from './abstract';
import { GitHubConnector } from './github';
import { GitLabConnector } from './gitlab';
import { DockerConnector } from './docker';
import { KubernetesConnector } from './kubernetes';
import { GitHubActionsConnector } from './githubactions';
import { HttpConnector } from './http';
import { JenkinsConnector } from './jenkins';
import { SshConnector } from './ssh';
import { XLDeployConnector } from './xldeploy';
import { GooglePlayStoreConnector } from './googleplaystore';

export class ConnectorManager {
  private connectors: Map<string, Connector> = new Map();

  // Register a new connector
  registerConnector(config: ConnectorConfig): Connector {
    let connector: Connector;

    switch (config.type.toLowerCase()) {
      case 'github':
        connector = new GitHubConnector(config);
        break;
      case 'gitlab':
        connector = new GitLabConnector(config);
        break;
      case 'docker':
        connector = new DockerConnector(config);
        break;
      case 'kubernetes':
        connector = new KubernetesConnector(config);
        break;
      case 'githubactions':
        connector = new GitHubActionsConnector(config);
        break;
      case 'http':
        connector = new HttpConnector(config);
        break;
      case 'jenkins':
        connector = new JenkinsConnector(config);
        break;
      case 'ssh':
        connector = new SshConnector(config);
        break;
      case 'xldeploy':
        connector = new XLDeployConnector(config);
        break;
      case 'googleplaystore':
        connector = new GooglePlayStoreConnector(config);
        break;
      default:
        throw new Error(`Unsupported connector type: ${config.type}`);
    }

    this.connectors.set(config.name, connector);
    return connector;
  }

  // Get a connector by name
  getConnector(name: string): Connector | undefined {
    return this.connectors.get(name);
  }

  // Get all connectors
  getAllConnectors(): Connector[] {
    return Array.from(this.connectors.values());
  }

  // Remove a connector
  removeConnector(name: string): boolean {
    return this.connectors.delete(name);
  }

  // Connect all connectors
  async connectAll(): Promise<ConnectorResult[]> {
    const results: ConnectorResult[] = [];
    
    for (const connector of this.connectors.values()) {
      try {
        const result = await connector.connect();
        results.push(result);
      } catch (error) {
        results.push({
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error',
          metadata: { connector: connector.getInfo().name }
        });
      }
    }
    
    return results;
  }

  // Disconnect all connectors
  async disconnectAll(): Promise<ConnectorResult[]> {
    const results: ConnectorResult[] = [];
    
    for (const connector of this.connectors.values()) {
      try {
        const result = await connector.disconnect();
        results.push(result);
      } catch (error) {
        results.push({
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error',
          metadata: { connector: connector.getInfo().name }
        });
      }
    }
    
    return results;
  }

  // Query applications from all connectors
  async queryAllApplications(options?: QueryOptions): Promise<ConnectorResult[]> {
    const results: ConnectorResult[] = [];
    
    for (const connector of this.connectors.values()) {
      try {
        const result = await connector.queryApplications(options);
        results.push(result);
      } catch (error) {
        results.push({
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error',
          metadata: { connector: connector.getInfo().name }
        });
      }
    }
    
    return results;
  }

  // Query environments from all connectors
  async queryAllEnvironments(options?: QueryOptions): Promise<ConnectorResult[]> {
    const results: ConnectorResult[] = [];
    
    for (const connector of this.connectors.values()) {
      try {
        const result = await connector.queryEnvironments(options);
        results.push(result);
      } catch (error) {
        results.push({
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error',
          metadata: { connector: connector.getInfo().name }
        });
      }
    }
    
    return results;
  }

  // Query versions from all connectors
  async queryAllVersions(options?: QueryOptions): Promise<ConnectorResult[]> {
    const results: ConnectorResult[] = [];
    
    for (const connector of this.connectors.values()) {
      try {
        const result = await connector.queryVersions(options);
        results.push(result);
      } catch (error) {
        results.push({
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error',
          metadata: { connector: connector.getInfo().name }
        });
      }
    }
    
    return results;
  }

  // Query deployments from all connectors
  async queryAllDeployments(options?: QueryOptions): Promise<ConnectorResult[]> {
    const results: ConnectorResult[] = [];
    
    for (const connector of this.connectors.values()) {
      try {
        const result = await connector.queryDeployments(options);
        results.push(result);
      } catch (error) {
        results.push({
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error',
          metadata: { connector: connector.getInfo().name }
        });
      }
    }
    
    return results;
  }

  // Health check all connectors
  async healthCheckAll(): Promise<ConnectorResult[]> {
    const results: ConnectorResult[] = [];
    
    for (const connector of this.connectors.values()) {
      try {
        const result = await connector.healthCheck();
        results.push(result);
      } catch (error) {
        results.push({
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error',
          metadata: { connector: connector.getInfo().name }
        });
      }
    }
    
    return results;
  }
}

// Global connector manager instance
export const connectorManager = new ConnectorManager(); 