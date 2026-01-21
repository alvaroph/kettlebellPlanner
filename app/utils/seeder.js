import { db } from '../services/database';
import { staticWorkouts } from './staticSeed';

/**
 * Local Seeder
 * Populates Dexie with static workouts.
 * Server API sync removed.
 */
export var syncLibrary = async function () {
  try {
    var count = await db.workouts.count();
    
    if (count === 0) {
      var sourceData = [];
      for (var i = 0; i < staticWorkouts.length; i++) {
        var w = staticWorkouts[i];
        var workout = {};
        for (var key in w) {
            workout[key] = w[key];
        }
        workout.id = w.id || (i + 1);
        sourceData.push(workout);
      }
      
      if (sourceData.length > 0) {
        await db.workouts.clear();
        await db.workouts.bulkAdd(sourceData);
        console.log('Local library initialized from static bundle:', sourceData.length, 'workouts');
      }
    } else {
      console.log('Local library already exists. Skipping seed.');
    }
  } catch (error) {
    console.error('Failed to initialize local library:', error);
  }
};
