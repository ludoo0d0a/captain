export interface ConnectorSettingField {
  type: 'text' | 'password' | 'url' | 'number' | 'boolean' | 'select';
  name: string;
  value: string | number | boolean;
  label: string;
  required?: boolean;
  placeholder?: string;
  options?: { value: string; label: string }[];
  isCredential?: boolean;
}

export interface ConnectorMeta {
  id: string;
  label: string;
  icon: string;
  fields: ConnectorSettingField[];
}

export const connectorSettingsMeta: Record<string, ConnectorMeta> = {
  github: {
    id: 'github',
    label: 'GitHub',
    icon: 'i-heroicons-code-bracket',
    fields: [
      {
        type: 'text',
        name: 'organization',
        value: '',
        label: 'Organization',
        required: true,
        placeholder: 'my-organization'
      },
      {
        type: 'text',
        name: 'repository',
        value: '',
        label: 'Repository',
        required: true,
        placeholder: 'my-organization/my-repo'
      },
      {
        type: 'password',
        name: 'token',
        value: '',
        label: 'Personal Access Token',
        required: true,
        placeholder: 'ghp_...',
        isCredential: true
      }
    ]
  },
  gitlab: {
    id: 'gitlab',
    label: 'GitLab',
    icon: 'i-heroicons-command-line',
    fields: [
      {
        type: 'url',
        name: 'baseUrl',
        value: '',
        label: 'GitLab URL',
        required: true,
        placeholder: 'https://gitlab.com'
      },
      {
        type: 'password',
        name: 'token',
        value: '',
        label: 'Personal Access Token',
        required: true,
        placeholder: 'glpat-...',
        isCredential: true
      }
    ]
  },
  docker: {
    id: 'docker',
    label: 'Docker',
    icon: 'i-heroicons-cube',
    fields: [
      {
        type: 'url',
        name: 'registryUrl',
        value: '',
        label: 'Registry URL',
        required: true,
        placeholder: 'https://registry.hub.docker.com'
      },
      {
        type: 'text',
        name: 'username',
        value: '',
        label: 'Username',
        required: true,
        placeholder: 'username',
        isCredential: true
      },
      {
        type: 'password',
        name: 'password',
        value: '',
        label: 'Password/Token',
        required: true,
        placeholder: 'password or access token',
        isCredential: true
      }
    ]
  },
  kubernetes: {
    id: 'kubernetes',
    label: 'Kubernetes',
    icon: 'i-heroicons-cog-6-tooth',
    fields: [
      {
        type: 'url',
        name: 'clusterUrl',
        value: '',
        label: 'Cluster URL',
        required: true,
        placeholder: 'https://kubernetes.example.com'
      },
      {
        type: 'text',
        name: 'namespace',
        value: '',
        label: 'Default Namespace',
        placeholder: 'default'
      },
      {
        type: 'password',
        name: 'token',
        value: '',
        label: 'Service Account Token',
        required: true,
        placeholder: 'eyJhbGciOiJSUzI1NiIs...',
        isCredential: true
      }
    ]
  },
  githubactions: {
    id: 'githubactions',
    label: 'GitHub Actions',
    icon: 'i-heroicons-play',
    fields: [
      {
        type: 'text',
        name: 'organization',
        value: '',
        label: 'Organization',
        required: true,
        placeholder: 'my-organization'
      },
      {
        type: 'text',
        name: 'repository',
        value: '',
        label: 'Repository',
        required: true,
        placeholder: 'my-organization/my-repo'
      },
      {
        type: 'password',
        name: 'token',
        value: '',
        label: 'Personal Access Token',
        required: true,
        placeholder: 'ghp_...',
        isCredential: true
      }
    ]
  },
  http: {
    id: 'http',
    label: 'HTTP API',
    icon: 'i-heroicons-globe-alt',
    fields: [
      {
        type: 'url',
        name: 'baseUrl',
        value: '',
        label: 'Base URL',
        required: true,
        placeholder: 'https://api.example.com'
      },
      {
        type: 'select',
        name: 'authType',
        value: 'none',
        label: 'Authentication Type',
        options: [
          { value: 'none', label: 'None' },
          { value: 'basic', label: 'Basic Auth' },
          { value: 'bearer', label: 'Bearer Token' },
          { value: 'apiKey', label: 'API Key' }
        ]
      },
      {
        type: 'text',
        name: 'username',
        value: '',
        label: 'Username',
        placeholder: 'username',
        isCredential: true
      },
      {
        type: 'password',
        name: 'password',
        value: '',
        label: 'Password',
        placeholder: 'password',
        isCredential: true
      },
      {
        type: 'password',
        name: 'token',
        value: '',
        label: 'Token/API Key',
        placeholder: 'your-token-or-api-key',
        isCredential: true
      }
    ]
  },
  jenkins: {
    id: 'jenkins',
    label: 'Jenkins',
    icon: 'i-heroicons-wrench-screwdriver',
    fields: [
      {
        type: 'url',
        name: 'baseUrl',
        value: '',
        label: 'Jenkins URL',
        required: true,
        placeholder: 'https://jenkins.example.com'
      },
      {
        type: 'text',
        name: 'username',
        value: '',
        label: 'Username',
        required: true,
        placeholder: 'jenkins-user',
        isCredential: true
      },
      {
        type: 'password',
        name: 'password',
        value: '',
        label: 'Password/API Token',
        required: true,
        placeholder: 'password or api token',
        isCredential: true
      }
    ]
  },
  ssh: {
    id: 'ssh',
    label: 'SSH',
    icon: 'i-heroicons-computer-desktop',
    fields: [
      {
        type: 'text',
        name: 'host',
        value: '',
        label: 'Host',
        required: true,
        placeholder: 'server.example.com'
      },
      {
        type: 'number',
        name: 'port',
        value: 22,
        label: 'Port',
        placeholder: '22'
      },
      {
        type: 'text',
        name: 'username',
        value: '',
        label: 'Username',
        required: true,
        placeholder: 'ssh-user',
        isCredential: true
      },
      {
        type: 'password',
        name: 'password',
        value: '',
        label: 'Password',
        placeholder: 'password (if using password auth)',
        isCredential: true
      },
      {
        type: 'text',
        name: 'privateKey',
        value: '',
        label: 'Private Key',
        placeholder: '-----BEGIN PRIVATE KEY-----...',
        isCredential: true
      }
    ]
  },
  xldeploy: {
    id: 'xldeploy',
    label: 'XL Deploy',
    icon: 'i-heroicons-server',
    fields: [
      {
        type: 'url',
        name: 'baseUrl',
        value: '',
        label: 'XL Deploy URL',
        required: true,
        placeholder: 'https://xldeploy.example.com'
      },
      {
        type: 'text',
        name: 'username',
        value: '',
        label: 'Username',
        required: true,
        placeholder: 'xldeploy-user',
        isCredential: true
      },
      {
        type: 'password',
        name: 'password',
        value: '',
        label: 'Password',
        required: true,
        placeholder: 'password',
        isCredential: true
      }
    ]
  },
  googleplaystore: {
    id: 'googleplaystore',
    label: 'Google Play Store',
    icon: 'i-heroicons-device-phone-mobile',
    fields: [
      {
        type: 'text',
        name: 'packageName',
        value: '',
        label: 'Package Name',
        required: true,
        placeholder: 'com.example.myapp'
      },
      {
        type: 'text',
        name: 'serviceAccountEmail',
        value: '',
        label: 'Service Account Email',
        required: true,
        placeholder: 'service-account@project.iam.gserviceaccount.com',
        isCredential: true
      },
      {
        type: 'text',
        name: 'privateKey',
        value: '',
        label: 'Private Key',
        required: true,
        placeholder: '-----BEGIN PRIVATE KEY-----...',
        isCredential: true
      }
    ]
  },
  jira: {
    id: 'jira',
    label: 'Jira',
    icon: 'i-heroicons-clipboard-document-list',
    fields: [
      {
        type: 'url',
        name: 'baseUrl',
        value: '',
        label: 'Jira Base URL',
        required: true,
        placeholder: 'https://your-domain.atlassian.net'
      },
      {
        type: 'text',
        name: 'email',
        value: '',
        label: 'Email/Username',
        required: true,
        placeholder: 'your@email.com'
      },
      {
        type: 'password',
        name: 'apiToken',
        value: '',
        label: 'API Token',
        required: true,
        placeholder: 'Jira API Token',
        isCredential: true
      }
    ]
  }
}; 