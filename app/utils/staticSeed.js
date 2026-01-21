// app/utils/staticSeed.js
import workoutsData from '~/assets/data/workouts.json';

/**
 * Static Seed Data
 * Exporting the shared workout library for use in local Dexie initialization.
 */
export const staticWorkouts = workoutsData.map(w => {
  return {
    ...w,
    // Ensure focusTags is a string as expected by useData/seeder
    focusTags: Array.isArray(w.focus) ? w.focus.join(',') : (w.category || w.focusTags || "")
  };
});
