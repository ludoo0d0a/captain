import { defineStore } from 'pinia'

export type Environment = {
  id: string
  name: string
  servers?: string[]
  tags?: string[]
}

const MOCK_ENVS: Environment[] = [
  { id: 'env1', name: 'Staging', servers: ['staging-1', 'staging-2'], tags: ['test', 'preprod'] },
  { id: 'env2', name: 'Production', servers: ['prod-1'], tags: ['prod', 'live'] },
  { id: 'env3', name: 'QA', servers: ['qa-1'], tags: ['qa', 'test'] },
]

function getInitialEnvironments() {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('environments')
    if (stored) return JSON.parse(stored)
  }
  return MOCK_ENVS
}

export const useEnvironmentsStore = defineStore('environments', {
  state: () => ({
    environments: getInitialEnvironments() as Environment[],
  }),
  actions: {
    addEnvironment(env: Environment) {
      this.environments.push(env)
    },
    updateEnvironment(id: string, data: Partial<Environment>) {
      const env = this.environments.find(e => e.id === id)
      if (env) Object.assign(env, data)
    },
    removeEnvironment(id: string) {
      this.environments = this.environments.filter(e => e.id !== id)
    },
  },
}) 