import { db } from '../services/database';
import { staticWorkouts } from './staticSeed';

/**
 * Local Seeder
 * Syncs the global library from the server to Dexie.
 * Fallbacks to static bundle if the server is unreachable or empty.
 */
export const syncLibrary = async () => {
  try {
    const count = await db.workouts.count();
    
    let sourceData = [];
    
    try {
      // Try to fetch from server
      const remoteWorkouts = await $fetch('/api/workouts/library');
      if (remoteWorkouts && remoteWorkouts.length > 0) {
        sourceData = remoteWorkouts.map(w => ({
          id: w.id,
          title: w.title,
          difficulty: w.difficulty,
          durationMinutes: w.durationMinutes,
          focusTags: w.focusTags.join(','),
          format: w.format,
          blocks: w.blocks
        }));
        console.log('Syncing library from server...');
      }
    } catch (apiError) {
      console.warn('Server API unreachable. Falling back to static seed.', apiError);
    }

    // If API returned nothing and local is empty, or API just failed, use static
    if (sourceData.length === 0 && count === 0) {
      sourceData = staticWorkouts.map((w, index) => ({
        ...w,
        id: w.id || (index + 1)
      }));
      console.log('Populating library from static bundle...');
    }

    if (sourceData.length > 0) {
      // Clear and bulk add for a clean sync
      await db.workouts.clear();
      await db.workouts.bulkAdd(sourceData);
      console.log('Local library updated:', sourceData.length, 'workouts');
    }
  } catch (error) {
    console.error('Failed to initialize local library:', error);
  }
};
