<script setup>
// pages/index.vue
import { syncLibrary } from '~/utils/seeder';
const { getCurrentProgram } = useData();

const program = ref(null);
const pending = ref(true);

onMounted(async () => {
  // 1. Ensure local library is synced (non-blocking)
  syncLibrary();
  
  // 2. Load program data
  program.value = await getCurrentProgram();
  pending.value = false;
});

function getCompletedCount() {
  if (!program.value || !program.value.sessions) return 0;
  var count = 0;
  for (var i = 0; i < program.value.sessions.length; i++) {
    if (program.value.sessions[i].status === 'completed') {
      count++;
    }
  }
  return count;
}

function getNextSession() {
  if (!program.value || !program.value.sessions) return null;
  for (var i = 0; i < program.value.sessions.length; i++) {
    if (program.value.sessions[i].status === 'pending') {
      return program.value.sessions[i];
    }
  }
  return null;
}
</script>

<template>
  <div class="p-6 max-w-md mx-auto">
    <div v-if="pending" class="flex items-center justify-center h-64">
      <div class="h-8 w-8 border-4 border-orange-500/30 border-t-orange-500 rounded-full animate-spin"></div>
    </div>

    <div v-else-if="!program" class="h-full flex flex-col items-center justify-center py-20 text-center gap-6">
      <div class="h-24 w-24 bg-zinc-900 rounded-full flex items-center justify-center border border-zinc-800">
        <div class="h-10 w-10 i-lucide-dumbbell text-zinc-700"></div>
      </div>
      <div>
        <h2 class="text-2xl font-bold mb-2">Sin plan activo</h2>
        <p class="text-zinc-400">Diseña tu próximo programa de entrenamiento en segundos.</p>
      </div>
      <NuxtLink to="/wizard" class="btn-primary w-full text-center">
        Empezar ahora
      </NuxtLink>
    </div>

    <div v-else class="flex flex-col gap-6">
      <header>
        <h2 class="text-sm font-bold text-orange-500 uppercase tracking-widest mb-1">Programa Actual</h2>
        <h1 class="text-3xl font-bold">{{ program.name }}</h1>
      </header>

      <!-- Progress Card -->
      <div class="glass-card flex flex-col gap-4">
        <div class="flex justify-between items-end">
          <div>
            <span class="text-4xl font-bold">{{ getCompletedCount() }}</span>
            <span class="text-zinc-500 text-lg"> / {{ program.sessions.length }}</span>
            <p class="text-xs text-zinc-400 mt-1 uppercase tracking-tighter">Sesiones completadas</p>
          </div>
          <div class="text-right">
            <span class="text-xl font-bold text-orange-400">{{ Math.round((getCompletedCount() / program.sessions.length) * 100) }}%</span>
          </div>
        </div>
        <div class="h-2 bg-zinc-800 rounded-full overflow-hidden">
          <div 
            class="h-full bg-orange-500 transition-all duration-1000" 
            :style="{ width: (getCompletedCount() / program.sessions.length) * 100 + '%' }"
          ></div>
        </div>
      </div>

      <!-- Quick Action: Next Session -->
      <div v-if="getNextSession()" class="flex flex-col gap-3">
        <h3 class="text-sm font-bold text-zinc-500 uppercase">Siguiente Sesión</h3>
        <NuxtLink 
          :to="'/session/' + getNextSession().id"
          class="bg-white text-zinc-950 p-6 rounded-2xl flex items-center justify-between group active:scale-[0.98] transition-all shadow-xl shadow-orange-500/10"
        >
          <div>
            <p class="text-xs font-bold uppercase opacity-60">Semana {{ getNextSession().weekIndex }} · Día {{ getNextSession().dayIndex }}</p>
            <h4 class="text-xl font-black">{{ getNextSession().sessionType }}</h4>
          </div>
          <div class="h-10 w-10 bg-zinc-950 text-white rounded-full flex items-center justify-center group-hover:bg-orange-600 transition-colors">
            <div class="h-5 w-5 i-lucide-play ml-1"></div>
          </div>
        </NuxtLink>
      </div>

      <!-- Stats Grid -->
      <div class="grid grid-cols-2 gap-4">
        <div class="bg-zinc-900 border border-zinc-800 p-4 rounded-xl">
          <p class="text-[10px] text-zinc-500 uppercase font-black mb-1">Duración</p>
          <p class="font-bold text-lg">{{ program.sessionDuration }} min</p>
        </div>
        <div class="bg-zinc-900 border border-zinc-800 p-4 rounded-xl">
          <p class="text-[10px] text-zinc-500 uppercase font-black mb-1">Intensidad</p>
          <div class="flex gap-1 mt-1">
            <div 
              v-for="i in 5" :key="i"
              class="h-1.5 w-4 rounded-full"
              :class="i <= program.intensity ? 'bg-orange-500' : 'bg-zinc-800'"
            ></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.i-lucide-dumbbell { content: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6.5 6.5 11 11'/%3E%3Cpath d='m10 10 5.5 5.5'/%3E%3Cpath d='m3 21 8-8'/%3E%3Cpath d='m9 15 3 3'/%3E%3Cpath d='M21 3l-8 8'/%3E%3Cpath d='m15 9 3 3'/%3E%3Cpath d='m3 7 4-4'/%3E%3Cpath d='m5 8 3-3'/%3E%3Cpath d='m17 21 4-4'/%3E%3Cpath d='m16 19 3-3'/%3E%3C/svg%3E"); }
.i-lucide-play { content: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolygon points='6 3 20 12 6 21 6 3'/%3E%3C/svg%3E"); }
</style>
