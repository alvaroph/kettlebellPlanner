// server/api/workouts/parse.post.js
/**
 * Simple Heuristic Parser for Kettlebell Workouts.
 * Tries to identify blocks (warmup, main, etc.) and exercises from raw text.
 */
export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const text = body.text || '';
  
  if (!text) return { error: 'No text provided' };

  // 1. Initial metadata (placeholders to be reviewed by user)
  const workout = {
    title: "Nuevo Entrenamiento",
    durationMinutes: 30,
    difficulty: 3,
    focus: ["full_body"],
    format: "Standard",
    blocks: []
  };

  // 2. Try to identify title (first line)
  const lines = text.split('\n').filter(l => l.trim().length > 0);
  if (lines.length > 0) {
    workout.title = lines[0].replace(/[#*]/g, '').trim();
  }

  // 3. Simple block identification
  let currentBlock = { type: 'main', exercises: [] };
  
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].toLowerCase();
    
    // Check for block headers
    if (line.includes('warm') || line.includes('calenta')) {
      if (currentBlock.exercises.length > 0) workout.blocks.push(currentBlock);
      currentBlock = { type: 'warmup', exercises: [] };
      continue;
    }
    
    if (line.includes('finisher') || line.includes('enfria')) {
      if (currentBlock.exercises.length > 0) workout.blocks.push(currentBlock);
      currentBlock = { type: 'finisher', exercises: [] };
      continue;
    }

    // Try to parse exercise: "10 Swings", "20 reps Halos", "Halos x 10"
    // Regex matches: (number) (name) OR (name) x (number)
    const repsMatch = line.match(/(\d+)\s*(reps|x)?\s+(.+)/i) || line.match(/(.+)\s*(x|reps)\s*(\d+)/i);
    
    if (repsMatch) {
      let name, reps;
      if (repsMatch[1].match(/^\d+$/)) {
        reps = repsMatch[1];
        name = repsMatch[3].trim();
      } else {
        name = repsMatch[1].trim();
        reps = repsMatch[3];
      }
      currentBlock.exercises.push({ name: name.charAt(0).toUpperCase() + name.slice(1), reps: reps });
    } else if (line.length > 3) {
      // Just a name without clear reps
      currentBlock.exercises.push({ name: lines[i].trim(), reps: "10" });
    }
  }
  
  if (currentBlock.exercises.length > 0) {
    workout.blocks.push(currentBlock);
  }

  return workout;
});
