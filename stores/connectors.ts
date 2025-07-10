import { defineStore } from 'pinia'
import { GitHubActionsConnector, JenkinsConnector, SSHConnector, HTTPConnector, XLDeployConnector } from '../connectors'

export type ConnectorConfig = {
  id: string
  type: 'GitHubActionsConnector' | 'JenkinsConnector' | 'SSHConnector' | 'HTTPConnector' | 'XLDeployConnector'
  baseUrl?: string
  host?: string
  username?: string
  password?: string
  status?: 'connected' | 'disconnected'
}

export const useConnectorsStore = defineStore('connectors', {
  state: () => ({
    connectorConfigs: [
      { id: 'githubactions', type: 'GitHubActionsConnector', baseUrl: 'https://api.github.com', username: 'ghuser', password: 'ghpass', status: 'connected' },
      { id: 'jenkins', type: 'JenkinsConnector', baseUrl: 'https://jenkins.example.com', username: 'jenkinsuser', password: 'jenkinspass', status: 'connected' },
      { id: 'ssh', type: 'SSHConnector', host: 'ssh.example.com', username: 'sshuser', password: 'sshpass', status: 'connected' },
      { id: 'http', type: 'HTTPConnector', baseUrl: 'https://api.example.com', username: 'user', password: 'pass', status: 'connected' },
      { id: 'xldeploy', type: 'XLDeployConnector', baseUrl: 'https://xldeploy.example.com', username: 'xluser', password: 'xlpass', status: 'connected' },
    ] as ConnectorConfig[],
  }),
  actions: {
    setStatus(id: string, status: 'connected' | 'disconnected') {
      const c = this.connectorConfigs.find(c => c.id === id)
      if (c) c.status = status
    },
    updateConfig(id: string, updates: Partial<ConnectorConfig>) {
      const c = this.connectorConfigs.find(c => c.id === id)
      if (c) Object.assign(c, updates)
    },
  },
  getters: {
    connectorInstances(state) {
      return state.connectorConfigs
        .filter(cfg => cfg.status === 'connected')
        .map(cfg => {
          switch (cfg.type) {
            case 'GitHubActionsConnector':
              return new GitHubActionsConnector(cfg.baseUrl || '', cfg.username || '', cfg.password || '')
            case 'JenkinsConnector':
              return new JenkinsConnector(cfg.baseUrl || '', cfg.username || '', cfg.password || '')
            case 'SSHConnector':
              return new SSHConnector(cfg.host || '', cfg.username || '', cfg.password || '')
            case 'HTTPConnector':
              return new HTTPConnector(cfg.baseUrl || '', cfg.username || '', cfg.password || '')
            case 'XLDeployConnector':
              return new XLDeployConnector(cfg.baseUrl || '', cfg.username || '', cfg.password || '')
            default:
              return null
          }
        })
        .filter(Boolean)
    },
    getConnectorById: (state) => (id: string) => state.connectorConfigs.find(cfg => cfg.id === id),
  },
}) 