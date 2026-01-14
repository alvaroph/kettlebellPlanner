// prisma/seed.js
import pkg from '@prisma/client';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const { PrismaClient } = pkg;
const prisma = new PrismaClient();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load shared workouts from the assets directory
const workoutsPath = path.join(__dirname, '../app/assets/data/workouts.json');
const workouts = JSON.parse(fs.readFileSync(workoutsPath, 'utf8'));

async function main() {
  console.log("Start seeding from shared JSON...");
  
  // Clean existing data in order to avoid FK violations
  console.log("Cleaning database...");
  await prisma.workoutFeedback.deleteMany({});
  await prisma.programSession.deleteMany({});
  await prisma.program.deleteMany({});
  await prisma.workout.deleteMany({});
  
  for (const w of workouts) {
    const workout = await prisma.workout.create({
      data: {
        title: w.title,
        source: w.source || "Shared Library",
        durationMinutes: w.durationMinutes,
        difficulty: w.difficulty,
        focusTags: Array.isArray(w.focus) ? w.focus.join(',') : (w.focusTags || ""),
        format: w.format,
        blocks: JSON.stringify(w.blocks),
        equipment: JSON.stringify({ kettlebell: true }),
        notes: "Seed workout"
      }
    });
    console.log(`Created workout: ${workout.title}`);
  }
  
  console.log("Seeding finished.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
