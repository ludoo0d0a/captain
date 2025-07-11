import { defineEventHandler, getQuery } from 'h3';
import { connectorManager } from '../../connectors/manager';

export default defineEventHandler(async (event) => {
  if (event.method === 'GET') {
    const query = getQuery(event);
    const { type, connector } = query;

    // If a specific connector is requested
    if (connector) {
      const connectorInstance = connectorManager.getConnector(connector as string);
      if (!connectorInstance) {
        return {
          success: false,
          error: 'Connector not found'
        };
      }

      try {
        let result;
        switch (type) {
          case 'applications':
            result = await connectorInstance.queryApplications();
            break;
          case 'environments':
            result = await connectorInstance.queryEnvironments();
            break;
          case 'versions':
            result = await connectorInstance.queryVersions();
            break;
          case 'deployments':
            result = await connectorInstance.queryDeployments();
            break;
          default:
            return {
              success: false,
              error: 'Invalid query type'
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

    // Query all connectors
    try {
      let results;
      switch (type) {
        case 'applications':
          results = await connectorManager.queryAllApplications();
          break;
        case 'environments':
          results = await connectorManager.queryAllEnvironments();
          break;
        case 'versions':
          results = await connectorManager.queryAllVersions();
          break;
        case 'deployments':
          results = await connectorManager.queryAllDeployments();
          break;
        default:
          return {
            success: false,
            error: 'Invalid query type'
          };
      }

      // Combine results from all connectors
      const combinedData = results
        .filter(result => result.success)
        .flatMap(result => result.data || []);

      return {
        success: true,
        data: combinedData,
        metadata: {
          totalConnectors: results.length,
          successfulConnectors: results.filter(r => r.success).length,
          failedConnectors: results.filter(r => !r.success).length
        }
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  return { error: 'Method not allowed' };
}); 