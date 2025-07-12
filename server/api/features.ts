import { defineEventHandler, readBody, getQuery } from 'h3';
import { getDatabase } from '../db/index';

export default defineEventHandler(async (event) => {
  const database = getDatabase();

  if (event.method === 'GET') {
    try {
      // Get all features with their associated applications
      const features = await database.query(`
        SELECT 
          f.id,
          f.name,
          f.ticketNumber,
          f.link,
          f.createdAt,
          f.updatedAt,
          GROUP_CONCAT(fa.applicationId) as applicationIds
        FROM features f
        LEFT JOIN feature_applications fa ON f.id = fa.featureId
        GROUP BY f.id
        ORDER BY f.createdAt DESC
      `);

      // Parse application IDs and fetch application details
      const featuresWithApps = await Promise.all(
        features.map(async (feature: any) => {
          let applications: any[] = [];
          if (feature.applicationIds) {
            const appIds = feature.applicationIds.split(',');
            const apps = await database.query(
              'SELECT id, name, tags FROM applications WHERE id IN (' + appIds.map(() => '?').join(',') + ')',
              appIds
            );
            applications = apps.map((app: any) => ({
              ...app,
              tags: app.tags ? JSON.parse(app.tags) : []
            }));
          }
          
          return {
            ...feature,
            applications
          };
        })
      );

      return featuresWithApps;
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
      const { id, name, ticketNumber, link, applicationIds } = await readBody(event);

      // Insert feature
      await database.execute(
        'INSERT INTO features (id, name, ticketNumber, link) VALUES (?, ?, ?, ?)',
        [id, name, ticketNumber, link]
      );

      // Insert feature-application relationships
      if (applicationIds && applicationIds.length > 0) {
        for (const appId of applicationIds) {
          await database.execute(
            'INSERT INTO feature_applications (featureId, applicationId) VALUES (?, ?)',
            [id, appId]
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
      const { id, name, ticketNumber, link, applicationIds } = await readBody(event);

      // Update feature
      await database.execute(
        'UPDATE features SET name = ?, ticketNumber = ?, link = ?, updatedAt = CURRENT_TIMESTAMP WHERE id = ?',
        [name, ticketNumber, link, id]
      );

      // Remove existing relationships
      await database.execute('DELETE FROM feature_applications WHERE featureId = ?', [id]);

      // Insert new relationships
      if (applicationIds && applicationIds.length > 0) {
        for (const appId of applicationIds) {
          await database.execute(
            'INSERT INTO feature_applications (featureId, applicationId) VALUES (?, ?)',
            [id, appId]
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