import { defineEventHandler, readBody, getQuery } from 'h3';
import { connectorManager } from '../../connectors/manager';

export default defineEventHandler(async (event) => {
  if (event.method === 'GET') {
    const connectors = connectorManager.getAllConnectors();
    return connectors.map(connector => ({
      name: connector.getInfo().name,
      type: connector.getInfo().type,
      connected: false // We'll check this separately if needed
    }));
  }

  if (event.method === 'POST') {
    const body = await readBody(event);
    const { action, config } = body;

    switch (action) {
      case 'register':
        try {
          const connector = connectorManager.registerConnector(config);
          return {
            success: true,
            data: {
              name: connector.getInfo().name,
              type: connector.getInfo().type
            }
          };
        } catch (error) {
          return {
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error'
          };
        }

      case 'connect':
        try {
          const connector = connectorManager.getConnector(config.name);
          if (!connector) {
            return {
              success: false,
              error: 'Connector not found'
            };
          }
          const result = await connector.connect();
          return result;
        } catch (error) {
          return {
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error'
          };
        }

      case 'disconnect':
        try {
          const connector = connectorManager.getConnector(config.name);
          if (!connector) {
            return {
              success: false,
              error: 'Connector not found'
            };
          }
          const result = await connector.disconnect();
          return result;
        } catch (error) {
          return {
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error'
          };
        }

      case 'health-check':
        try {
          const results = await connectorManager.healthCheckAll();
          return {
            success: true,
            data: results
          };
        } catch (error) {
          return {
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error'
          };
        }

      default:
        return {
          success: false,
          error: 'Invalid action'
        };
    }
  }

  if (event.method === 'DELETE') {
    const { name } = await readBody(event);
    const removed = connectorManager.removeConnector(name);
    return {
      success: removed,
      message: removed ? 'Connector removed' : 'Connector not found'
    };
  }

  return { error: 'Method not allowed' };
}); 