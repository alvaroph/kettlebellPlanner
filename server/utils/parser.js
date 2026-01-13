/**
 * Simple Workout Parser helper.
 * Validates the workout JSON against the core requirements.
 * Avoids complex ES6+ or higher-order functions.
 */

export default function parseWorkout(rawJson) {
  var workout = null;
  
  if (typeof rawJson === 'string') {
    try {
      workout = JSON.parse(rawJson);
    } catch (e) {
      console.error("Failed to parse JSON string", e);
      return null;
    }
  } else {
    workout = rawJson;
  }

  // Basic validation of required fields
  if (!workout.title || !workout.durationMinutes || !workout.blocks) {
    console.error("Missing required workout fields: title, durationMinutes, or blocks");
    return null;
  }

  if (!Array.isArray(workout.blocks)) {
    console.error("Workout blocks must be an array");
    return null;
  }

  // Ensure blocks are well-formed
  for (var i = 0; i < workout.blocks.length; i++) {
    var block = workout.blocks[i];
    if (!block.type || (!block.exercises && !block.rules)) {
      console.error("Block " + i + " is missing type or instruction (exercises/rules)");
      return null;
    }
  }

  return {
    title: workout.title,
    source: workout.source || 'unknown',
    durationMinutes: parseInt(workout.durationMinutes),
    difficulty: parseInt(workout.difficulty || 3),
    focusTags: Array.isArray(workout.focus) ? workout.focus.join(',') : (workout.focusTags || 'general'),
    format: workout.format || 'Standard',
    equipment: JSON.stringify(workout.equipment || {}),
    blocks: JSON.stringify(workout.blocks),
    contraindications: Array.isArray(workout.contraindications) ? workout.contraindications.join(',') : (workout.contraindications || ''),
    notes: Array.isArray(workout.notes) ? workout.notes.join('\n') : (workout.notes || '')
  };
}
