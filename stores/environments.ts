import { defineStore } from 'pinia'

export type Environment = {
  id: string
  name: string
  servers?: string[]
  tags?: string[]
}

export const useEnvironmentsStore = defineStore('environments', {
  state: () => ({
    environments: [] as Environment[],
    loading: false as boolean,
  }),
  actions: {
    async fetchEnvironments() {
      this.loading = true
      this.environments = await $fetch('/api/environments')
      this.loading = false
    },
    async addEnvironment(env: Environment) {
      await $fetch('/api/environments', { method: 'POST', body: env })
      await this.fetchEnvironments()
    },
    async updateEnvironment(id: string, data: Partial<Environment>) {
      const env = this.environments.find(e => e.id === id)
      if (env) {
        await $fetch('/api/environments', { method: 'POST', body: { ...env, ...data } })
        await this.fetchEnvironments()
      }
    },
    async removeEnvironment(id: string) {
      await $fetch('/api/environments', { method: 'DELETE', body: { id } })
      await this.fetchEnvironments()
    },
  },
}) 