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
 * Selects 3 options from local workouts based on history.
 */
export function recommendWorkouts(availableWorkouts, history, type) {
  var filtered = [];
  
  // 1. Filter by type (case-insensitive and robust)
  var searchType = (type || "").toLowerCase();
  for (var i = 0; i < availableWorkouts.length; i++) {
    var w = availableWorkouts[i];
    
    // Check if the type is explicitly mentioned in focusTags
    var tags = (w.focusTags || "").toLowerCase();
    
    if (tags.indexOf(searchType) !== -1) {
      filtered.push(w);
    }
  }

  // 2. Simple selection (first 3 that aren't in recent history)
  var recommendations = [];
  for (var j = 0; j < filtered.length; j++) {
    var workout = filtered[j];
    var recentlyDone = false;
    
    // Check history (last 5 sessions)
    for (var k = 0; k < Math.min(history.length, 5); k++) {
      if (history[k].selectedWorkoutId === workout.id) {
        recentlyDone = true;
        break;
      }
    }

    if (!recentlyDone) {
      recommendations.push(workout);
    }

    if (recommendations.length >= 3) {
      break;
    }
  }

  // If we don't have enough, fill with what we have
  if (recommendations.length < 3 && filtered.length > 0) {
    for (var l = 0; l < filtered.length; l++) {
      if (recommendations.length >= 3) break;
      var found = false;
      for (var m = 0; m < recommendations.length; m++) {
        if (recommendations[m].id === filtered[l].id) {
          found = true;
          break;
        }
      }
      if (!found) recommendations.push(filtered[l]);
    }
  }

  // Fallback: If still empty, return ANY 3 workouts to avoid empty screen
  if (recommendations.length === 0 && availableWorkouts.length > 0) {
    recommendations = availableWorkouts.slice(0, 3);
  }

  return recommendations;
}
