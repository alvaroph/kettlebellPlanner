<script setup>
// pages/calendar.vue
const { getCurrentProgram, getPrograms, switchProgram, deleteProgram } = useData();

const currentProgram = ref(null);
const allPrograms = ref([]);
const pending = ref(true);
const showPlanList = ref(false);

const loadData = async () => {
  pending.value = true;
  currentProgram.value = await getCurrentProgram();
  allPrograms.value = await getPrograms();
  pending.value = false;
};

onMounted(loadData);

async function handleSwitch(id) {
  if (confirm('Switching to this plan will make it your active focus.')) {
    await switchProgram(id);
    await loadData();
    showPlanList.value = false;
  }
}

async function handleDelete(id, isCurrent = false) {
  if (confirm('Are you sure you want to delete this plan? History will remain, but future schedule is gone.')) {
    await deleteProgram(id);
    await loadData();
  }
}

function getSessionsByWeek(week) {
  if (!currentProgram.value || !currentProgram.value.sessions) return [];
  return currentProgram.value.sessions.filter(s => s.weekIndex === week);
}

function getWeeks() {
  if (!currentProgram.value) return 0;
  return currentProgram.value.weeks;
}
</script>

<template>
  <div class="p-6 max-w-2xl mx-auto pb-32">
    <header class="mb-10 flex items-start justify-between relative z-20">
      <div class="flex flex-col gap-1">
        <h1 class="text-4xl font-black italic uppercase tracking-tighter cursor-pointer flex items-center gap-2" @click="showPlanList = !showPlanList">
          Plan Overview
          <div class="h-6 w-6 icon-mask i-lucide-chevron-right transition-transform" :class="showPlanList ? 'rotate-90' : ''"></div>
        </h1>
        
        <!-- Active Plan Meta -->
        <div v-if="currentProgram" class="flex flex-col gap-3 animate-in fade-in slide-in-from-left-4 duration-500">
          <p class="text-orange-500 font-black uppercase text-[10px] tracking-widest -mt-1">{{ currentProgram.name }}</p>
          <div class="flex items-center gap-4">
             <button @click="showPlanList = !showPlanList" class="text-[10px] font-bold text-zinc-500 hover:text-white transition-colors uppercase tracking-widest flex items-center gap-2">
              <div class="h-3 w-3 icon-mask i-lucide-book-open"></div>
              My Plans ({{ allPrograms.length }})
            </button>
             <button @click="handleDelete(currentProgram.id, true)" class="text-[10px] font-bold text-red-500/60 hover:text-red-500 transition-colors uppercase tracking-widest flex items-center gap-2">
              <div class="h-3 w-3 icon-mask i-lucide-trash text-current"></div>
              Delete
            </button>
          </div>
        </div>
        
        <!-- No Active Plan Meta -->
        <div v-else class="flex flex-col gap-3">
           <p class="text-zinc-500 font-black uppercase text-[10px] tracking-widest -mt-1">No Active Focus</p>
           <NuxtLink to="/wizard" class="text-[10px] font-bold text-orange-500 hover:text-orange-400 transition-colors uppercase tracking-widest flex items-center gap-2">
              <div class="h-3 w-3 icon-mask i-lucide-plus-circle"></div>
              Create New Plan
           </NuxtLink>
        </div>
      </div>
      <img src="/pwa-512x512.png" alt="Logo" class="h-16 w-16 object-contain grayscale-[0.2] brightness-125 -mt-2" />
      
      <!-- Plans Dropdown / Drawer -->
      <div v-if="showPlanList" class="absolute top-24 left-0 w-full bg-zinc-950 border border-zinc-800 rounded-3xl p-6 shadow-2xl z-50 animate-in slide-in-from-top-4 duration-200">
        <div class="flex justify-between items-center mb-6">
           <span class="text-xs font-black uppercase tracking-widest text-zinc-500">Your Plans</span>
           <NuxtLink to="/wizard" class="text-xs font-black uppercase text-orange-500 hover:underline">+ New</NuxtLink>
        </div>
        <div class="flex flex-col gap-3 max-h-64 overflow-y-auto">
           <div v-for="p in allPrograms" :key="p.id" class="flex items-center justify-between p-4 rounded-2xl border" :class="p.active ? 'border-orange-500/50 bg-orange-500/10' : 'border-zinc-800 bg-zinc-900'">
              <div class="flex flex-col cursor-pointer flex-1" @click="handleSwitch(p.id)">
                 <span class="font-black italic uppercase text-sm" :class="p.active ? 'text-orange-500' : 'text-gray-300'">{{ p.name }}</span>
                 <span class="text-[10px] font-bold text-zinc-600">{{ p.weeks }} Weeks // {{ p.goal }}</span>
              </div>
              <button v-if="!p.active" @click="handleDelete(p.id)" class="p-2 text-zinc-600 hover:text-red-500 transition-colors">
                 <div class="h-4 w-4 icon-mask i-lucide-trash"></div>
              </button>
              <div v-else class="px-2 py-1 bg-orange-500 text-white text-[8px] font-black uppercase rounded">Active</div>
           </div>
        </div>
      </div>
    </header>

    <div v-if="pending" class="flex items-center justify-center py-20">
      <div class="h-12 w-12 border-4 border-orange-500/20 border-t-orange-500 rounded-full animate-spin"></div>
    </div>

    <div v-else-if="!currentProgram" class="glass-card text-center p-12 flex flex-col items-center gap-4 animate-in fade-in zoom-in-95 duration-500">
      <div class="h-16 w-16 bg-zinc-900 rounded-full flex items-center justify-center">
         <div class="h-8 w-8 icon-mask i-lucide-calendar text-zinc-700"></div>
      </div>
      <p class="italic text-zinc-500 font-medium text-lg">No active plan selected</p>
      <p class="text-zinc-600 text-sm -mt-2">Select one from the menu or start fresh.</p>
      <NuxtLink to="/wizard" class="text-orange-500 font-black uppercase text-xs border-b border-orange-500/30 pb-1">Create New Plan</NuxtLink>
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
              ? 'bg-zinc-900 border-zinc-900/50 opacity-80' 
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
