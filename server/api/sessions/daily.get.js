// server/api/sessions/daily.get.js
import pkg from '@prisma/client';
const { PrismaClient } = pkg;
import { recommendWorkouts } from '../../utils/planner';

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const sessionId = query.sessionId;

  if (!sessionId) {
    return { error: 'Session ID is required' };
  }

  // 1. Get current session details
  const session = await prisma.programSession.findUnique({
    where: { id: sessionId },
    include: { program: true }
  });

  if (!session) {
    return { error: 'Session not found' };
  }

  // 2. Get history to avoid repetition (last 5 workouts)
  const history = await prisma.programSession.findMany({
    where: { 
      programId: session.programId,
      status: 'completed'
    },
    orderBy: { completedAt: 'desc' },
    take: 5
  });

  // 3. Get all eligible workouts
  const workouts = await prisma.workout.findMany();

  // 4. Use recommendation engine
  const recommendations = recommendWorkouts(workouts, history, session.sessionType);

  return {
    session: session,
    recommendations: recommendations
  };
});
