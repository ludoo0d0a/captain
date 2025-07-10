import type { Connector, ConnectorRefreshResult, ConnectorDeployResult } from './index'

export class SSHConnector implements Connector {
  id = 'ssh'
  name = 'SSH'
  type = 'Server'
  status: 'connected' | 'disconnected' = 'connected'
  host: string
  username: string
  password: string
  constructor(host: string, username: string, password: string) {
    this.host = host
    this.username = username
    this.password = password
  }
  async refresh(scope: { appId?: string; envId?: string }): Promise<ConnectorRefreshResult> {
    await new Promise(r => setTimeout(r, 500))
    return {
      connectorId: this.id,
      scope,
      data: { servers: Math.floor(Math.random() * 3) },
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