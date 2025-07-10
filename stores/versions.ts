import { defineStore } from 'pinia'

export type Version = {
  id: string
  appId: string
  name: string // e.g., "1.2.3", "1.2.3-SNAPSHOT"
  createdAt: string // ISO date
  isSnapshot: boolean
  metadata?: Record<string, any>
}

const MOCK_VERSIONS: Version[] = [
  { id: 'ver1', appId: 'app1', name: '1.0.0', createdAt: '2024-06-01T12:00:00Z', isSnapshot: false },
  { id: 'ver2', appId: 'app1', name: '1.1.0-SNAPSHOT', createdAt: '2024-06-03T08:00:00Z', isSnapshot: true },
  { id: 'ver3', appId: 'app1', name: '1.1.0', createdAt: '2024-06-05T08:00:00Z', isSnapshot: false },
  { id: 'ver4', appId: 'app2', name: '2.0.0', createdAt: '2024-06-01T12:00:00Z', isSnapshot: false },
  { id: 'ver5', appId: 'app2', name: '2.1.0-SNAPSHOT', createdAt: '2024-06-03T08:00:00Z', isSnapshot: true },
  { id: 'ver6', appId: 'app3', name: '0.9.0', createdAt: '2024-06-01T12:00:00Z', isSnapshot: false },
]

function getInitialVersions() {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('versions')
    if (stored) return JSON.parse(stored)
  }
  return MOCK_VERSIONS
}

export const useVersionsStore = defineStore('versions', {
  state: () => ({
    versions: getInitialVersions() as Version[],
  }),
  actions: {
    addVersion(version: Version) {
      this.versions.push(version)
    },
    updateVersion(id: string, data: Partial<Version>) {
      const v = this.versions.find(v => v.id === id)
      if (v) Object.assign(v, data)
    },
    removeVersion(id: string) {
      this.versions = this.versions.filter(v => v.id !== id)
    },
  },
}) 