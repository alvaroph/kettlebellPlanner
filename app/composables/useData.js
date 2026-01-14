import { db } from '../services/database';
import { generateStructure, recommendWorkouts } from '../utils/planner';

/**
 * Repository Composable (Serverless)
 * Centralizes all data access using Dexie (IndexedDB). No API calls.
 */
export const useData = () => {
  // --- WORKOUTS ---
  const getWorkouts = async () => {
    const workouts = await db.workouts.toArray();
    
    // Cross-reference with completed sessions and feedback
    const completedSessions = await db.sessions.where('status').equals('completed').toArray();
    const feedbacks = await db.feedback.toArray();
    
    return workouts.map(w => {
      const matchingSessions = completedSessions.filter(s => s.selectedWorkoutId === w.id);
      const matchingFeedbacks = feedbacks.filter(f => f.workoutId === w.id);
      
      return {
        ...w,
        isCompleted: matchingSessions.length > 0,
        timesCompleted: matchingSessions.length,
        feedbacks: matchingFeedbacks.map(f => ({
          date: f.createdAt,
          rating: f.rating,
          notes: f.notes,
          effort: f.repeat ? 'Repeat Preferred' : 'Standard'
        }))
      };
    });
  };

  // --- PROGRAMS ---
  const getCurrentProgram = async () => {
    const program = await db.programs.where('active').equals(1).first();
    if (!program) return null;
    
    const sessions = await db.sessions
      .where('programId').equals(program.id)
      .toArray();
      
    return { 
      ...program, 
      sessions: sessions.sort((a,b) => (a.weekIndex - b.weekIndex) || (a.dayIndex - b.dayIndex)) 
    };
  };

  const createProgram = async (data) => {
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

    // 3. Generate sessions using local utility
    const planStructure = generateStructure(data.weeks, data.daysPerWeek, data.goal);
    const sessions = planStructure.map(s => ({
      ...s,
      programId: id,
      status: 'pending'
    }));

    await db.sessions.bulkAdd(sessions);
    return { success: true, programId: id };
  };

  const deleteCurrentProgram = async () => {
    const program = await db.programs.where('active').equals(1).first();
    if (program) {
      await db.sessions.where('programId').equals(program.id).delete();
      await db.programs.update(program.id, { active: 0 }); // Mark as inactive/deleted
      console.log('Program deleted locally');
    }
  };

  // --- SESSIONS ---
  const getDailySession = async (sessionId) => {
    const session = await db.sessions.get(parseInt(sessionId));
    const history = await db.sessions
      .where('status').equals('completed')
      .limit(20)
      .toArray();
    
    const workouts = await db.workouts.toArray();
    
    // Recommendations using local engine
    const recommendations = recommendWorkouts(workouts, history, session.sessionType);

    return {
      session: session,
      recommendations: recommendations
    };
  };

  const completeSession = async (data) => {
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
  };

  // --- PERSISTENCE ---
  const requestPersistence = async () => {
    if (typeof navigator !== 'undefined' && navigator.storage && navigator.storage.persist) {
      const isPersisted = await navigator.storage.persist();
      console.log(`Resource persistence confirmed: ${isPersisted}`);
    }
  };

  return {
    getWorkouts,
    getCurrentProgram,
    createProgram,
    deleteCurrentProgram,
    getDailySession,
    completeSession,
    requestPersistence
  };
};
