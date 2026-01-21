import { db } from '../services/database';
import { generateStructure, recommendWorkouts } from '../utils/planner';

/**
 * Repository Composable (Serverless)
 * Centralizes all data access using Dexie (IndexedDB). No API calls.
 */
export var useData = function () {
  // --- WORKOUTS ---
  var getWorkouts = async function () {
    var workouts = await db.workouts.toArray();
    
    // Cross-reference with completed sessions and feedback
    var completedSessions = await db.sessions.where('status').equals('completed').toArray();
    var feedbacks = await db.feedback.toArray();
    
    var result = [];
    for (var i = 0; i < workouts.length; i++) {
        var w = workouts[i];
        var matchingSessions = [];
        for (var j = 0; j < completedSessions.length; j++) {
            if (completedSessions[j].selectedWorkoutId === w.id) {
                matchingSessions.push(completedSessions[j]);
            }
        }
        
        var matchingFeedbacks = [];
        for (var k = 0; k < feedbacks.length; k++) {
            if (feedbacks[k].workoutId === w.id) {
                matchingFeedbacks.push(feedbacks[k]);
            }
        }
        
        var feedbacksMapped = [];
        for (var l = 0; l < matchingFeedbacks.length; l++) {
            var f = matchingFeedbacks[l];
            feedbacksMapped.push({
                date: f.createdAt,
                rating: f.rating,
                notes: f.notes,
                effort: f.repeat ? 'Repeat Preferred' : 'Standard'
            });
        }
        
        var workoutWithDetails = {};
        for (var key in w) {
            workoutWithDetails[key] = w[key];
        }
        workoutWithDetails.isCompleted = matchingSessions.length > 0;
        workoutWithDetails.timesCompleted = matchingSessions.length;
        workoutWithDetails.feedbacks = feedbacksMapped;
        
        result.push(workoutWithDetails);
    }
    return result;
  };

  // --- PROGRAMS ---
  var getCurrentProgram = async function () {
    var program = await db.programs.where('active').equals(1).first();
    if (!program) return null;
    
    var sessions = await db.sessions
      .where('programId').equals(program.id)
      .toArray();
    
    sessions.sort(function (a, b) {
        return (a.weekIndex - b.weekIndex) || (a.dayIndex - b.dayIndex);
    });
      
    var programWithSessions = {};
    for (var key in program) {
        programWithSessions[key] = program[key];
    }
    programWithSessions.sessions = sessions;

    return programWithSessions;
  };

  var createProgram = async function (data) {
    // 1. Deactivate old programs
    await db.programs.where('active').equals(1).modify({ active: 0 });
    
    // 2. Add new program
    var id = await db.programs.add({
      name: data.name,
      weeks: data.weeks,
      daysPerWeek: data.daysPerWeek,
      goal: data.goal,
      intensity: data.intensity,
      active: 1,
      createdAt: new Date()
    });

    // 3. Generate sessions using local utility
    var planStructure = generateStructure(data.weeks, data.daysPerWeek, data.goal);
    var sessions = [];
    for (var i = 0; i < planStructure.length; i++) {
        var s = planStructure[i];
        var session = {};
        for (var key in s) {
            session[key] = s[key];
        }
        session.programId = id;
        session.status = 'pending';
        sessions.push(session);
    }

    await db.sessions.bulkAdd(sessions);
    return { success: true, programId: id };
  };

  var getPrograms = async function () {
    return await db.programs.reverse().toArray();
  };

  var switchProgram = async function (programId) {
    await db.programs.toCollection().modify({ active: 0 });
    await db.programs.update(programId, { active: 1 });
  };

  var deleteProgram = async function (programId) {
    await db.sessions.where('programId').equals(programId).delete();
    await db.programs.delete(programId);
  };
  
  var deleteCurrentProgram = async function () {
    var program = await db.programs.where('active').equals(1).first();
    if (program) {
      await deleteProgram(program.id);
      console.log('Program deleted locally');
    }
  };

  // --- SESSIONS ---
  var getDailySession = async function (sessionId) {
    var session = await db.sessions.get(parseInt(sessionId));
    var history = await db.sessions
      .where('status').equals('completed')
      .limit(20)
      .toArray();
    
    var workouts = await db.workouts.toArray();
    
    // Recommendations using local engine
    var recommendations = recommendWorkouts(workouts, history, session.sessionType);

    return {
      session: session,
      recommendations: recommendations
    };
  };

  var completeSession = async function (data) {
    await db.sessions.update(parseInt(data.sessionId), {
      status: 'completed',
      selectedWorkoutId: data.workoutId,
      durationSeconds: data.durationSeconds || 0,
      completedAt: new Date()
    });
    
    await db.feedback.add({
      sessionId: parseInt(data.sessionId),
      workoutId: data.workoutId,
      rating: data.rating,
      difficulty: data.difficulty || 3,
      repeat: data.repeatPreference,
      notes: data.notes,
      createdAt: new Date()
    });
    
    return { success: true };
  };

  // --- PERSISTENCE ---
  var requestPersistence = async function () {
    if (typeof navigator !== 'undefined' && navigator.storage && navigator.storage.persist) {
      var isPersisted = await navigator.storage.persist();
      console.log('Resource persistence confirmed: ' + isPersisted);
    }
  };

  return {
    getWorkouts: getWorkouts,
    getCurrentProgram: getCurrentProgram,
    getPrograms: getPrograms,
    switchProgram: switchProgram,
    createProgram: createProgram,
    deleteCurrentProgram: deleteCurrentProgram,
    deleteProgram: deleteProgram,
    getDailySession: getDailySession,
    completeSession: completeSession,
    requestPersistence: requestPersistence
  };
};
