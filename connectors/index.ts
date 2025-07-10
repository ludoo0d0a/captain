// Connector interfaces and types
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

export { GitHubActionsConnector } from './GitHubActionsConnector'
export { JenkinsConnector } from './JenkinsConnector'
export { SSHConnector } from './SSHConnector'
export { HTTPConnector } from './HTTPConnector'
export { XLDeployConnector } from './XLDeployConnector' 