import { defineEventHandler, readBody, getQuery } from 'h3';
import { getDatabase } from '../db/index';

export default defineEventHandler(async (event) => {
  const database = getDatabase();

  if (event.method === 'GET') {
    try {
      // Get all features with their associated versions
      const features = await database.query(`
        SELECT 
          f.id,
          f.name,
          f.ticketNumber,
          f.link,
          f.createdAt,
          f.updatedAt,
          GROUP_CONCAT(fv.versionId) as versionIds
        FROM features f
        LEFT JOIN feature_versions fv ON f.id = fv.featureId
        GROUP BY f.id
        ORDER BY f.createdAt DESC
      `);

      // Parse version IDs and fetch version details
      const featuresWithVersions = await Promise.all(
        features.map(async (feature: any) => {
          let versions: any[] = [];
          if (feature.versionIds) {
            const versionIds = feature.versionIds.split(',');
            const vers = await database.query(
              'SELECT id, name, appId, createdAt FROM versions WHERE id IN (' + versionIds.map(() => '?').join(',') + ')',
              versionIds
            );
            versions = vers;
          }
          return {
            ...feature,
            versions
          };
        })
      );
      return featuresWithVersions;
    } catch (error) {
      console.error('Error fetching features:', error);
      throw createError({
        statusCode: 500,
        statusMessage: 'Failed to fetch features'
      });
    }
  }

  if (event.method === 'POST') {
    try {
      const { id, name, ticketNumber, link, versionIds } = await readBody(event);
      // Insert feature
      await database.execute(
        'INSERT INTO features (id, name, ticketNumber, link) VALUES (?, ?, ?, ?)',
        [id, name, ticketNumber, link]
      );
      // Insert feature-version relationships
      if (versionIds && versionIds.length > 0) {
        for (const versionId of versionIds) {
          await database.execute(
            'INSERT INTO feature_versions (featureId, versionId) VALUES (?, ?)',
            [id, versionId]
          );
        }
      }
      return { success: true, id };
    } catch (error) {
      console.error('Error creating feature:', error);
      throw createError({
        statusCode: 500,
        statusMessage: 'Failed to create feature'
      });
    }
  }

  if (event.method === 'PUT') {
    try {
      const { id, name, ticketNumber, link, versionIds } = await readBody(event);
      // Update feature
      await database.execute(
        'UPDATE features SET name = ?, ticketNumber = ?, link = ?, updatedAt = CURRENT_TIMESTAMP WHERE id = ?',
        [name, ticketNumber, link, id]
      );
      // Remove existing relationships
      await database.execute('DELETE FROM feature_versions WHERE featureId = ?', [id]);
      // Insert new relationships
      if (versionIds && versionIds.length > 0) {
        for (const versionId of versionIds) {
          await database.execute(
            'INSERT INTO feature_versions (featureId, versionId) VALUES (?, ?)',
            [id, versionId]
          );
        }
      }
      return { success: true };
    } catch (error) {
      console.error('Error updating feature:', error);
      throw createError({
        statusCode: 500,
        statusMessage: 'Failed to update feature'
      });
    }
  }

  if (event.method === 'DELETE') {
    try {
      const { id } = getQuery(event);
      
      // Delete feature (cascade will handle feature_applications)
      await database.execute('DELETE FROM features WHERE id = ?', [id]);
      
      return { success: true };
    } catch (error) {
      console.error('Error deleting feature:', error);
      throw createError({
        statusCode: 500,
        statusMessage: 'Failed to delete feature'
      });
    }
  }

  throw createError({
    statusCode: 405,
    statusMessage: 'Method not allowed'
  });
}); 