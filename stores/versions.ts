import { defineStore } from 'pinia'

export type Version = {
  id: string
  appId: string
  name: string // e.g., "1.2.3", "1.2.3-SNAPSHOT"
  createdAt: string // ISO date
  isSnapshot: boolean
  metadata?: Record<string, any>
}

export const useVersionsStore = defineStore('versions', {
  state: () => ({
    versions: [] as Version[],
    loading: false as boolean,
  }),
  actions: {
    async fetchVersions() {
      this.loading = true
      this.versions = await $fetch('/api/versions')
      this.loading = false
    },
    async addVersion(version: Version) {
      await $fetch('/api/versions', { method: 'POST', body: version })
      await this.fetchVersions()
    },
    async updateVersion(id: string, data: Partial<Version>) {
      const v = this.versions.find(v => v.id === id)
      if (v) {
        await $fetch('/api/versions', { method: 'POST', body: { ...v, ...data } })
        await this.fetchVersions()
      }
    },
    async removeVersion(id: string) {
      await $fetch('/api/versions', { method: 'DELETE', body: { id } })
      await this.fetchVersions()
    },
  },
}) 