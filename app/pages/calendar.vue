<script setup>
// pages/calendar.vue
const { getCurrentProgram } = useData();

const program = ref(null);
const pending = ref(true);

onMounted(async () => {
  program.value = await getCurrentProgram();
  pending.value = false;
});

function getSessionsByWeek(week) {
  if (!program.value || !program.value.sessions) return [];
  // Correct week index (1-based)
  return program.value.sessions.filter(s => s.weekIndex === week);
}

function getWeeks() {
  if (!program.value) return 0;
  return program.value.weeks;
}
</script>

<template>
  <div class="p-6 max-w-2xl mx-auto pb-32">
    <header class="mb-10 flex items-start justify-between">
      <div class="flex flex-col gap-1">
        <h1 class="text-4xl font-black italic uppercase tracking-tighter">Plan Overview</h1>
        <p v-if="program" class="text-orange-500 font-black uppercase text-[10px] tracking-widest -mt-1">{{ program.name }}</p>
        <NuxtLink v-if="program" to="/wizard" class="text-[10px] font-bold text-zinc-500 hover:text-orange-500 transition-colors uppercase tracking-widest mt-2 flex items-center gap-2">
          <div class="h-3 w-3 icon-mask i-lucide-plus-circle"></div>
          Start New Program
        </NuxtLink>
      </div>
      <img src="/pwa-512x512.png" alt="IronHabit Logo" class="h-16 w-16 object-contain grayscale-[0.2] brightness-125 -mt-2" />
    </header>

    <div v-if="pending" class="flex items-center justify-center py-20">
      <div class="h-12 w-12 border-4 border-orange-500/20 border-t-orange-500 rounded-full animate-spin"></div>
    </div>

    <div v-else-if="!program" class="glass-card text-center p-12 flex flex-col items-center gap-4">
      <div class="h-16 w-16 bg-zinc-900 rounded-full flex items-center justify-center">
         <div class="h-8 w-8 icon-mask i-lucide-calendar text-zinc-700"></div>
      </div>
      <p class="italic text-zinc-500 font-medium text-lg">No active program found</p>
      <p class="text-zinc-600 text-sm -mt-2">Start your journey by creating a tailored plan.</p>
      <NuxtLink to="/wizard" class="text-orange-500 font-black uppercase text-xs border-b border-orange-500/30 pb-1">Enter Wizard</NuxtLink>
    </div>

    <div v-else class="flex flex-col gap-12">
      <div v-for="w in getWeeks()" :key="w" class="flex flex-col gap-6">
        <h2 class="text-xl font-black uppercase tracking-tighter text-white flex items-center gap-4 italic">
          Week {{ w }}
          <div class="h-[2px] flex-1 bg-gradient-to-r from-zinc-800 to-transparent"></div>
        </h2>
        
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <NuxtLink 
            v-for="session in getSessionsByWeek(w)" 
            :key="session.id"
            :to="session.status === 'completed' ? '#' : '/session/' + session.id"
            class="aspect-square rounded-3xl border-2 transition-all active:scale-[0.92] flex flex-col p-4 relative overflow-hidden group shadow-lg"
            :class="session.status === 'completed' 
              ? 'bg-zinc-900 border-zinc-900/50 grayscale' 
              : 'bg-zinc-900 border-zinc-800 hover:border-orange-500 hover:shadow-orange-500/10'"
          >
            <!-- Background Accent -->
            <div v-if="session.status !== 'completed'" class="absolute -right-4 -bottom-4 h-16 w-16 bg-orange-500/5 rounded-full blur-2xl group-hover:bg-orange-500/10 transition-colors"></div>

            <div class="relative z-10 flex-1 flex flex-col justify-between">
              <div class="flex justify-between items-start">
                 <span class="text-xs font-black italic text-zinc-600">D{{ session.dayIndex }}</span>
                 <div v-if="session.status === 'completed'" class="h-4 w-4 icon-mask i-lucide-check-circle text-green-500"></div>
                 <div v-else class="h-2 w-2 rounded-full bg-orange-500 animate-pulse"></div>
              </div>
              
              <div class="flex flex-col">
                <div 
                   class="h-8 w-8 mb-2"
                   :class="session.status === 'completed' ? 'text-zinc-700' : 'text-orange-500'"
                >
                  <div v-if="session.sessionType === 'Strength'" class="h-full w-full icon-mask i-lucide-dumbbell"></div>
                  <div v-else-if="session.sessionType === 'Conditioning'" class="h-full w-full icon-mask i-lucide-zap"></div>
                  <div v-else class="h-full w-full icon-mask i-lucide-wind"></div>
                </div>
                <h3 class="text-[10px] font-black uppercase tracking-tighter leading-none" :class="session.status === 'completed' ? 'text-zinc-600' : 'text-zinc-300'">
                  {{ session.sessionType }}
                </h3>
              </div>
            </div>
          </NuxtLink>
        </div>
      </div>
    </div>

    <div class="h-10"></div>
  </div>
</template>

<style scoped>
</style>
