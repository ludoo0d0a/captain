import { defineStore } from 'pinia'

export type Application = {
  id: string
  name: string
  description?: string
  versions?: string[] // array of Version IDs (optional, not in DB)
  tags?: string[]
}

export const useApplicationsStore = defineStore('applications', {
  state: () => ({
    applications: [] as Application[],
    loading: false as boolean,
  }),
  actions: {
    async fetchApplications() {
      this.loading = true
      this.applications = await $fetch('/api/applications')
      this.loading = false
    },
    async addApplication(app: Application) {
      await $fetch('/api/applications', { method: 'POST', body: app })
      await this.fetchApplications()
    },
    async updateApplication(id: string, data: Partial<Application>) {
      // For now, just re-add (no PATCH route yet)
      const app = this.applications.find(a => a.id === id)
      if (app) {
        await $fetch('/api/applications', { method: 'POST', body: { ...app, ...data } })
        await this.fetchApplications()
      }
    },
    async removeApplication(id: string) {
      await $fetch('/api/applications', { method: 'DELETE', body: { id } })
      await this.fetchApplications()
    },
  },
}) 