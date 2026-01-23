// app/utils/planner.js
/**
 * Program Generation Logic (Client Side).
 * Creates a weekly structure based on goal and intensity.
 */

export function generateStructure(weeks, daysPerWeek, goal) {
  var structure = [];
  var sessionTypes = ['Strength', 'Conditioning', 'Mobility'];
  
  // Basic priority logic based on goal
  if (goal === 'Strength / Muscle') {
    sessionTypes = ['Strength', 'Strength', 'Conditioning', 'Mobility'];
  } else if (goal === 'FAT Loss') {
    sessionTypes = ['Conditioning', 'Conditioning', 'Strength', 'Mobility'];
  } else if (goal === 'Recovery / Mobility') {
    sessionTypes = ['Mobility', 'Mobility', 'Strength', 'Conditioning'];
  }

  for (var w = 1; w <= weeks; w++) {
    for (var d = 1; d <= daysPerWeek; d++) {
      // Simple rotation of types
      var typeIndex = (w + d) % sessionTypes.length;
      structure.push({
        weekIndex: w,
        dayIndex: d,
        sessionType: sessionTypes[typeIndex]
      });
    }
  }
  
  return structure;
}

/**
 * Recommendation Engine (Client Side).
 * Selects 3 options from local workouts based on history and user preferences.
 */
export function recommendWorkouts(availableWorkouts, history, type, preferences = {}, excludeIds = []) {
  var filtered = [];
  
  // 1. Filter by session type (Strength, Conditioning, Mobility)
  var searchType = (type || "").toLowerCase();
  var targetIntensity = preferences.intensity || 3;
  var targetFocus = (preferences.focus || "Full body").toLowerCase();

  for (var i = 0; i < availableWorkouts.length; i++) {
    var w = availableWorkouts[i];
    
    // Explicitly exclude IDs if requested (for regeneration)
    if (excludeIds.includes(w.id)) continue;

    var tags = (w.focusTags || "").toLowerCase();
    var category = (w.category || "").toLowerCase();
    
    // Type match: either in tags, category, or title
    var typeMatch = tags.indexOf(searchType) !== -1 || category === searchType || w.title.toLowerCase().indexOf(searchType) !== -1;
    
    if (typeMatch) {
      // Calculate a score for sorting
      var score = 0;
      
      // Difficulty match (prioritize within +/- 1)
      var diff = Math.abs(w.difficulty - targetIntensity);
      if (diff === 0) score += 10;
      else if (diff === 1) score += 5;
      
      // Focus match
      if (targetFocus !== "full body") {
        if (tags.indexOf(targetFocus) !== -1) score += 15;
      } else {
        // For full body, prioritize variety or explicit full body tags
        if (tags.indexOf("full body") !== -1) score += 5;
      }

      // History penalty (very strong)
      var recentlyDone = false;
      for (var k = 0; k < Math.min(history.length, 10); k++) {
        if (history[k].selectedWorkoutId === w.id) {
          recentlyDone = true;
          break;
        }
      }
      if (recentlyDone) score -= 50;

      filtered.push({ workout: w, score: score });
    }
  }

  // 2. Sort by score and add some randomness
  filtered.sort(function(a, b) {
    // Add a small random jitter to make it less deterministic if scores are close
    return (b.score + Math.random() * 2) - (a.score + Math.random() * 2);
  });

  // 3. Take top 3
  var recommendations = [];
  for (var j = 0; j < Math.min(filtered.length, 3); j++) {
    recommendations.push(filtered[j].workout);
  }

  // Fallback: If still empty, return ANY 3 workouts to avoid empty screen
  if (recommendations.length === 0 && availableWorkouts.length > 0) {
    recommendations = availableWorkouts
      .filter(w => !excludeIds.includes(w.id))
      .slice(0, 3);
  }

  return recommendations;
}
