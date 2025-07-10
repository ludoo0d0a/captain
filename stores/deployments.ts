import { defineStore } from 'pinia'

export type Deployment = {
  id: string
  appId: string
  envId: string
  versionId: string
  status: string // e.g., "deployed", "failed", "pending"
  deployedAt: string // ISO date
}

export const useDeploymentsStore = defineStore('deployments', {
  state: () => ({
    deployments: [] as Deployment[],
    loading: false as boolean,
  }),
  actions: {
    async fetchDeployments() {
      this.loading = true
      this.deployments = await $fetch('/api/deployments')
      this.loading = false
    },
    async addDeployment(dep: Deployment) {
      await $fetch('/api/deployments', { method: 'POST', body: dep })
      await this.fetchDeployments()
    },
    async updateDeployment(id: string, data: Partial<Deployment>) {
      const d = this.deployments.find(d => d.id === id)
      if (d) {
        await $fetch('/api/deployments', { method: 'POST', body: { ...d, ...data } })
        await this.fetchDeployments()
      }
    },
    async removeDeployment(id: string) {
      await $fetch('/api/deployments', { method: 'DELETE', body: { id } })
      await this.fetchDeployments()
    },
  },
}) 