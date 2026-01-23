<script setup>
// pages/stats.vue
import { db } from '~/services/database';

const stats = ref(null);
const pending = ref(true);

// Helper for "Days Ago" logic
function getDaysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate();
}

onMounted(async () => {
  const [sessions, feedback] = await Promise.all([
    db.sessions.where('status').equals('completed').reverse().toArray(),
    db.feedback.toArray()
  ]);

  const totalSessions = sessions.length;
  const totalDuration = sessions.reduce((acc, s) => acc + (s.durationSeconds || 0), 0);
  
  // Group by date (YYYY-MM-DD) for heatmap
  const heatmap = {};
  sessions.forEach(s => {
    if (s.completedAt) {
      const date = new Date(s.completedAt).toISOString().split('T')[0];
      if (!heatmap[date]) heatmap[date] = [];
      
      // Attach feedback to session
      const f = feedback.find(fb => fb.sessionId === s.id);
      heatmap[date].push({ ...s, feedback: f });
    }
  });

  stats.value = {
    totalSessions,
    totalDuration,
    heatmap
  };
  pending.value = false;
});

// Calendar Logic (Current Month)
const today = new Date();
const currentMonth = ref(today.getMonth());
const currentYear = ref(today.getFullYear());

const calendarDays = computed(() => {
  const days = [];
  const daysInMonth = getDaysInMonth(currentYear.value, currentMonth.value);
  const firstDay = new Date(currentYear.value, currentMonth.value, 1).getDay(); // 0 = Sun
  
  // Pad empty days at start (Monday start fix: if 0 (Sun) -> 6, else diff-1)
  const offset = firstDay === 0 ? 6 : firstDay - 1; 

  for (let i = 0; i < offset; i++) {
    days.push({ day: '', date: null });
  }

  for (let i = 1; i <= daysInMonth; i++) {
    const dateStr = `${currentYear.value}-${String(currentMonth.value + 1).padStart(2,'0')}-${String(i).padStart(2,'0')}`;
    const sessions = stats.value?.heatmap[dateStr] || [];
    
    // Calculate average intensity for the day
    let avgIntensity = 0;
    if (sessions.length > 0) {
      const sum = sessions.reduce((acc, s) => acc + (s.feedback?.difficulty || 3), 0);
      avgIntensity = sum / sessions.length;
    }

    days.push({
      day: i,
      date: dateStr,
      hasSession: sessions.length > 0,
      count: sessions.length,
      intensity: avgIntensity,
      sessions: sessions
    });
  }
  return days;
});

// Modal Logic
const selectedDay = ref(null);
const showModal = ref(false);

function openDayDetails(day) {
  if (day.hasSession) {
    selectedDay.value = day;
    showModal.value = true;
  }
}

const { getWorkouts } = useData();
const workouts = ref([]);
onMounted(async () => {
  workouts.value = await getWorkouts();
});

function getWorkoutTitle(id) {
  return workouts.value.find(w => w.id === id)?.title || 'Unknown Workout';
}

const monthName = computed(() => {
  return new Date(currentYear.value, currentMonth.value).toLocaleString('default', { month: 'long', year: 'numeric' });
});

function formatDuration(seconds) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  if (h > 0) return `${h}h ${m}m`;
  if (m > 0) return `${m}m ${s}s`;
  return `${s}s`;
}
</script>

<template>
  <div class="p-6 max-w-4xl mx-auto pb-32 min-h-screen">
    <header class="mb-10 flex items-start justify-between">
      <div class="flex flex-col gap-1">
        <h1 class="text-4xl font-black italic uppercase tracking-tighter">Performance</h1>
        <p class="text-orange-500 font-black uppercase text-[10px] tracking-widest -mt-1">History & Analytics</p>
      </div>
      <img src="/pwa-512x512.png" alt="Logo" class="h-16 w-16 object-contain grayscale-[0.2] brightness-125" />
    </header>

    <div v-if="pending" class="flex items-center justify-center py-20">
      <div class="h-12 w-12 border-4 border-orange-500/20 border-t-orange-500 rounded-full animate-spin"></div>
    </div>

    <div v-else class="flex flex-col gap-10">
      
      <!-- Top Stats Cards -->
      <div class="grid grid-cols-2 gap-4">
        <div class="bg-zinc-900 border border-zinc-800 p-6 rounded-[2rem] flex flex-col items-center justify-center gap-2">
          <span class="text-[10px] font-black uppercase tracking-widest text-zinc-500">Total Workouts</span>
          <span class="text-5xl font-black italic tracking-tighter text-white">{{ stats.totalSessions }}</span>
        </div>
        <div class="bg-zinc-900 border border-zinc-800 p-6 rounded-[2rem] flex flex-col items-center justify-center gap-2">
          <span class="text-[10px] font-black uppercase tracking-widest text-zinc-500">Volume (Time)</span>
          <span class="text-5xl font-black italic tracking-tighter text-orange-500">{{ formatDuration(stats.totalDuration) }}</span>
        </div>
      </div>

      <!-- Calendar Heatmap -->
      <section class="flex flex-col gap-6">
         <div class="flex justify-between items-end">
           <h2 class="text-xl font-black uppercase italic tracking-tighter">Consistency Log</h2>
           <span class="text-xs font-bold text-zinc-500 uppercase">{{ monthName }}</span>
         </div>
         
         <div class="bg-zinc-950 border border-zinc-800 p-6 rounded-[2.5rem]">
           <!-- Weekday Headers -->
           <div class="grid grid-cols-7 gap-2 mb-4 text-center">
             <span v-for="d in ['M','T','W','T','F','S','S']" :key="d" class="text-[10px] font-black uppercase text-zinc-600">{{ d }}</span>
           </div>
           
           <!-- Days Grid -->
           <div class="grid grid-cols-7 gap-2">
             <div 
               v-for="(day, idx) in calendarDays" 
               :key="idx"
               class="aspect-square rounded-xl flex items-center justify-center text-xs font-bold relative group"
               :class="day.hasSession ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/20' : (day.day ? 'bg-zinc-900 text-zinc-700' : 'bg-transparent')"
             >
               {{ day.day }}
               <div v-if="day.hasSession" class="absolute -bottom-1 -right-1 h-4 w-4 bg-white text-orange-500 rounded-full flex items-center justify-center text-[8px] border border-orange-500 font-black z-10">
                 {{ day.count }}
               </div>
             </div>
           </div>
         </div>
      </section>

      <!-- Placeholder for Charts (Phase 2 enhancement) -->
      <div class="bg-zinc-900/50 border border-zinc-800/50 p-8 rounded-3xl text-center">
        <p class="text-[10px] font-black uppercase text-zinc-600 tracking-widest">More analytics coming soon...</p>
      </div>

    </div>
  </div>
</template>
