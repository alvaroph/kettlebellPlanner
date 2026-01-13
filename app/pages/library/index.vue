<script setup>
// pages/library/index.vue
const { getWorkouts } = useData();

const workouts = ref([]);
const pending = ref(true);

onMounted(async () => {
  workouts.value = await getWorkouts();
  pending.value = false;
});

const searchQuery = ref('');
const expandedWorkoutId = ref(null);

const filteredWorkouts = computed(() => {
  if (!workouts.value) return [];
  if (!searchQuery.value) return workouts.value;
  
  const query = searchQuery.value.toLowerCase();
  return workouts.value.filter(w => 
    w.title.toLowerCase().includes(query) || 
    (w.focusTags && (Array.isArray(w.focusTags) ? w.focusTags : w.focusTags.split(',')).some(t => t.toLowerCase().includes(query)))
  );
});

const groupedWorkouts = computed(() => {
  const groups = {};
  filteredWorkouts.value.forEach(w => {
    const tags = Array.isArray(w.focusTags) ? w.focusTags : w.focusTags.split(',');
    const primaryTag = tags[0] || 'General';
    if (!groups[primaryTag]) groups[primaryTag] = [];
    groups[primaryTag].push(w);
  });
  return groups;
});

function toggleExpand(id) {
  expandedWorkoutId.value = expandedWorkoutId.value === id ? null : id;
}

function getTags(w) {
  return Array.isArray(w.focusTags) ? w.focusTags : w.focusTags.split(',');
}
</script>

<template>
  <div class="p-6 max-w-4xl mx-auto pb-32 min-h-screen">
    <header class="mb-10 flex flex-col gap-1">
      <h1 class="text-4xl font-black italic uppercase tracking-tighter">Discovery</h1>
      <p class="text-orange-500 font-black uppercase text-[10px] tracking-widest -mt-1">Workout Library & History</p>
    </header>

    <!-- Search Bar -->
    <div class="mb-10">
      <div class="relative group">
        <div class="absolute inset-y-0 left-5 flex items-center pointer-events-none text-zinc-500 group-focus-within:text-orange-500 transition-colors">
          <div class="h-5 w-5 i-lucide-search"></div>
        </div>
        <input 
          v-model="searchQuery"
          type="text" 
          placeholder="Filter by title or tag (e.g. legs, strength)..." 
          class="w-full bg-zinc-900/50 border border-zinc-800 rounded-3xl py-5 pl-14 pr-6 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all font-bold placeholder:text-zinc-600 shadow-xl"
        />
      </div>
    </div>

    <div v-if="pending" class="flex items-center justify-center py-20">
      <div class="h-12 w-12 border-4 border-orange-500/20 border-t-orange-500 rounded-full animate-spin"></div>
    </div>

    <div v-else class="flex flex-col gap-12">
      <div v-for="(list, tag) in groupedWorkouts" :key="tag" class="flex flex-col gap-6">
        <h2 class="text-xl font-black uppercase tracking-tighter text-white flex items-center gap-4 italic">
          {{ tag }}
          <div class="h-[2px] flex-1 bg-gradient-to-r from-zinc-800 to-transparent"></div>
          <span class="text-[10px] font-black text-zinc-700 bg-zinc-900 px-3 py-1 rounded-full">{{ list.length }} Sessions</span>
        </h2>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div 
            v-for="workout in list" 
            :key="workout.id"
            class="glass-card flex flex-col gap-4 cursor-pointer transition-all duration-300 relative overflow-hidden"
            :class="expandedWorkoutId === workout.id ? 'ring-2 ring-orange-500 shadow-2xl shadow-orange-500/10' : 'hover:border-zinc-700'"
            @click="toggleExpand(workout.id)"
          >
            <!-- Completion Badge -->
            <div v-if="workout.isCompleted" class="absolute top-0 right-0 py-1 px-4 bg-green-500/10 border-b border-l border-green-500/20 rounded-bl-2xl flex items-center gap-2">
              <div class="h-3 w-3 i-lucide-check-circle text-green-500"></div>
              <span class="text-[8px] font-black uppercase text-green-500">Completed (x{{ workout.timesCompleted }})</span>
            </div>

            <div class="flex flex-col gap-2">
              <div class="flex flex-col">
                <h3 class="text-xl font-black italic uppercase italic leading-tight mr-16">{{ workout.title }}</h3>
                <div class="flex flex-wrap gap-2 mt-2">
                  <span v-for="t in getTags(workout)" :key="t" class="text-[8px] font-black uppercase tracking-widest bg-zinc-950 px-2 py-0.5 rounded text-zinc-500 border border-zinc-800">{{ t }}</span>
                </div>
              </div>

              <div class="flex items-center gap-4 text-[10px] font-black uppercase text-zinc-600">
                <div class="flex items-center gap-1.5"><div class="h-3 w-3 i-lucide-clock"></div>{{ workout.durationMinutes }} Min</div>
                <div class="flex items-center gap-1.5"><div class="h-3 w-3 i-lucide-activity"></div>Lvl {{ workout.difficulty }}</div>
                <div class="flex items-center gap-1.5"><div class="h-3 w-3 i-lucide-award"></div>{{ workout.format }}</div>
              </div>
            </div>

            <!-- Expandable History & Details -->
            <div v-if="expandedWorkoutId === workout.id" class="animate-in slide-in-from-top-2 duration-300 pt-4 border-t border-zinc-800/50 flex flex-col gap-6">
              <!-- Workout Structure Summary -->
              <div class="flex flex-col gap-3">
                 <span class="text-[10px] font-black uppercase text-orange-500 tracking-widest">Structure Preview</span>
                 <div class="bg-zinc-950 p-4 rounded-2xl flex flex-col gap-3">
                    <div v-for="(block, idx) in workout.blocks" :key="idx" class="flex flex-col gap-1">
                      <span class="text-[9px] font-black uppercase text-zinc-700">{{ block.type }}</span>
                      <p class="text-[10px] text-zinc-400 font-bold leading-relaxed">
                        {{ block.exercises.map(e => `${e.name} (${e.reps})`).join(', ') }}
                      </p>
                    </div>
                 </div>
              </div>

              <!-- Feedback History -->
              <div v-if="workout.feedbacks.length > 0" class="flex flex-col gap-3">
                <span class="text-[10px] font-black uppercase text-orange-500 tracking-widest">Your Intelligence</span>
                <div class="flex flex-col gap-2">
                  <div v-for="(f, fIdx) in workout.feedbacks" :key="fIdx" class="bg-zinc-950/50 border border-zinc-800/50 p-4 rounded-2xl flex flex-col gap-2 relative">
                    <div class="flex justify-between items-center">
                       <div class="flex gap-1 text-orange-500">
                         <div v-for="star in 5" :key="star" class="h-3 w-3" :class="star <= f.rating ? 'i-lucide-star-filled' : 'i-lucide-star'"></div>
                       </div>
                       <span class="text-[8px] font-black text-zinc-600 uppercase">{{ new Date(f.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) }}</span>
                    </div>
                    <p v-if="f.notes" class="text-xs italic text-zinc-400 font-medium">"{{ f.notes }}"</p>
                    <div class="flex gap-2">
                      <span class="text-[8px] font-black uppercase px-2 py-0.5 bg-zinc-800 rounded text-zinc-500">Effort: {{ f.effort }}</span>
                    </div>
                  </div>
                </div>
              </div>
              <p v-else class="text-[10px] font-black uppercase text-zinc-700 italic text-center py-4 bg-zinc-950/30 rounded-2xl">No personal logs yet. Train to unlock insights.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.i-lucide-search { content: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Ccircle cx='11' cy='11' r='8'/%3E%3Cpath d='m21 21-4.3-4.3'/%3E%3C/svg%3E"); }
.i-lucide-clock { content: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Ccircle cx='12' cy='12' r='10'/%3E%3Cpolyline points='12 6 12 12 16 14'/%3E%3C/svg%3E"); }
.i-lucide-activity { content: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M22 12h-4l-3 9L9 3l-3 9H2'/%3E%3C/svg%3E"); }
.i-lucide-award { content: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m15.477 12.89 1.515 8.526a.5.5 0 0 1-.81.47l-3.58-2.687a1 1 0 0 0-1.197 0l-3.586 2.686a.5.5 0 0 1-.81-.469l1.514-8.526'/%3E%3Ccircle cx='12' cy='8' r='6'/%3E%3C/svg%3E"); }
.i-lucide-check-circle { content: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%2322c55e' stroke-width='3' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M22 11.08V12a10 10 0 1 1-5.93-9.14'/%3E%3Cpolyline points='22 4 12 14.01 9 11.01'/%3E%3C/svg%3E"); }
.i-lucide-star-filled { content: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='%23f97316' stroke='%23f97316' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolygon points='12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2'/%3E%3C/svg%3E"); }
.i-lucide-star { content: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolygon points='12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2'/%3E%3C/svg%3E"); }
</style>
