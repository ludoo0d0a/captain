import { defineEventHandler, readBody, getQuery } from 'h3';
import db from '../../db';

export default defineEventHandler(async (event) => {
  const connectorId = event.context.params?.id;

  if (!connectorId) {
    return {
      success: false,
      error: 'Connector ID is required'
    };
  }

  if (event.method === 'GET') {
    try {
      const connectors = await db.query('SELECT * FROM connectors WHERE id = ?', [connectorId]);
      
      if (connectors.length === 0) {
        return {
          success: false,
          error: 'Connector not found'
        };
      }

      const connector = connectors[0];
      return {
        success: true,
        connector: {
          id: connector.id,
          name: connector.name,
          type: connector.type,
          settings: connector.settings ? JSON.parse(connector.settings) : {},
          credentials: connector.credentials ? JSON.parse(connector.credentials) : {},
          status: connector.status,
          createdAt: connector.createdAt,
          updatedAt: connector.updatedAt
        }
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  if (event.method === 'PUT') {
    try {
      const body = await readBody(event);
      const { name, type, settings, credentials } = body;

      // Check if connector exists
      const existing = await db.query('SELECT id FROM connectors WHERE id = ?', [connectorId]);
      if (existing.length === 0) {
        return {
          success: false,
          error: 'Connector not found'
        };
      }

      // Update connector
      await db.execute(
        'UPDATE connectors SET name = ?, type = ?, settings = ?, credentials = ?, updatedAt = CURRENT_TIMESTAMP WHERE id = ?',
        [
          name,
          type,
          JSON.stringify(settings || {}),
          JSON.stringify(credentials || {}),
          connectorId
        ]
      );

      return {
        success: true,
        message: 'Connector configuration updated successfully'
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  if (event.method === 'DELETE') {
    try {
      // Check if connector exists
      const existing = await db.query('SELECT id FROM connectors WHERE id = ?', [connectorId]);
      if (existing.length === 0) {
        return {
          success: false,
          error: 'Connector not found'
        };
      }

      // Delete connector
      await db.execute('DELETE FROM connectors WHERE id = ?', [connectorId]);

      return {
        success: true,
        message: 'Connector configuration deleted successfully'
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