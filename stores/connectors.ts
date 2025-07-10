import { defineStore } from 'pinia'
import type {
  Connector,
  ConnectorRefreshResult,
  ConnectorDeployResult,
} from '../connectors'
import {
  GitHubActionsConnector,
  JenkinsConnector,
  SSHConnector,
  HTTPConnector,
  XLDeployConnector,
} from '../connectors'

export const useConnectorsStore = defineStore('connectors', {
  state: () => ({
    connectors: [
      new GitHubActionsConnector('https://api.github.com', 'ghuser', 'ghpass'),
      new JenkinsConnector('https://jenkins.example.com', 'jenkinsuser', 'jenkinspass'),
      new SSHConnector('ssh.example.com', 'sshuser', 'sshpass'),
      new HTTPConnector('https://api.example.com', 'user', 'pass'),
      new XLDeployConnector('https://xldeploy.example.com', 'xluser', 'xlpass'),
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