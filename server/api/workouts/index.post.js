// server/api/workouts/index.post.js
import pkg from '@prisma/client';
const { PrismaClient } = pkg;
const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  
  // Validation (minimal for JS)
  if (!body.title || !body.blocks) {
    return { error: 'Invalid workout data' };
  }

  const workout = await prisma.workout.create({
    data: {
      title: body.title,
      source: body.source || 'Manual',
      durationMinutes: parseInt(body.durationMinutes || 30),
      difficulty: parseInt(body.difficulty || 3),
      focusTags: Array.isArray(body.focus) ? body.focus.join(',') : 'general',
      format: body.format || 'Standard',
      equipment: JSON.stringify(body.equipment || { kettlebell: true }),
      blocks: typeof body.blocks === 'string' ? body.blocks : JSON.stringify(body.blocks),
      notes: body.notes || ''
    }
  });

  return { success: true, workoutId: workout.id };
});
