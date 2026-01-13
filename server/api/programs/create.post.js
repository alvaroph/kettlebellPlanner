// server/api/programs/create.post.js
import pkg from '@prisma/client';
const { PrismaClient } = pkg;
import { generateStructure } from '../../utils/planner';

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  
  // Extract fields without "abuse of destructuring" as requested
  const name = body.name;
  const weeks = parseInt(body.weeks || 4);
  const daysPerWeek = parseInt(body.daysPerWeek || 3);
  const goal = body.goal || 'General';
  const intensity = parseInt(body.intensity || 3);
  const sessionDuration = parseInt(body.sessionDuration || 30);
  const focusTags = body.focusTags || '';

  // 1. Create the program record
  const program = await prisma.program.create({
    data: {
      name: name,
      weeks: weeks,
      daysPerWeek: daysPerWeek,
      sessionDuration: sessionDuration,
      goal: goal,
      intensity: intensity,
      focusTags: focusTags,
      active: true
    }
  });

  // 2. Generate structure sessions
  const structure = generateStructure(weeks, daysPerWeek, goal);
  
  // 3. Save sessions to DB
  for (var i = 0; i < structure.length; i++) {
    var item = structure[i];
    await prisma.programSession.create({
      data: {
        programId: program.id,
        weekIndex: item.weekIndex,
        dayIndex: item.dayIndex,
        sessionType: item.sessionType,
        status: 'pending'
      }
    });
  }

  return {
    success: true,
    programId: program.id
  };
});
