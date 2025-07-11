export interface ConnectorConfig {
  name: string;
  type: string;
  credentials?: Record<string, any>;
  settings?: Record<string, any>;
}

export interface ConnectorResult<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  metadata?: Record<string, any>;
}

export interface QueryOptions {
  limit?: number;
  offset?: number;
  filters?: Record<string, any>;
  sort?: Record<string, 'asc' | 'desc'>;
}

export abstract class Connector {
  protected config: ConnectorConfig;

  constructor(config: ConnectorConfig) {
    this.config = config;
  }

  // Abstract methods that must be implemented by each connector
  abstract connect(): Promise<ConnectorResult>;
  abstract disconnect(): Promise<ConnectorResult>;
  abstract isConnected(): Promise<boolean>;
  
  // Query methods for different data types
  abstract queryApplications(options?: QueryOptions): Promise<ConnectorResult>;
  abstract queryEnvironments(options?: QueryOptions): Promise<ConnectorResult>;
  abstract queryVersions(options?: QueryOptions): Promise<ConnectorResult>;
  abstract queryDeployments(options?: QueryOptions): Promise<ConnectorResult>;

  // Action methods
  abstract deployVersion(versionId: string, environmentId: string): Promise<ConnectorResult>;
  abstract promoteVersion(versionId: string, fromEnv: string, toEnv: string): Promise<ConnectorResult>;
  abstract rollbackVersion(environmentId: string, versionId: string): Promise<ConnectorResult>;

  // Health check
  abstract healthCheck(): Promise<ConnectorResult>;

  // Get connector info
  getInfo(): ConnectorConfig {
    return this.config;
  }

  // Update configuration
  updateConfig(newConfig: Partial<ConnectorConfig>): void {
    this.config = { ...this.config, ...newConfig };
  }
} 