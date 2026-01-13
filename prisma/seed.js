// prisma/seed.js
import pkg from '@prisma/client';
const { PrismaClient } = pkg;
const prisma = new PrismaClient();

const workouts = [
  {
    title: "KB Fundamentals: Strength",
    source: "Manual",
    durationMinutes: 30,
    difficulty: 2,
    focus: ["strength"],
    format: "Sets/Reps",
    blocks: [
      {
        type: "warmup",
        duration_minutes: 5,
        exercises: [{ name: "Halos", reps: 10 }, { name: "Slingshot", reps: 10 }]
      },
      {
        type: "main",
        duration_minutes: 20,
        exercises: [
          { name: "KB Goblet Squat", reps: 10, sets: 4 },
          { name: "KB Overhead Press", reps: 8, sets: 4 }
        ]
      }
    ]
  },
  {
    title: "The 300 Swings Challenge",
    source: "Online",
    durationMinutes: 20,
    difficulty: 4,
    focus: ["conditioning"],
    format: "EMOM",
    blocks: [
      {
        type: "warmup",
        duration_minutes: 5,
        exercises: [{ name: "Joint Rotation", reps: 1 }]
      },
      {
        type: "main",
        duration_minutes: 15,
        rules: { style: "EMOM", every: "1 minute", task: "20 Swings" }
      }
    ]
  },
  {
    title: "Mobility Flow A",
    source: "Manual",
    durationMinutes: 15,
    difficulty: 1,
    focus: ["mobility"],
    format: "Flow",
    blocks: [
      {
        type: "main",
        duration_minutes: 15,
        exercises: [
          { name: "World's Greatest Stretch", reps: 5 },
          { name: "Cossack Squat", reps: 10 }
        ]
      }
    ]
  },
  {
    title: "Core Crusher AMRAP",
    source: "Book",
    durationMinutes: 15,
    difficulty: 3,
    focus: ["conditioning", "core"],
    format: "AMRAP",
    blocks: [
      {
        type: "main",
        duration_minutes: 15,
        rules: { style: "AMRAP" },
        exercises: [
          { name: "KB Plank Pullthrough", reps: 10 },
          { name: "KB Russian Twist", reps: 20 }
        ]
      }
    ]
  },
  {
    title: "Heavy Carry Medley",
    source: "Manual",
    durationMinutes: 25,
    difficulty: 4,
    focus: ["strength"],
    format: "Distance",
    blocks: [
      {
        type: "main",
        duration_minutes: 20,
        exercises: [
          { name: "Farmer's Walk", reps: "40m", sets: 5 },
          { name: "Rack Carry", reps: "20m", sets: 5 }
        ]
      }
    ]
  },

  // ---------- NUEVOS 10 WORKOUTS ----------

  {
    title: "Full Body EMOM Builder",
    source: "Custom",
    durationMinutes: 20,
    difficulty: 3,
    focus: ["strength", "conditioning"],
    format: "EMOM",
    blocks: [
      {
        type: "main",
        duration_minutes: 20,
        rules: { style: "EMOM", cycle: "4 minutes" },
        exercises: [
          { name: "KB Swing", reps: 15 },
          { name: "KB Push Press", reps: 8 },
          { name: "KB Goblet Squat", reps: 10 },
          { name: "Rest", reps: 0 }
        ]
      }
    ]
  },
  {
    title: "Lower Body Strength Day",
    source: "Manual",
    durationMinutes: 30,
    difficulty: 4,
    focus: ["strength", "legs"],
    format: "Sets/Reps",
    blocks: [
      {
        type: "warmup",
        duration_minutes: 5,
        exercises: [{ name: "Glute Bridge", reps: 15 }]
      },
      {
        type: "main",
        duration_minutes: 20,
        exercises: [
          { name: "KB Front Squat", reps: 8, sets: 5 },
          { name: "KB Reverse Lunge", reps: 10, sets: 4 }
        ]
      }
    ]
  },
  {
    title: "Quick Conditioning Circuit",
    source: "Online",
    durationMinutes: 12,
    difficulty: 3,
    focus: ["conditioning"],
    format: "Circuit",
    blocks: [
      {
        type: "main",
        duration_minutes: 12,
        exercises: [
          { name: "KB Swing", reps: 20 },
          { name: "Burpee", reps: 10 },
          { name: "Mountain Climber", reps: 20 }
        ]
      }
    ]
  },
  {
    title: "Upper Body Push/Pull",
    source: "Manual",
    durationMinutes: 25,
    difficulty: 3,
    focus: ["strength", "upper_body"],
    format: "Sets/Reps",
    blocks: [
      {
        type: "main",
        duration_minutes: 20,
        exercises: [
          { name: "KB Row", reps: 10, sets: 4 },
          { name: "KB Floor Press", reps: 8, sets: 4 }
        ]
      }
    ]
  },
  {
    title: "Swing Density Session",
    source: "Book",
    durationMinutes: 20,
    difficulty: 4,
    focus: ["conditioning", "posterior_chain"],
    format: "Density",
    blocks: [
      {
        type: "main",
        duration_minutes: 20,
        exercises: [{ name: "KB Swing", reps: 15 }]
      }
    ]
  },
  {
    title: "Core Stability Builder",
    source: "Custom",
    durationMinutes: 18,
    difficulty: 2,
    focus: ["core"],
    format: "Intervals",
    blocks: [
      {
        type: "main",
        duration_minutes: 18,
        exercises: [
          { name: "Plank", reps: "40s" },
          { name: "Dead Bug", reps: 10 },
          { name: "Side Plank", reps: "30s" }
        ]
      }
    ]
  },
  {
    title: "KB Complex Lite",
    source: "Manual",
    durationMinutes: 15,
    difficulty: 3,
    focus: ["conditioning", "full_body"],
    format: "Complex",
    blocks: [
      {
        type: "main",
        duration_minutes: 15,
        exercises: [
          { name: "KB Deadlift", reps: 5 },
          { name: "KB Clean", reps: 5 },
          { name: "KB Press", reps: 5 }
        ]
      }
    ]
  },
  {
    title: "Recovery & Breath",
    source: "Custom",
    durationMinutes: 10,
    difficulty: 1,
    focus: ["mobility", "recovery"],
    format: "Flow",
    blocks: [
      {
        type: "main",
        duration_minutes: 10,
        exercises: [
          { name: "Deep Squat Hold", reps: "60s" },
          { name: "Breathing Drill", reps: 5 }
        ]
      }
    ]
  },
  {
    title: "Conditioning Ladder",
    source: "Book",
    durationMinutes: 20,
    difficulty: 4,
    focus: ["conditioning"],
    format: "Ladder",
    blocks: [
      {
        type: "main",
        duration_minutes: 20,
        exercises: [
          { name: "KB Swing", reps: "1-10" },
          { name: "Push-up", reps: "1-10" }
        ]
      }
    ]
  },
  {
    title: "Technique & Control",
    source: "Manual",
    durationMinutes: 20,
    difficulty: 2,
    focus: ["technique", "strength"],
    format: "Controlled Sets",
    blocks: [
      {
        type: "main",
        duration_minutes: 20,
        exercises: [
          { name: "KB Clean Technique", reps: 5, sets: 5 },
          { name: "KB Press Pause", reps: 5, sets: 4 }
        ]
      }
    ]
  },
  {
  title: "Fundamentos de Piernas y Swings",
  source: "Efecto Kettlebell",
  durationMinutes: 25,
  difficulty: 2,
  focus: ["fundamentals", "legs", "conditioning"],
  format: "Sets/Reps",
  blocks: [
    {
      type: "main",
      duration_minutes: 25,
      exercises: [
        { name: "Squat", reps: 10, sets: 4 },
        { name: "Swing", reps: 10, sets: 4 },
        { name: "Levantamiento Turco", reps: 1, sets: 5, side: "each" },
        { name: "Swing", reps: "max", duration: "1 min" }
      ]
    }
  ]
},
{
  title: "Fundamentos de Bisagra y Estabilidad",
  source: "Efecto Kettlebell",
  durationMinutes: 25,
  difficulty: 2,
  focus: ["fundamentals", "posterior_chain", "core"],
  format: "Sets/Reps",
  blocks: [
    {
      type: "main",
      duration_minutes: 25,
      exercises: [
        { name: "Deadlift", reps: 10, sets: 4 },
        { name: "Swing", reps: 10, sets: 4 },
        { name: "Levantamiento Turco", reps: 1, sets: 5, side: "each" },
        { name: "Swing", reps: "max", duration: "1 min" }
      ]
    }
  ]
}

,
{
  title: "Práctica Técnica de Balísticos",
  source: "Efecto Kettlebell",
  durationMinutes: 20,
  difficulty: 1,
  focus: ["fundamentals", "technique"],
  format: "Technique Practice",
  blocks: [
    {
      type: "main",
      duration_minutes: 20,
      exercises: [
        { name: "Swing 1 mano", duration: "5-10 min" },
        { name: "Clean", duration: "5-10 min" },
        { name: "Press", duration: "5-10 min" }
      ]
    }
  ]
}
,
{
  title: "Sentadilla en Rack y Control Total",
  source: "Efecto Kettlebell",
  durationMinutes: 25,
  difficulty: 2,
  focus: ["fundamentals", "legs", "full_body"],
  format: "Sets/Reps",
  blocks: [
    {
      type: "main",
      duration_minutes: 25,
      exercises: [
        { name: "Squat en Rack", reps: 8, sets: 3 },
        { name: "Swing", reps: 10, sets: 4 },
        { name: "Levantamiento Turco", reps: 1, sets: 5, side: "each" },
        { name: "Swing", reps: "max", duration: "1 min" }
      ]
    }
  ]
}
,
{
  title: "Deadlift Maleta y Resistencia",
  source: "Efecto Kettlebell",
  durationMinutes: 30,
  difficulty: 3,
  focus: ["fundamentals", "posterior_chain", "conditioning"],
  format: "Sets/Reps",
  blocks: [
    {
      type: "main",
      duration_minutes: 30,
      exercises: [
        { name: "Deadlift Maleta", reps: 8, sets: 3, side: "each" },
        { name: "Swing", reps: 15, sets: 4 },
        { name: "Levantamiento Turco", reps: 2, sets: 5, side: "each" },
        { name: "Swing", reps: "max", duration: "1 min" }
      ]
    }
  ]
}
,
{
  title: "Sentadilla Base y Potencia Inicial",
  source: "Efecto Kettlebell",
  durationMinutes: 30,
  difficulty: 3,
  focus: ["fundamentals", "legs", "conditioning"],
  format: "Sets/Reps",
  blocks: [
    {
      type: "main",
      duration_minutes: 30,
      exercises: [
        { name: "Squat", reps: 10, sets: 4 },
        { name: "Swing", reps: 15, sets: 4 },
        { name: "Levantamiento Turco", reps: 2, sets: 5, side: "each" },
        { name: "Swing", reps: "max", duration: "1 min" }
      ]
    }
  ]
}
,
{
  title: "Práctica Técnica de Clean, Press y Snatch",
  source: "Efecto Kettlebell",
  durationMinutes: 20,
  difficulty: 1,
  focus: ["fundamentals", "technique"],
  format: "Technique Practice",
  blocks: [
    {
      type: "main",
      duration_minutes: 20,
      exercises: [
        { name: "Clean", duration: "5-10 min" },
        { name: "Press", duration: "5-10 min" },
        { name: "Snatch", duration: "5-10 min" }
      ]
    }
  ]
}
,
{
  title: "Deadlift Sumo y Fuerza Base",
  source: "Efecto Kettlebell",
  durationMinutes: 30,
  difficulty: 3,
  focus: ["fundamentals", "legs", "full_body"],
  format: "Sets/Reps",
  blocks: [
    {
      type: "main",
      duration_minutes: 30,
      exercises: [
        { name: "Deadlift Sumo", reps: 10, sets: 4 },
        { name: "Swing", reps: 15, sets: 4 },
        { name: "Levantamiento Turco", reps: 2, sets: 5, side: "each" },
        { name: "Swing", reps: "max", duration: "1 min" }
      ]
    }
  ]
}
,
// =========================
// SEMANA 3 · FUERZA
// =========================

{
  title: "Empuje y Tracción Clásica",
  source: "Efecto Kettlebell",
  durationMinutes: 35,
  difficulty: 4,
  focus: ["strength", "upper_body", "full_body"],
  format: "Sets/Reps",
  blocks: [
    {
      type: "main",
      duration_minutes: 35,
      exercises: [
        { name: "Clean & Press", reps: 5, sets: 5 },
        { name: "Row", reps: 5, sets: 5 },
        { name: "Levantamiento Turco", reps: 3, sets: 3, side: "each" },
        { name: "Swing 1 mano", reps: 10, sets: 4, side: "each" },
        { name: "Flexión Bottom-Up", reps: "8-10", sets: 3 }
      ]
    }
  ]
},
{
  title: "Fuerza de Piernas y Estabilidad",
  source: "Efecto Kettlebell",
  durationMinutes: 35,
  difficulty: 4,
  focus: ["strength", "legs", "core"],
  format: "Sets/Reps",
  blocks: [
    {
      type: "main",
      duration_minutes: 35,
      exercises: [
        { name: "Squat", reps: 10, sets: 5 },
        { name: "Desplante", reps: 10, sets: 5, side: "each_leg" },
        { name: "Squat en Rack", reps: 8, sets: 3 },
        { name: "Swing", reps: 15, sets: 4 },
        { name: "Pistol", reps: 2, sets: 3, side: "each" }
      ]
    }
  ]
},
{
  title: "Empuje Horizontal y Control del Core",
  source: "Efecto Kettlebell",
  durationMinutes: 35,
  difficulty: 4,
  focus: ["strength", "upper_body", "core"],
  format: "Sets/Reps",
  blocks: [
    {
      type: "main",
      duration_minutes: 35,
      exercises: [
        { name: "Press en el suelo", reps: 5, sets: 5 },
        { name: "Renegade Row", reps: 5, sets: 4, side: "each" },
        { name: "Windmill", reps: 5, sets: 4, side: "each" },
        { name: "Swing 1 mano", reps: 10, sets: 4, side: "each" },
        { name: "Dominada", reps: "8-10", sets: 4 }
      ]
    }
  ]
},
{
  title: "Bisagra Pesada y Trabajo Unilateral",
  source: "Efecto Kettlebell",
  durationMinutes: 35,
  difficulty: 4,
  focus: ["strength", "posterior_chain", "legs"],
  format: "Sets/Reps",
  blocks: [
    {
      type: "main",
      duration_minutes: 35,
      exercises: [
        { name: "Deadlift", reps: 10, sets: 5 },
        { name: "Squat en Rack", reps: 5, sets: 5 },
        { name: "Deadlift con 1 pierna", reps: 5, sets: 5, side: "each" },
        { name: "Levantamiento Turco", reps: 3, sets: 5, side: "each" },
        { name: "Desplante", reps: 10, sets: 4, side: "each" }
      ]
    }
  ]
},

// =========================
// SEMANA 4 · FUERZA
// =========================

{
  title: "Estabilidad y Fuerza Rotacional",
  source: "Efecto Kettlebell",
  durationMinutes: 35,
  difficulty: 4,
  focus: ["strength", "core", "full_body"],
  format: "Sets/Reps",
  blocks: [
    {
      type: "main",
      duration_minutes: 35,
      exercises: [
        { name: "Windmill", reps: 5, sets: 5, side: "each" },
        { name: "Row", reps: 5, sets: 5 },
        { name: "Desplante en ocho", reps: 12, sets: 5, side: "each" },
        { name: "Swing 1 mano", reps: 12, sets: 4, side: "each" },
        { name: "Flexión Bottom-Up", reps: "8-10", sets: 3 }
      ]
    }
  ]
},
{
  title: "Fuerza Unilateral de Piernas",
  source: "Efecto Kettlebell",
  durationMinutes: 35,
  difficulty: 4,
  focus: ["strength", "legs", "core"],
  format: "Sets/Reps",
  blocks: [
    {
      type: "main",
      duration_minutes: 35,
      exercises: [
        { name: "Levantamiento Turco", reps: 2, sets: 5, side: "each" },
        { name: "Desplante", reps: 10, sets: 5, side: "each_leg" },
        { name: "Squat en Rack", reps: 10, sets: 5 },
        { name: "Deadlift con 1 pierna", reps: 5, sets: 5, side: "each" },
        { name: "Pistol", reps: 2, sets: 4, side: "each" }
      ]
    }
  ]
},
{
  title: "Empuje Vertical y Tracción Intensa",
  source: "Efecto Kettlebell",
  durationMinutes: 35,
  difficulty: 4,
  focus: ["strength", "upper_body"],
  format: "Sets/Reps",
  blocks: [
    {
      type: "main",
      duration_minutes: 35,
      exercises: [
        { name: "Press en el suelo", reps: 5, sets: 5 },
        { name: "Renegade Row", reps: 5, sets: 5, side: "each" },
        { name: "Windmill", reps: 5, sets: 5, side: "each" },
        { name: "Press", reps: 5, sets: 5, side: "each" },
        { name: "Dominada", reps: "8-10", sets: 4 }
      ]
    }
  ]
},
{
  title: "Fuerza Total de Tren Inferior",
  source: "Efecto Kettlebell",
  durationMinutes: 35,
  difficulty: 4,
  focus: ["strength", "legs", "full_body"],
  format: "Sets/Reps",
  blocks: [
    {
      type: "main",
      duration_minutes: 35,
      exercises: [
        { name: "Deadlift Sumo", reps: 5, sets: 5 },
        { name: "Squat en Rack", reps: 5, sets: 5 },
        { name: "Deadlift Maleta", reps: 5, sets: 5 },
        { name: "Desplante Lateral", reps: 10, sets: 3, side: "each" },
        { name: "Pistol", reps: 2, sets: 4, side: "each" }
      ]
    }
  ]
},
// =========================
// SEMANA 5 · POTENCIA
// =========================

{
  title: "Potencia de Cadera y Balísticos",
  source: "Efecto Kettlebell",
  durationMinutes: 30,
  difficulty: 4,
  focus: ["power", "posterior_chain", "conditioning"],
  format: "Sets/Reps",
  blocks: [
    {
      type: "main",
      duration_minutes: 30,
      exercises: [
        { name: "Swing", reps: 20, sets: 5 },
        { name: "Clean", reps: 8, sets: 4, side: "each" },
        { name: "Jump Squat", reps: 10, sets: 4 },
        { name: "Swing 1 mano", reps: 12, sets: 4, side: "each" }
      ]
    }
  ]
},
{
  title: "Explosividad Unilateral y Control",
  source: "Efecto Kettlebell",
  durationMinutes: 30,
  difficulty: 4,
  focus: ["power", "full_body", "coordination"],
  format: "Sets/Reps",
  blocks: [
    {
      type: "main",
      duration_minutes: 30,
      exercises: [
        { name: "Snatch", reps: 6, sets: 5, side: "each" },
        { name: "Reverse Lunge", reps: 8, sets: 4, side: "each_leg" },
        { name: "Swing", reps: 15, sets: 4 },
        { name: "Plank", reps: "45s", sets: 3 }
      ]
    }
  ]
},
{
  title: "Potencia Vertical y Empuje",
  source: "Efecto Kettlebell",
  durationMinutes: 30,
  difficulty: 4,
  focus: ["power", "upper_body"],
  format: "Sets/Reps",
  blocks: [
    {
      type: "main",
      duration_minutes: 30,
      exercises: [
        { name: "Push Press", reps: 6, sets: 5, side: "each" },
        { name: "High Pull", reps: 8, sets: 4 },
        { name: "Swing", reps: 20, sets: 4 },
        { name: "Hollow Hold", reps: "30s", sets: 3 }
      ]
    }
  ]
},
{
  title: "Potencia Total y Resistencia",
  source: "Efecto Kettlebell",
  durationMinutes: 30,
  difficulty: 4,
  focus: ["power", "conditioning", "full_body"],
  format: "Sets/Reps",
  blocks: [
    {
      type: "main",
      duration_minutes: 30,
      exercises: [
        { name: "Clean & Jerk", reps: 5, sets: 5, side: "each" },
        { name: "Swing", reps: 25, sets: 4 },
        { name: "Goblet Squat", reps: 12, sets: 4 },
        { name: "Farmer Carry", reps: "40m", sets: 4 }
      ]
    }
  ]
},

// =========================
// SEMANA 6 · POTENCIA
// =========================

{
  title: "Balísticos Avanzados y Ritmo",
  source: "Efecto Kettlebell",
  durationMinutes: 35,
  difficulty: 5,
  focus: ["power", "conditioning"],
  format: "Sets/Reps",
  blocks: [
    {
      type: "main",
      duration_minutes: 35,
      exercises: [
        { name: "Snatch", reps: 10, sets: 5, side: "each" },
        { name: "Swing", reps: 30, sets: 4 },
        { name: "Jump Squat", reps: 12, sets: 4 },
        { name: "Plank", reps: "60s", sets: 3 }
      ]
    }
  ]
},
{
  title: "Potencia Unilateral de Tren Inferior",
  source: "Efecto Kettlebell",
  durationMinutes: 35,
  difficulty: 5,
  focus: ["power", "legs"],
  format: "Sets/Reps",
  blocks: [
    {
      type: "main",
      duration_minutes: 35,
      exercises: [
        { name: "Clean", reps: 10, sets: 4, side: "each" },
        { name: "Reverse Lunge", reps: 10, sets: 4, side: "each_leg" },
        { name: "Swing 1 mano", reps: 15, sets: 4, side: "each" },
        { name: "Side Plank", reps: "45s", sets: 3, side: "each" }
      ]
    }
  ]
},
{
  title: "Empuje Explosivo y Core",
  source: "Efecto Kettlebell",
  durationMinutes: 35,
  difficulty: 5,
  focus: ["power", "upper_body", "core"],
  format: "Sets/Reps",
  blocks: [
    {
      type: "main",
      duration_minutes: 35,
      exercises: [
        { name: "Push Press", reps: 8, sets: 5, side: "each" },
        { name: "High Pull", reps: 10, sets: 4 },
        { name: "Swing", reps: 25, sets: 4 },
        { name: "Hollow Hold", reps: "45s", sets: 3 }
      ]
    }
  ]
},
{
  title: "Potencia Global y Trabajo Mixto",
  source: "Efecto Kettlebell",
  durationMinutes: 35,
  difficulty: 5,
  focus: ["power", "full_body", "conditioning"],
  format: "Sets/Reps",
  blocks: [
    {
      type: "main",
      duration_minutes: 35,
      exercises: [
        { name: "Clean & Jerk", reps: 6, sets: 5, side: "each" },
        { name: "Swing", reps: 30, sets: 4 },
        { name: "Goblet Squat", reps: 15, sets: 4 },
        { name: "Farmer Carry", reps: "50m", sets: 4 }
      ]
    }
  ]
},
// =========================
// SEMANA 7 · ACONDICIONAMIENTO
// =========================

{
  title: "Acondicionamiento Base Full Body",
  source: "Efecto Kettlebell",
  durationMinutes: 25,
  difficulty: 3,
  focus: ["conditioning", "full_body"],
  format: "AMRAP",
  blocks: [
    {
      type: "main",
      duration_minutes: 25,
      rules: { style: "AMRAP" },
      exercises: [
        { name: "Swing", reps: 20 },
        { name: "Goblet Squat", reps: 15 },
        { name: "Push-up", reps: 10 }
      ]
    }
  ]
},
{
  title: "Resistencia de Tren Inferior",
  source: "Efecto Kettlebell",
  durationMinutes: 25,
  difficulty: 3,
  focus: ["conditioning", "legs"],
  format: "Intervals",
  blocks: [
    {
      type: "main",
      duration_minutes: 25,
      exercises: [
        { name: "Reverse Lunge", reps: 12 },
        { name: "Swing", reps: 20 },
        { name: "Wall Sit", reps: "45s" }
      ]
    }
  ]
},
{
  title: "Condición y Core Dinámico",
  source: "Efecto Kettlebell",
  durationMinutes: 20,
  difficulty: 3,
  focus: ["conditioning", "core"],
  format: "AMRAP",
  blocks: [
    {
      type: "main",
      duration_minutes: 20,
      rules: { style: "AMRAP" },
      exercises: [
        { name: "KB Russian Twist", reps: 20 },
        { name: "Mountain Climber", reps: 30 },
        { name: "Plank", reps: "40s" }
      ]
    }
  ]
},
{
  title: "Circuito Metabólico Mixto",
  source: "Efecto Kettlebell",
  durationMinutes: 25,
  difficulty: 3,
  focus: ["conditioning", "full_body"],
  format: "Circuit",
  blocks: [
    {
      type: "main",
      duration_minutes: 25,
      exercises: [
        { name: "Swing", reps: 15 },
        { name: "Clean", reps: 8, side: "each" },
        { name: "Push Press", reps: 6, side: "each" }
      ]
    }
  ]
},

// =========================
// SEMANA 8 · ACONDICIONAMIENTO
// =========================

{
  title: "EMOM Cardio con Kettlebell",
  source: "Efecto Kettlebell",
  durationMinutes: 20,
  difficulty: 4,
  focus: ["conditioning"],
  format: "EMOM",
  blocks: [
    {
      type: "main",
      duration_minutes: 20,
      rules: { style: "EMOM", every: "1 min" },
      exercises: [
        { name: "Swing", reps: 20 }
      ]
    }
  ]
},
{
  title: "Resistencia Unilateral y Control",
  source: "Efecto Kettlebell",
  durationMinutes: 25,
  difficulty: 4,
  focus: ["conditioning", "full_body"],
  format: "AMRAP",
  blocks: [
    {
      type: "main",
      duration_minutes: 25,
      rules: { style: "AMRAP" },
      exercises: [
        { name: "Snatch", reps: 6, side: "each" },
        { name: "Reverse Lunge", reps: 10, side: "each_leg" },
        { name: "Plank", reps: "45s" }
      ]
    }
  ]
},
{
  title: "Condición de Empuje y Tracción",
  source: "Efecto Kettlebell",
  durationMinutes: 25,
  difficulty: 4,
  focus: ["conditioning", "upper_body"],
  format: "Circuit",
  blocks: [
    {
      type: "main",
      duration_minutes: 25,
      exercises: [
        { name: "Push Press", reps: 8 },
        { name: "Row", reps: 10 },
        { name: "Burpee", reps: 10 }
      ]
    }
  ]
},
{
  title: "Metcon Progresivo",
  source: "Efecto Kettlebell",
  durationMinutes: 30,
  difficulty: 4,
  focus: ["conditioning", "full_body"],
  format: "Ladder",
  blocks: [
    {
      type: "main",
      duration_minutes: 30,
      exercises: [
        { name: "Swing", reps: "10-20-30" },
        { name: "Goblet Squat", reps: "10-20-30" }
      ]
    }
  ]
},

// =========================
// SEMANA 9 · ACONDICIONAMIENTO
// =========================

{
  title: "AMRAP Largo de Resistencia",
  source: "Efecto Kettlebell",
  durationMinutes: 30,
  difficulty: 4,
  focus: ["conditioning", "full_body"],
  format: "AMRAP",
  blocks: [
    {
      type: "main",
      duration_minutes: 30,
      rules: { style: "AMRAP" },
      exercises: [
        { name: "Swing", reps: 25 },
        { name: "Push-up", reps: 15 },
        { name: "Goblet Squat", reps: 20 }
      ]
    }
  ]
},
{
  title: "Intervalos de Alta Demanda",
  source: "Efecto Kettlebell",
  durationMinutes: 25,
  difficulty: 4,
  focus: ["conditioning"],
  format: "Intervals",
  blocks: [
    {
      type: "main",
      duration_minutes: 25,
      exercises: [
        { name: "Snatch", reps: 8, side: "each" },
        { name: "Jump Squat", reps: 12 },
        { name: "Rest", reps: "30s" }
      ]
    }
  ]
},
{
  title: "Core y Cardio Continuo",
  source: "Efecto Kettlebell",
  durationMinutes: 25,
  difficulty: 4,
  focus: ["conditioning", "core"],
  format: "Circuit",
  blocks: [
    {
      type: "main",
      duration_minutes: 25,
      exercises: [
        { name: "KB Russian Twist", reps: 25 },
        { name: "Mountain Climber", reps: 40 },
        { name: "Plank", reps: "60s" }
      ]
    }
  ]
},
{
  title: "Condición Mixta con Cargas",
  source: "Efecto Kettlebell",
  durationMinutes: 30,
  difficulty: 4,
  focus: ["conditioning", "full_body"],
  format: "Circuit",
  blocks: [
    {
      type: "main",
      duration_minutes: 30,
      exercises: [
        { name: "Farmer Carry", reps: "40m" },
        { name: "Swing", reps: 30 },
        { name: "Goblet Squat", reps: 20 }
      ]
    }
  ]
},

// =========================
// SEMANA 10 · ACONDICIONAMIENTO
// =========================

{
  title: "EMOM Final de Resistencia",
  source: "Efecto Kettlebell",
  durationMinutes: 30,
  difficulty: 5,
  focus: ["conditioning"],
  format: "EMOM",
  blocks: [
    {
      type: "main",
      duration_minutes: 30,
      rules: { style: "EMOM", every: "1 min" },
      exercises: [
        { name: "Swing", reps: 25 }
      ]
    }
  ]
},
{
  title: "AMRAP Extendido Full Body",
  source: "Efecto Kettlebell",
  durationMinutes: 35,
  difficulty: 5,
  focus: ["conditioning", "full_body"],
  format: "AMRAP",
  blocks: [
    {
      type: "main",
      duration_minutes: 35,
      rules: { style: "AMRAP" },
      exercises: [
        { name: "Snatch", reps: 8, side: "each" },
        { name: "Push Press", reps: 10 },
        { name: "Goblet Squat", reps: 20 }
      ]
    }
  ]
},
{
  title: "Circuito Final de Core y Cardio",
  source: "Efecto Kettlebell",
  durationMinutes: 30,
  difficulty: 5,
  focus: ["conditioning", "core"],
  format: "Circuit",
  blocks: [
    {
      type: "main",
      duration_minutes: 30,
      exercises: [
        { name: "KB Russian Twist", reps: 30 },
        { name: "Plank", reps: "90s" },
        { name: "Mountain Climber", reps: 50 }
      ]
    }
  ]
},
{
  title: "Desafío Final Metabólico",
  source: "Efecto Kettlebell",
  durationMinutes: 35,
  difficulty: 5,
  focus: ["conditioning", "full_body"],
  format: "For Time",
  blocks: [
    {
      type: "main",
      duration_minutes: 35,
      exercises: [
        { name: "Swing", reps: 200 },
        { name: "Goblet Squat", reps: 100 },
        { name: "Push-up", reps: 100 }
      ]
    }
  ]
}



];


async function main() {
  console.log("Start seeding...");
  
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
        source: w.source,
        durationMinutes: w.durationMinutes,
        difficulty: w.difficulty,
        focusTags: w.focus.join(','),
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
