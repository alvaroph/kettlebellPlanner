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
const kettlebellFilter = ref('all');
const expandedWorkoutId = ref(null);
const expandedCategories = ref(new Set());

// By default, expand all if there is a search query
const filteredWorkouts = computed(() => {
  if (!workouts.value) return [];
  
  let result = workouts.value;
  
  // Search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    result = result.filter(w => 
      w.title.toLowerCase().includes(query) || 
      (w.focusTags && (Array.isArray(w.focusTags) ? w.focusTags : w.focusTags.split(',')).some(t => t.toLowerCase().includes(query)))
    );
  }
  
  // Kettlebell type filter
  if (kettlebellFilter.value !== 'all') {
    result = result.filter(w => w.kettlebells === kettlebellFilter.value);
  }
  
  return result;
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

// Auto-expand categories when searching
watch(searchQuery, (newVal) => {
  if (newVal) {
    Object.keys(groupedWorkouts.value).forEach(tag => expandedCategories.value.add(tag));
  }
}, { immediate: true });

function toggleCategory(tag) {
  if (expandedCategories.value.has(tag)) {
    expandedCategories.value.delete(tag);
  } else {
    expandedCategories.value.add(tag);
  }
}

function toggleExpand(id) {
  expandedWorkoutId.value = expandedWorkoutId.value === id ? null : id;
}

function getTags(w) {
  const tags = Array.isArray(w.focusTags) ? w.focusTags : w.focusTags.split(',');
  return tags.filter(t => t.trim() !== "");
}

function isCategoryExpanded(tag) {
  return expandedCategories.value.has(tag);
}
</script>

<template>
  <div class="p-6 max-w-4xl mx-auto pb-32 min-h-screen">
    <header class="mb-10 flex items-start justify-between">
      <div class="flex flex-col gap-1">
        <h1 class="text-4xl font-black italic uppercase tracking-tighter">Discovery</h1>
        <p class="text-orange-500 font-black uppercase text-[10px] tracking-widest -mt-1">Workout Library & History</p>
        <NuxtLink to="/admin/library" class="text-[10px] font-bold text-zinc-500 hover:text-orange-500 transition-colors uppercase tracking-widest mt-2 flex items-center gap-2">
          <div class="h-3 w-3 icon-mask i-lucide-plus-square"></div>
          Import Workouts
        </NuxtLink>
      </div>
      <img src="/pwa-512x512.png" alt="IronHabit Logo" class="h-16 w-16 object-contain grayscale-[0.2] brightness-125" />
    </header>

    <!-- Search Bar -->
    <div class="mb-10">
      <div class="relative group">
        <div class="absolute inset-y-0 left-5 flex items-center pointer-events-none text-zinc-500 group-focus-within:text-orange-500 transition-colors">
          <div class="h-5 w-5 icon-mask i-lucide-search"></div>
        </div>
        <input 
          v-model="searchQuery"
          type="text" 
          placeholder="Filter by title or tag (e.g. legs, strength)..." 
          class="w-full bg-zinc-900/50 border border-zinc-800 rounded-3xl py-5 pl-14 pr-6 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all font-bold placeholder:text-zinc-600 shadow-xl"
        />
      </div>
      
      <!-- Kettlebell Filter -->
      <div class="flex items-center gap-2 mt-4">
        <button 
          v-for="filter in ['all', 'single', 'double']" 
          :key="filter"
          @click="kettlebellFilter = filter"
          class="px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all border"
          :class="kettlebellFilter === filter 
            ? 'bg-orange-500 border-orange-500 text-white shadow-lg shadow-orange-500/20' 
            : 'bg-zinc-900/50 border-zinc-800 text-zinc-500 hover:border-zinc-700'"
        >
          {{ filter }}
        </button>
      </div>
    </div>

    <div v-if="pending" class="flex items-center justify-center py-20">
      <div class="h-12 w-12 border-4 border-orange-500/20 border-t-orange-500 rounded-full animate-spin"></div>
    </div>

    <div v-else class="flex flex-col gap-10">
      <div v-for="(list, tag) in groupedWorkouts" :key="tag" class="flex flex-col gap-6">
        <h2 
          class="text-xl font-black uppercase tracking-tighter text-white flex items-center gap-4 italic cursor-pointer select-none group"
          @click="toggleCategory(tag)"
        >
          <span :class="isCategoryExpanded(tag) ? 'text-orange-500' : 'text-zinc-500'" class="transition-colors">{{ tag }}</span>
          <div class="h-[2px] flex-1 bg-gradient-to-r from-zinc-800 to-transparent"></div>
          <div class="flex items-center gap-3">
            <span class="text-[10px] font-black text-zinc-700 bg-zinc-900 px-3 py-1 rounded-full group-hover:text-zinc-400 transition-colors">{{ list.length }} Sessions</span>
            <div 
              class="h-5 w-5 icon-mask i-lucide-chevron-right transition-transform duration-300"
              :class="isCategoryExpanded(tag) ? 'rotate-90 text-orange-500' : 'text-zinc-700'"
            ></div>
          </div>
        </h2>

        <div v-if="isCategoryExpanded(tag)" class="grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-2 duration-300">
          <div 
            v-for="workout in list" 
            :key="workout.id"
            class="glass-card flex flex-col gap-4 cursor-pointer transition-all duration-300 relative overflow-hidden"
            :class="expandedWorkoutId === workout.id ? 'ring-2 ring-orange-500 shadow-2xl shadow-orange-500/10' : 'hover:border-zinc-700'"
            @click="toggleExpand(workout.id)"
          >
            <!-- Completion Badge -->
            <div v-if="workout.isCompleted" class="absolute top-0 right-0 py-1 px-4 bg-green-500/10 border-b border-l border-green-500/20 rounded-bl-2xl flex items-center gap-2">
              <div class="h-3 w-3 icon-mask i-lucide-check-circle text-green-500"></div>
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
                <div class="flex items-center gap-1.5"><div class="h-3 w-3 icon-mask i-lucide-clock"></div>{{ workout.durationMinutes }} Min</div>
                <div class="flex items-center gap-1.5"><div class="h-3 w-3 icon-mask i-lucide-activity"></div>Lvl {{ workout.difficulty }}</div>
                <div class="flex items-center gap-1.5"><div class="h-3 w-3 icon-mask i-lucide-award"></div>{{ workout.format }}</div>
                
                <!-- Kettlebell Type Icon -->
                <div v-if="workout.kettlebells" class="flex items-center gap-1 bg-zinc-900/50 px-2 py-1 rounded-lg border border-zinc-800/50 ml-auto">
                   <div v-if="workout.kettlebells === 'single'" class="h-3 w-3 icon-mask i-lucide-dumbbell bg-zinc-500"></div>
                   <div v-else class="flex items-center -space-x-1">
                      <div class="h-3 w-3 icon-mask i-lucide-dumbbell bg-orange-500"></div>
                      <div class="h-3 w-3 icon-mask i-lucide-dumbbell bg-orange-500 scale-90 opacity-80"></div>
                   </div>
                   <span class="text-[8px] italic" :class="workout.kettlebells === 'single' ? 'text-zinc-500' : 'text-orange-500'">{{ workout.kettlebells }}</span>
                </div>
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
                       <div class="flex gap-1">
                         <div v-for="star in 5" :key="star" class="h-3 w-3 icon-mask" :class="star <= f.rating ? 'i-lucide-star bg-orange-500' : 'i-lucide-star bg-zinc-800'"></div>
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
</style>
