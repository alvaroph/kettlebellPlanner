import Dexie from 'dexie';

/**
 * IronHabit Local Database (Dexie/IndexedDB)
 * Mirror of the Prisma Schema for client-side storage.
 */
export const db = new Dexie('IronHabitDB');

// Define tables and indexes
db.version(1).stores({
  workouts: 'id, title, difficulty, durationMinutes, format',
  programs: '++id, name, active, createdAt',
  sessions: '++id, programId, weekIndex, dayIndex, status, selectedWorkoutId',
  feedback: '++id, sessionId, workoutId, rating, createdAt'
});

export default db;
