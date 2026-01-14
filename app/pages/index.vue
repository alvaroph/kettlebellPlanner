<script setup>
// pages/index.vue
import { syncLibrary } from '~/utils/seeder';
const { getCurrentProgram, deleteCurrentProgram } = useData();

const program = ref(null);
const pending = ref(true);

const loadData = async () => {
  pending.value = true;
  program.value = await getCurrentProgram();
  pending.value = false;
};

onMounted(() => {
  syncLibrary();
  loadData();
});

async function handleDelete() {
  if (confirm('Delete current program?')) {
    await deleteCurrentProgram();
    await loadData();
  }
}

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
      <img src="/pwa-512x512.png" alt="IronHabit Logo" class="h-32 w-32 object-contain grayscale-[0.2] brightness-125 mb-4 animate-pulse duration-[3000ms]" />
      <div>
        <h2 class="text-2xl font-bold mb-2">No active plan</h2>
        <p class="text-zinc-400">Design your next training program in seconds.</p>
      </div>
      <NuxtLink to="/wizard" class="btn-primary w-full text-center">
        Start Now
      </NuxtLink>
    </div>

    <div v-else class="flex flex-col gap-6">
      <header class="flex items-start justify-between">
        <div class="flex flex-col">
          <h2 class="text-sm font-bold text-orange-500 uppercase tracking-widest mb-1">Current Program</h2>
          <h1 class="text-3xl font-black italic uppercase tracking-tighter">{{ program.name }}</h1>
          <button @click="handleDelete" class="text-[10px] font-bold text-red-500/50 hover:text-red-500 transition-colors uppercase tracking-widest mt-2 flex items-center gap-2">
            <div class="h-3 w-3 icon-mask i-lucide-trash text-current"></div>
            Delete Plan
          </button>
        </div>
        <img src="/pwa-512x512.png" alt="IronHabit Logo" class="h-16 w-16 object-contain grayscale-[0.2] brightness-125 -mt-2" />
      </header>

      <!-- Progress Card -->
      <div class="glass-card flex flex-col gap-4">
        <div class="flex justify-between items-end">
          <div>
            <span class="text-4xl font-bold">{{ getCompletedCount() }}</span>
            <span class="text-zinc-500 text-lg"> / {{ program.sessions.length }}</span>
            <p class="text-xs text-zinc-400 mt-1 uppercase tracking-tighter">Sessions completed</p>
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
        <h3 class="text-sm font-bold text-zinc-500 uppercase">Next Session</h3>
        <NuxtLink 
          :to="'/session/' + getNextSession().id"
          class="bg-white text-zinc-950 p-6 rounded-2xl flex items-center justify-between group active:scale-[0.98] transition-all shadow-xl shadow-orange-500/10"
        >
          <div>
            <p class="text-xs font-bold uppercase opacity-60">Week {{ getNextSession().weekIndex }} · Day {{ getNextSession().dayIndex }}</p>
            <h4 class="text-xl font-black">{{ getNextSession().sessionType }}</h4>
          </div>
          <div class="h-10 w-10 bg-zinc-950 text-white rounded-full flex items-center justify-center group-hover:bg-orange-600 transition-colors">
            <div class="h-5 w-5 icon-mask i-lucide-play ml-1 text-white"></div>
          </div>
        </NuxtLink>
      </div>

      <!-- Stats Grid -->
      <div class="grid grid-cols-2 gap-4">
        <div class="bg-zinc-900 border border-zinc-800 p-4 rounded-xl">
          <p class="text-[10px] text-zinc-500 uppercase font-black mb-1">Duration</p>
          <p class="font-bold text-lg">{{ program.sessionDuration }} min</p>
        </div>
        <div class="bg-zinc-900 border border-zinc-800 p-4 rounded-xl">
          <p class="text-[10px] text-zinc-500 uppercase font-black mb-1">Intensity</p>
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
</style>
