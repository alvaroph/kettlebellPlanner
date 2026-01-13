// server/api/workouts/library.get.js
import pkg from '@prisma/client';
const { PrismaClient } = pkg;

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  try {
    // 1. Fetch all workouts
    const workouts = await prisma.workout.findMany({
      include: {
        feedbacks: {
          orderBy: { createdAt: 'desc' }
        },
        sessions: {
          where: { status: 'completed' }
        }
      },
      orderBy: { title: 'asc' }
    });

    // 2. Transform data to include completion counts and latest feedback
    const transformed = workouts.map(w => {
      return {
        id: w.id,
        title: w.title,
        difficulty: w.difficulty,
        durationMinutes: w.durationMinutes,
        focusTags: w.focusTags.split(',').filter(t => t.trim() !== ''),
        format: w.format,
        blocks: typeof w.blocks === 'string' ? JSON.parse(w.blocks) : w.blocks,
        timesCompleted: w.sessions.length,
        isCompleted: w.sessions.length > 0,
        feedbacks: w.feedbacks.map(f => ({
          rating: f.rating,
          effort: f.perceivedEffort,
          notes: f.notes,
          date: f.createdAt
        }))
      };
    });

    return transformed;
  } catch (error) {
    console.error("Error fetching library:", error);
    throw createError({
      statusCode: 500,
      statusMessage: 'Error fetching library: ' + error.message
    });
  }
});
