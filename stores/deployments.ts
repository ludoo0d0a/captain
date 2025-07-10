import { defineStore } from 'pinia'

export type Deployment = {
  id: string
  appId: string
  envId: string
  versionId: string
  status: string // e.g., "deployed", "failed", "pending"
  deployedAt: string // ISO date
}

const MOCK_DEPLOYMENTS: Deployment[] = [
  { id: 'dep1', appId: 'app1', envId: 'env1', versionId: 'ver1', status: 'deployed', deployedAt: '2024-06-02T09:00:00Z' },
  { id: 'dep2', appId: 'app1', envId: 'env2', versionId: 'ver2', status: 'deployed', deployedAt: '2024-06-04T09:00:00Z' },
  { id: 'dep3', appId: 'app2', envId: 'env1', versionId: 'ver4', status: 'deployed', deployedAt: '2024-06-02T09:00:00Z' },
  { id: 'dep4', appId: 'app3', envId: 'env3', versionId: 'ver6', status: 'deployed', deployedAt: '2024-06-02T09:00:00Z' },
]

function getInitialDeployments() {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('deployments')
    if (stored) return JSON.parse(stored)
  }
  return MOCK_DEPLOYMENTS
}

export const useDeploymentsStore = defineStore('deployments', {
  state: () => ({
    deployments: getInitialDeployments() as Deployment[],
  }),
  actions: {
    addDeployment(dep: Deployment) {
      this.deployments.push(dep)
    },
    updateDeployment(id: string, data: Partial<Deployment>) {
      const d = this.deployments.find(d => d.id === id)
      if (d) Object.assign(d, data)
    },
    removeDeployment(id: string) {
      this.deployments = this.deployments.filter(d => d.id !== id)
    },
  },
}) 