import type { Connector, ConnectorRefreshResult, ConnectorDeployResult } from './index'

export class HTTPConnector implements Connector {
  id = 'http'
  name = 'HTTP'
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
    await new Promise(r => setTimeout(r, 500))
    return {
      connectorId: this.id,
      scope,
      data: { apis: Math.floor(Math.random() * 7) },
      success: true,
      message: 'HTTP refreshed',
    }
  }
  async deploy(params: { appId: string; envId: string; versionId: string }): Promise<ConnectorDeployResult> {
    await new Promise(r => setTimeout(r, 500))
    return {
      connectorId: this.id,
      ...params,
      success: true,
      message: `HTTP deployed version ${params.versionId} to ${params.envId}`,
    }
  }
} 