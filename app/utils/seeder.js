import { db } from '../services/database';

/**
 * Local Seeder
 * Syncs the global library from the server to Dexie.
 * Only runs if the local database is empty.
 */
export const syncLibrary = async () => {
  try {
    const count = await db.workouts.count();
    
    // Always fetch latest to ensure library is up to date, 
    // but in a production PWA we might want more complex sync logic.
    const remoteWorkouts = await $fetch('/api/workouts/library');
    
    if (remoteWorkouts && remoteWorkouts.length > 0) {
      // Clear and bulk add for a clean sync
      await db.workouts.clear();
      
      const toAdd = remoteWorkouts.map(w => {
        return {
          id: w.id,
          title: w.title,
          difficulty: w.difficulty,
          durationMinutes: w.durationMinutes,
          focusTags: w.focusTags.join(','), // store as string for easier indexing in Dexie if needed
          format: w.format,
          blocks: w.blocks
        };
      });
      
      await db.workouts.bulkAdd(toAdd);
      console.log('Local library synced:', toAdd.length, 'workouts');
    }
  } catch (error) {
    console.error('Failed to sync local library:', error);
  }
};
