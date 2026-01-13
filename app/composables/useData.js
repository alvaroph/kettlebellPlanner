import { db } from '../services/database';

/**
 * Repository Composable
 * Centralizes all data access to switch between Remote (API) and Local (Dexie).
 */
export const useData = () => {
  const config = useRuntimeConfig();
  const isLocal = config.public.databaseMode === 'local';

  // --- WORKOUTS ---
  const getWorkouts = async () => {
    if (isLocal) {
      return await db.workouts.toArray();
    } else {
      return await $fetch('/api/workouts/library');
    }
  };

  // --- PROGRAMS ---
  const getCurrentProgram = async () => {
    if (isLocal) {
      const program = await db.programs.where('active').equals(1).first();
      if (!program) return null;
      
      const sessions = await db.sessions
        .where('programId').equals(program.id)
        .sortBy('weekIndex');
        
      return { ...program, sessions: sessions };
    } else {
      return await $fetch('/api/programs/current');
    }
  };

  const createProgram = async (data) => {
    if (isLocal) {
      // 1. Deactivate old programs
      await db.programs.where('active').equals(1).modify({ active: 0 });
      
      // 2. Add new program
      const id = await db.programs.add({
        name: data.name,
        weeks: data.weeks,
        daysPerWeek: data.daysPerWeek,
        goal: data.goal,
        intensity: data.intensity,
        active: 1,
        createdAt: new Date()
      });

      // 3. Generate sessions (logic mirrored from server/utils/planner)
      // For simplicity, we can import generateStructure if it's exported and works in browser
      // or we can just mirror it here.
      const structure = [];
      const sessionTypes = ['Strength', 'Conditioning', 'Mobility'];
      for (let w = 1; w <= data.weeks; w++) {
        for (let d = 1; d <= data.daysPerWeek; d++) {
          const typeIndex = (w + d) % sessionTypes.length;
          structure.push({
            programId: id,
            weekIndex: w,
            dayIndex: d,
            sessionType: sessionTypes[typeIndex],
            status: 'pending'
          });
        }
      }
      await db.sessions.bulkAdd(structure);
      return { success: true, programId: id };
    } else {
      return await $fetch('/api/programs/create', { method: 'POST', body: data });
    }
  };

  // --- SESSIONS ---
  const getDailySession = async (sessionId) => {
    if (isLocal) {
      const session = await db.sessions.get(parseInt(sessionId));
      const history = await db.sessions
        .where('status').equals('completed')
        .limit(5)
        .toArray();
      
      const workouts = await db.workouts.toArray();
      
      // Filter logic mirrored from server/utils/planner
      const searchType = (session.sessionType || "").toLowerCase();
      const filtered = workouts.filter(w => {
        const tags = (w.focusTags || "").toLowerCase();
        return tags.indexOf(searchType) !== -1;
      });

      const recommendations = filtered.slice(0, 3);
      // Fallback
      if (recommendations.length === 0) {
        recommendations.push(...workouts.slice(0, 3));
      }

      return {
        session: session,
        recommendations: recommendations
      };
    } else {
      return await $fetch(`/api/sessions/daily?sessionId=${sessionId}`);
    }
  };

  const completeSession = async (data) => {
    if (isLocal) {
      await db.sessions.update(parseInt(data.sessionId), {
        status: 'completed',
        selectedWorkoutId: data.workoutId,
        completedAt: new Date()
      });
      
      await db.feedback.add({
        sessionId: parseInt(data.sessionId),
        workoutId: data.workoutId,
        rating: data.rating,
        repeat: data.repeatPreference,
        notes: data.notes,
        createdAt: new Date()
      });
      
      return { success: true };
    } else {
      return await $fetch('/api/sessions/complete', { method: 'POST', body: data });
    }
  };

  return {
    getWorkouts,
    getCurrentProgram,
    createProgram,
    getDailySession,
    completeSession
  };
};
