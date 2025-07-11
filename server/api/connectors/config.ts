import { defineEventHandler, readBody, getQuery } from 'h3';
import db from '../../db';

export default defineEventHandler(async (event) => {
  if (event.method === 'GET') {
    try {
      const connectors = await db.query('SELECT * FROM connectors ORDER BY name');
      return {
        success: true,
        connectors: connectors.map((connector: any) => ({
          id: connector.id,
          name: connector.name,
          type: connector.type,
          settings: connector.settings ? JSON.parse(connector.settings) : {},
          credentials: connector.credentials ? JSON.parse(connector.credentials) : {},
          status: connector.status,
          createdAt: connector.createdAt,
          updatedAt: connector.updatedAt
        }))
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  if (event.method === 'POST') {
    try {
      const body = await readBody(event);
      const { name, type, settings, credentials } = body;

      if (!name || !type) {
        return {
          success: false,
          error: 'Name and type are required'
        };
      }

      // Check if connector already exists
      const existing = await db.query('SELECT id FROM connectors WHERE name = ?', [name]);
      if (existing.length > 0) {
        return {
          success: false,
          error: 'Connector with this name already exists'
        };
      }

      // Insert new connector
      await db.execute(
        'INSERT INTO connectors (id, name, type, settings, credentials) VALUES (?, ?, ?, ?, ?)',
        [
          `connector-${Date.now()}`,
          name,
          type,
          JSON.stringify(settings || {}),
          JSON.stringify(credentials || {})
        ]
      );

      return {
        success: true,
        message: 'Connector configuration saved successfully'
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
      const { id, name, type, settings, credentials } = body;

      if (!id) {
        return {
          success: false,
          error: 'Connector ID is required'
        };
      }

      // Check if connector exists
      const existing = await db.query('SELECT id FROM connectors WHERE id = ?', [id]);
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
          id
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
      const body = await readBody(event);
      const { id } = body;

      if (!id) {
        return {
          success: false,
          error: 'Connector ID is required'
        };
      }

      // Delete connector
      const result = await db.execute('DELETE FROM connectors WHERE id = ?', [id]);

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