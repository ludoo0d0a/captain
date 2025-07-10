import { defineStore } from 'pinia'

export type Application = {
  id: string
  name: string
  description?: string
  versions: string[] // array of Version IDs
}

const MOCK_APPS: Application[] = [
  { id: 'app1', name: 'Frontend', description: 'User-facing web app', versions: ['ver1', 'ver2', 'ver3'] },
  { id: 'app2', name: 'Backend', description: 'API server', versions: ['ver4', 'ver5'] },
  { id: 'app3', name: 'Worker', description: 'Background jobs', versions: ['ver6'] },
]

function getInitialApplications() {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('applications')
    if (stored) return JSON.parse(stored)
  }
  return MOCK_APPS
}

export const useApplicationsStore = defineStore('applications', {
  state: () => ({
    applications: getInitialApplications() as Application[],
  }),
  actions: {
    addApplication(app: Application) {
      this.applications.push(app)
    },
    updateApplication(id: string, data: Partial<Application>) {
      const app = this.applications.find(a => a.id === id)
      if (app) Object.assign(app, data)
    },
    removeApplication(id: string) {
      this.applications = this.applications.filter(a => a.id !== id)
    },
  },
}) 