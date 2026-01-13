// app/utils/staticSeed.js

export const staticWorkouts = [
  {
    title: "KB Fundamentals: Strength",
    durationMinutes: 30,
    difficulty: 2,
    focusTags: "strength,fundamentals",
    format: "Sets/Reps",
    blocks: [
      {
        type: "warmup",
        exercises: [{ name: "Halos", reps: 10 }, { name: "Slingshot", reps: 10 }]
      },
      {
        type: "main",
        exercises: [
          { name: "KB Goblet Squat", reps: 10, sets: 4 },
          { name: "KB Overhead Press", reps: 8, sets: 4 }
        ]
      }
    ]
  },
  {
    title: "The 300 Swings Challenge",
    durationMinutes: 20,
    difficulty: 4,
    focusTags: "conditioning,power",
    format: "EMOM",
    blocks: [
      {
        type: "warmup",
        exercises: [{ name: "Joint Rotation", reps: 1 }]
      },
      {
        type: "main",
        exercises: [{ name: "KB Swings", reps: 20, sets: 15 }]
      }
    ]
  },
  {
    title: "Mobility Flow A",
    durationMinutes: 15,
    difficulty: 1,
    focusTags: "mobility,recovery",
    format: "Flow",
    blocks: [
      {
        type: "main",
        exercises: [
          { name: "World's Greatest Stretch", reps: 5 },
          { name: "Cossack Squat", reps: 10 }
        ]
      }
    ]
  },
  {
    title: "Core Crusher AMRAP",
    durationMinutes: 15,
    difficulty: 3,
    focusTags: "conditioning,core",
    format: "AMRAP",
    blocks: [
      {
        type: "main",
        exercises: [
          { name: "KB Plank Pullthrough", reps: 10 },
          { name: "KB Russian Twist", reps: 20 }
        ]
      }
    ]
  },
  {
    title: "Full Body EMOM Builder",
    durationMinutes: 20,
    difficulty: 3,
    focusTags: "strength,conditioning",
    format: "EMOM",
    blocks: [
      {
        type: "main",
        exercises: [
          { name: "KB Swing", reps: 15 },
          { name: "KB Push Press", reps: 8 },
          { name: "KB Goblet Squat", reps: 10 }
        ]
      }
    ]
  },
  {
    title: "Lower Body Strength Day",
    durationMinutes: 30,
    difficulty: 4,
    focusTags: "strength,legs",
    format: "Sets/Reps",
    blocks: [
      {
        type: "warmup",
        exercises: [{ name: "Glute Bridge", reps: 15 }]
      },
      {
        type: "main",
        exercises: [
          { name: "KB Front Squat", reps: 8, sets: 5 },
          { name: "KB Reverse Lunge", reps: 10, sets: 4 }
        ]
      }
    ]
  },
  {
    title: "Swing Density Session",
    durationMinutes: 20,
    difficulty: 4,
    focusTags: "conditioning,posterior_chain",
    format: "Density",
    blocks: [
      {
        type: "main",
        exercises: [{ name: "KB Swing", reps: 15, sets: 10 }]
      }
    ]
  },
  {
    title: "Upper Body Push/Pull",
    durationMinutes: 25,
    difficulty: 3,
    focusTags: "strength,upper_body",
    format: "Sets/Reps",
    blocks: [
      {
        type: "main",
        exercises: [
          { name: "KB Row", reps: 10, sets: 4 },
          { name: "KB Floor Press", reps: 8, sets: 4 }
        ]
      }
    ]
  },
  {
    title: "Recovery & Breath",
    durationMinutes: 10,
    difficulty: 1,
    focusTags: "mobility,recovery",
    format: "Flow",
    blocks: [
      {
        type: "main",
        exercises: [
          { name: "Deep Squat Hold", reps: "60s" },
          { name: "Breathing Drill", reps: 5 }
        ]
      }
    ]
  },
  {
    title: "KB Complex Lite",
    durationMinutes: 15,
    difficulty: 3,
    focusTags: "conditioning,full_body",
    format: "Complex",
    blocks: [
      {
        type: "main",
        exercises: [
          { name: "KB Deadlift", reps: 5 },
          { name: "KB Clean", reps: 5 },
          { name: "KB Press", reps: 5 }
        ]
      }
    ]
  }
];
