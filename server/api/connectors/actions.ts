import { defineEventHandler, readBody } from 'h3';
import { connectorManager } from '../../connectors/manager';

export default defineEventHandler(async (event) => {
  if (event.method === 'POST') {
    const body = await readBody(event);
    const { action, connector, ...params } = body;

    const connectorInstance = connectorManager.getConnector(connector);
    if (!connectorInstance) {
      return {
        success: false,
        error: 'Connector not found'
      };
    }

    try {
      let result;
      switch (action) {
        case 'deploy':
          result = await connectorInstance.deployVersion(params.versionId, params.environmentId);
          break;
        case 'promote':
          result = await connectorInstance.promoteVersion(params.versionId, params.fromEnv, params.toEnv);
          break;
        case 'rollback':
          result = await connectorInstance.rollbackVersion(params.environmentId, params.versionId);
          break;
        default:
          return {
            success: false,
            error: 'Invalid action'
          };
      }
      return result;
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  return { error: 'Method not allowed' };
}); 