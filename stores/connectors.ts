import { defineStore } from 'pinia'

export interface Connector {
  id: string
  name: string
  type: string
  status: 'connected' | 'disconnected'
  refresh(scope: { appId?: string; envId?: string }): Promise<ConnectorRefreshResult>
  deploy(params: { appId: string; envId: string; versionId: string }): Promise<ConnectorDeployResult>
}

export type ConnectorRefreshResult = {
  connectorId: string
  scope: { appId?: string; envId?: string }
  data: any
  success: boolean
  message?: string
}

export type ConnectorDeployResult = {
  connectorId: string
  appId: string
  envId: string
  versionId: string
  success: boolean
  message?: string
  data?: any
}

// Example mock connector implementations
class GitHubConnector implements Connector {
  id = 'github'
  name = 'GitHub Actions'
  type = 'CI/CD'
  status: 'connected' | 'disconnected' = 'connected'
  async refresh(scope: { appId?: string; envId?: string }): Promise<ConnectorRefreshResult> {
    // Simulate API call
    await new Promise(r => setTimeout(r, 500))
    return {
      connectorId: this.id,
      scope,
      data: { builds: Math.floor(Math.random() * 10) },
      success: true,
      message: 'GitHub refreshed',
    }
  }
  async deploy(params: { appId: string; envId: string; versionId: string }): Promise<ConnectorDeployResult> {
    await new Promise(r => setTimeout(r, 500))
    return {
      connectorId: this.id,
      ...params,
      success: true,
      message: `GitHub deployed version ${params.versionId} to ${params.envId}`,
    }
  }
}
class JenkinsConnector implements Connector {
  id = 'jenkins'
  name = 'Jenkins'
  type = 'CI/CD'
  status: 'connected' | 'disconnected' = 'connected'
  async refresh(scope: { appId?: string; envId?: string }): Promise<ConnectorRefreshResult> {
    await new Promise(r => setTimeout(r, 500))
    return {
      connectorId: this.id,
      scope,
      data: { jobs: Math.floor(Math.random() * 5) },
      success: true,
      message: 'Jenkins refreshed',
    }
  }
  async deploy(params: { appId: string; envId: string; versionId: string }): Promise<ConnectorDeployResult> {
    await new Promise(r => setTimeout(r, 500))
    return {
      connectorId: this.id,
      ...params,
      success: true,
      message: `Jenkins deployed version ${params.versionId} to ${params.envId}`,
    }
  }
}
class SSHConnector implements Connector {
  id = 'ssh'
  name = 'Custom SSH'
  type = 'Server'
  status: 'connected' | 'disconnected' = 'connected'
  async refresh(scope: { appId?: string; envId?: string }): Promise<ConnectorRefreshResult> {
    await new Promise(r => setTimeout(r, 500))
    return {
      connectorId: this.id,
      scope,
      data: { servers: ['srv1', 'srv2'] },
      success: true,
      message: 'SSH refreshed',
    }
  }
  async deploy(params: { appId: string; envId: string; versionId: string }): Promise<ConnectorDeployResult> {
    await new Promise(r => setTimeout(r, 500))
    return {
      connectorId: this.id,
      ...params,
      success: true,
      message: `SSH deployed version ${params.versionId} to ${params.envId}`,
    }
  }
}

class HttpConnector implements Connector {
  id = 'http'
  name = 'HTTP Connector'
  type = 'API'
  status: 'connected' | 'disconnected' = 'connected'
  baseUrl: string
  username: string
  password: string
  constructor(baseUrl: string, username: string, password: string) {
    this.baseUrl = baseUrl
    this.username = username
    this.password = password
  }
  async refresh(scope: { appId?: string; envId?: string }): Promise<ConnectorRefreshResult> {
    // In real use, would use fetch with basic auth
    // For now, mock the response
    await new Promise(r => setTimeout(r, 500))
    // Example: fetch(`${this.baseUrl}/applications?env=${scope.envId}`, { headers: { Authorization: 'Basic ...' } })
    // For demo, return mock data
    return {
      connectorId: this.id,
      scope,
      data: {
        applications: [
          { id: 'appX', name: 'External App', env: scope.envId, description: 'Fetched from HTTP', tags: ['external'] },
        ],
      },
      success: true,
      message: `Fetched applications for env ${scope.envId} from HTTP`,
    }
  }
  async deploy(params: { appId: string; envId: string; versionId: string }): Promise<ConnectorDeployResult> {
    await new Promise(r => setTimeout(r, 500))
    // Example: fetch(`${this.baseUrl}/deploy`, { method: 'POST', body: JSON.stringify(params), ... })
    return {
      connectorId: this.id,
      ...params,
      success: true,
      message: `HTTP deployed version ${params.versionId} to ${params.envId}`,
    }
  }
}

export const useConnectorsStore = defineStore('connectors', {
  state: () => ({
    connectors: [
      new GitHubConnector(),
      new JenkinsConnector(),
      new SSHConnector(),
      new HttpConnector('https://api.example.com', 'user', 'pass'),
    ] as Connector[],
  }),
  actions: {
    setStatus(id: string, status: 'connected' | 'disconnected') {
      const c = this.connectors.find(c => c.id === id)
      if (c) c.status = status
    },
    async refreshAll(scope: { appId?: string; envId?: string }) {
      const active = this.connectors.filter(c => c.status === 'connected')
      return Promise.all(active.map(c => c.refresh(scope)))
    },
    async refreshConnector(id: string, scope: { appId?: string; envId?: string }) {
      const c = this.connectors.find(c => c.id === id && c.status === 'connected')
      if (!c) return null
      return c.refresh(scope)
    },
  },
}) 