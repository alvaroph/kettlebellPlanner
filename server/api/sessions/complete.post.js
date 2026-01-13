// server/api/sessions/complete.post.js
import pkg from '@prisma/client';
const { PrismaClient } = pkg;

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  
  const sessionId = body.sessionId;
  const workoutId = body.workoutId;
  const rating = parseInt(body.rating || 5);
  
  // Accept both 'repeat' and 'repeatPreference' for backward/frontend compatibility
  const repeat = body.repeat === true || body.repeat === 'true' || body.repeatPreference === true || body.repeatPreference === 'true';
  
  // Default to "ok" if effort is missing or coming as a number from old UI state
  let effort = body.effort;
  if (!effort || typeof effort === 'number') {
    effort = 'ok';
  }
  
  const notes = body.notes || '';

  try {
    // 1. Update the session status
    await prisma.programSession.update({
      where: { id: sessionId },
      data: {
        status: 'completed',
        selectedWorkoutId: workoutId,
        completedAt: new Date()
      }
    });

    // 2. Create the feedback log
    const log = await prisma.workoutFeedback.create({
      data: {
        sessionId: sessionId,
        workoutId: workoutId,
        rating: rating,
        repeat: repeat,
        perceivedEffort: effort,
        notes: notes
      }
    });

    return {
      success: true,
      logId: log.id
    };
  } catch (error) {
    console.error("Error in complete.post.js:", error);
    throw createError({
      statusCode: 500,
      statusMessage: 'Error saving workout log: ' + error.message
    });
  }
});
