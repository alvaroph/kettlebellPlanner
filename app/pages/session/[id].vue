<script setup>
// pages/session/[id].vue
const route = useRoute();
const router = useRouter();
const sessionId = route.params.id;

const { getDailySession, completeSession: completeSessionRemote } = useData();

const sessionData = ref(null);
const pending = ref(true);

onMounted(async () => {
  sessionData.value = await getDailySession(sessionId);
  pending.value = false;
});

const selectedWorkout = ref(null);
const showFeedback = ref(false);
const expandedWorkoutId = ref(null);

const feedback = reactive({
  rating: 5,
  difficulty: 3,
  repeat: true,
  notes: ''
});

const timer = reactive({
  isRunning: false,
  elapsed: 0,
  interval: null,
  startTime: null
});

const formattedTime = computed(() => {
  const mins = Math.floor(timer.elapsed / 60).toString().padStart(2, '0');
  const secs = (timer.elapsed % 60).toString().padStart(2, '0');
  return `${mins}:${secs}`;
});

function toggleTimer() {
  if (timer.isRunning) {
    // Pause
    clearInterval(timer.interval);
    timer.isRunning = false;
  } else {
    // Start/Resume
    timer.isRunning = true;
    timer.interval = setInterval(() => {
      timer.elapsed++;
    }, 1000);
  }
}

function stopTimer() {
  if (timer.interval) clearInterval(timer.interval);
  timer.isRunning = false;
  showFeedback.value = true;
}

const isSubmitting = ref(false);

async function completeSession() {
  if (!selectedWorkout.value) return;
  isSubmitting.value = true;
  try {
    await completeSessionRemote({
      sessionId: sessionId,
      workoutId: selectedWorkout.value.id,
      durationSeconds: timer.elapsed,
      rating: feedback.rating,
      difficulty: feedback.difficulty || 3,
      repeatPreference: feedback.repeat,
      notes: feedback.notes
    });
    router.push('/');
  } catch (error) {
    console.error("Error completing session", error);
    alert("Error saving workout log");
  } finally {
    isSubmitting.value = false;
  }
}

function parseBlocks(blocks) {
  if (typeof blocks === 'string') return JSON.parse(blocks);
  return blocks;
}

function togglePreview(id) {
  if (expandedWorkoutId.value === id) {
    expandedWorkoutId.value = null;
  } else {
    expandedWorkoutId.value = id;
  }
}

const completedSets = reactive({});

function incrementSet(blockIdx, exIdx, targetSets) {
  const key = `${blockIdx}-${exIdx}`;
  if (!completedSets[key]) completedSets[key] = 0;
  
  if (targetSets && !isNaN(targetSets)) {
    if (completedSets[key] < targetSets) {
      completedSets[key]++;
    } else {
      completedSets[key] = 0; // Reset or leave as is? User said "contar", usually toggle or reset. 
    }
  } else {
    completedSets[key]++; // Indefinite for "max" or missing sets
  }
}

function getSetCount(blockIdx, exIdx) {
  return completedSets[`${blockIdx}-${exIdx}`] || 0;
}

function isExCompleted(blockIdx, exIdx, targetSets) {
  const count = getSetCount(blockIdx, exIdx);
  if (targetSets && !isNaN(targetSets)) {
    return count >= targetSets;
  }
  return count > 0;
}
</script>

<template>
  <div class="min-h-screen bg-zinc-950 text-white pb-32">
    <div v-if="pending" class="flex flex-col items-center justify-center h-screen gap-4">
      <div class="h-16 w-16 border-4 border-orange-500/20 border-t-orange-500 rounded-full animate-spin"></div>
      <p class="text-zinc-500 font-black uppercase text-xs tracking-widest">Optimizing Options...</p>
    </div>

    <div v-else-if="sessionData" class="max-w-md mx-auto p-6">
      
      <!-- Stage 1: Selection -->
      <div v-if="!selectedWorkout" class="animate-in fade-in slide-in-from-bottom-8 duration-500">
        <header class="mb-10 flex items-start justify-between">
          <div class="flex flex-col">
            <div class="flex items-center gap-2 text-orange-500 font-black uppercase text-[10px] tracking-widest mb-1">
              <span>Session Day {{ sessionData.session.dayIndex }}</span>
              <span class="h-1.5 w-1.5 rounded-full bg-zinc-800"></span>
              <span>Week {{ sessionData.session.weekIndex }}</span>
            </div>
            <h1 class="text-4xl font-black italic uppercase tracking-tighter">Choose Your Path</h1>
            <p class="text-zinc-500 text-sm mt-1">Pick one of these 3 tailored sessions.</p>
          </div>
          <img src="/pwa-512x512.png" alt="IronHabit Logo" class="h-16 w-16 object-contain grayscale-[0.2] brightness-125 -mt-2" />
        </header>

        <div class="flex flex-col gap-4">
          <div 
            v-for="workout in sessionData.recommendations" 
            :key="workout.id"
            class="flex flex-col bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden transition-all duration-300"
            :class="expandedWorkoutId === workout.id ? 'ring-2 ring-orange-500 scale-[1.02] shadow-2xl shadow-orange-500/10' : 'active:scale-95'"
          >
            <!-- Card Body -->
            <div @click="togglePreview(workout.id)" class="p-6 flex items-center justify-between cursor-pointer">
              <div class="flex items-center gap-4">
                <div class="h-12 w-12 bg-zinc-950 rounded-full flex items-center justify-center text-orange-500 border border-zinc-800">
                  <div class="h-6 w-6 icon-mask i-lucide-activity"></div>
                </div>
                <div>
                  <h3 class="font-black italic uppercase italic leading-tight">{{ workout.title }}</h3>
                  <div class="flex items-center gap-3 text-[10px] font-black uppercase text-zinc-600 mt-1">
                    <span>{{ workout.durationMinutes }} Min</span>
                    <span class="h-1 w-1 rounded-full bg-zinc-800"></span>
                    <span>LVL {{ workout.difficulty }}</span>
                  </div>
                </div>
              </div>
              <div class="h-8 w-8 rounded-full flex items-center justify-center transition-transform" :class="expandedWorkoutId === workout.id ? 'rotate-90 text-orange-500' : 'text-zinc-700'">
                <div class="h-5 w-5 icon-mask i-lucide-chevron-right"></div>
              </div>
            </div>

            <!-- Expandable Preview -->
            <div v-if="expandedWorkoutId === workout.id" class="px-6 pb-6 animate-in slide-in-from-top-2 duration-300">
               <div class="py-4 border-t border-zinc-800 flex flex-col gap-4">
                  <div v-for="(block, idx) in parseBlocks(workout.blocks)" :key="idx" class="flex flex-col gap-1">
                    <span class="text-[10px] font-black uppercase text-orange-500/60">{{ block.type }}</span>
                    <p class="text-xs text-zinc-400">
                       <span v-for="(ex, exIdx) in block.exercises" :key="exIdx">
                         {{ ex.name }} ({{ ex.reps }}){{ exIdx < block.exercises.length - 1 ? ', ' : '' }}
                       </span>
                    </p>
                  </div>
                  
                  <button 
                    @click.stop="selectedWorkout = workout" 
                    class="mt-4 h-12 bg-white text-zinc-950 rounded-xl font-black uppercase italic text-sm active:scale-95 transition-all w-full"
                  >
                    Select This Session
                  </button>
               </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Stage 2: Execution -->
      <div v-else-if="!showFeedback" class="animate-in zoom-in-95 duration-500">
        <header class="flex flex-col gap-6 mb-10 items-center text-center">
          <!-- Timer Display -->
          <div class="flex flex-col items-center gap-4">
             <div class="text-6xl font-black font-mono tracking-tighter tabular-nums" :class="timer.isRunning ? 'text-white' : 'text-zinc-600'">
               {{ formattedTime }}
             </div>
             <button 
               @click="toggleTimer"
               class="px-8 py-3 rounded-full font-black uppercase text-xs tracking-widest transition-all"
               :class="timer.isRunning 
                 ? 'bg-zinc-900 text-zinc-400 border border-zinc-700 hover:text-white hover:border-white' 
                 : 'bg-orange-600 text-white shadow-lg shadow-orange-500/20 hover:scale-105'"
             >
               {{ timer.isRunning ? 'Pause Timer' : (timer.elapsed > 0 ? 'Resume' : 'Start Workout') }}
             </button>
          </div>

          <div class="mt-4">
             <button v-if="timer.elapsed === 0" @click="selectedWorkout = null" class="text-[10px] font-black uppercase text-zinc-600 border border-zinc-800 px-4 py-2 rounded-full hover:text-white transition-colors">Change Session</button>
             <h1 class="text-4xl font-black italic uppercase tracking-tighter mt-4">{{ selectedWorkout.title }}</h1>
             <p class="text-zinc-500 font-bold uppercase text-xs tracking-widest mt-2">{{ selectedWorkout.format }} // {{ selectedWorkout.durationMinutes }} MINS</p>
          </div>
        </header>

        <!-- Workout Tips -->
        <div v-if="selectedWorkout.tips" class="bg-orange-500/10 border border-orange-500/20 p-6 rounded-3xl mb-10 flex gap-4 items-start animate-in slide-in-from-top-4 duration-700 relative overflow-hidden group">
           <!-- Decorative glow -->
           <div class="absolute -top-10 -right-10 h-32 w-32 bg-orange-500/10 blur-3xl group-hover:bg-orange-500/20 transition-all duration-1000"></div>

           <div class="h-8 w-8 bg-orange-500/20 rounded-full flex items-center justify-center shrink-0 border border-orange-500/30">
              <div class="h-4 w-4 icon-mask i-lucide-lightbulb text-orange-500"></div>
           </div>
           <div class="flex flex-col gap-1.5 relative z-10">
              <span class="text-[10px] font-black uppercase tracking-widest text-orange-500 italic">Coach Intelligence</span>
              <p class="text-sm italic text-zinc-200 font-medium leading-relaxed">"{{ selectedWorkout.tips }}"</p>
           </div>
        </div>

        <div class="flex flex-col gap-8">
          <section v-for="(block, idx) in parseBlocks(selectedWorkout.blocks)" :key="idx" class="flex flex-col gap-4">
            <h2 class="text-xs font-black uppercase tracking-[0.2em] text-orange-500 pl-2 border-l-4 border-orange-500 ml-1">{{ block.type }}</h2>
            
            <div class="flex flex-col gap-2">
              <div v-for="(ex, exIdx) in block.exercises" :key="exIdx" class="glass-card flex items-center justify-between group overflow-hidden relative">
                <div class="relative z-10">
                  <h4 class="font-black italic uppercase italic text-lg transition-colors" :class="isExCompleted(idx, exIdx, ex.sets) ? 'text-zinc-500' : ''">{{ ex.name }}</h4>
                  <p class="text-zinc-500 font-bold text-xs uppercase">{{ ex.reps }} <span v-if="ex.sets">x {{ ex.sets }} Sets</span></p>
                </div>
                <!-- Interactive visual: Set Clicker -->
                <div 
                  @click.stop="incrementSet(idx, exIdx, ex.sets)"
                  class="h-12 w-12 bg-zinc-950 rounded-2xl flex items-center justify-center transition-all duration-500 relative z-10 cursor-pointer select-none"
                  :class="isExCompleted(idx, exIdx, ex.sets) ? 'text-green-500 bg-green-500/10 border border-green-500/20 shadow-[0_0_20px_rgba(34,197,94,0.1)]' : 'text-zinc-700 border border-zinc-900 hover:border-zinc-700'"
                >
                   <div v-if="getSetCount(idx, exIdx) > 0" class="absolute -top-2 -right-2 bg-orange-600 text-white text-[10px] font-black h-5 w-5 rounded-full flex items-center justify-center shadow-lg border-2 border-zinc-950 animate-in zoom-in-50 duration-300">
                     {{ getSetCount(idx, exIdx) }}
                   </div>
                   <div class="h-6 w-6 icon-mask i-lucide-check-circle" :class="isExCompleted(idx, exIdx, ex.sets) ? 'bg-green-500' : 'bg-current'"></div>
                </div>
              </div>
            </div>
          </section>

          <button @click="stopTimer" class="btn-primary w-full mt-4 h-20 text-2xl shadow-2xl shadow-orange-500/20">
            FINISH SESSION
          </button>
        </div>
      </div>

      <!-- Stage 3: Feedback -->
      <div v-else class="animate-in fade-in duration-500 flex flex-col gap-8">
        <header class="text-center">
          <div class="h-20 w-20 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <div class="h-10 w-10 icon-mask i-lucide-check-circle scale-150"></div>
          </div>
          <h1 class="text-3xl font-black italic uppercase tracking-tighter">Mission Accomplished</h1>
          <p class="text-zinc-500 font-medium">How was the experience?</p>
        </header>

        <div class="flex flex-col gap-8">
          <!-- Difficulty -->
          <div class="flex flex-col gap-3">
            <label class="text-[10px] font-black uppercase tracking-widest text-zinc-500 text-center">Perceived Difficulty (RPE)</label>
            <div class="flex justify-between gap-2">
              <button 
                v-for="i in 5" 
                :key="i"
                @click="feedback.difficulty = i"
                class="h-14 flex-1 rounded-2xl font-black text-xl transition-all border-2"
                :class="feedback.difficulty === i 
                  ? 'bg-red-500/10 border-red-500 text-red-500 scale-105' 
                  : 'bg-zinc-900 border-zinc-800 text-zinc-600 hover:border-zinc-700'"
              >
                {{ i }}
              </button>
            </div>
            <div class="flex justify-between px-1 text-[10px] font-black uppercase text-zinc-700">
              <span>Easy</span>
              <span>Max Effort</span>
            </div>
          </div>

          <!-- Satisfaction Rating -->
          <div class="flex flex-col gap-3">
            <label class="text-[10px] font-black uppercase tracking-widest text-zinc-500 text-center">Satisfaction (Stars)</label>
            <div class="flex justify-center gap-4">
              <button 
                v-for="i in 5" 
                :key="i"
                @click="feedback.rating = i"
                class="transition-all hover:scale-110 active:scale-90"
              >
                <div class="h-10 w-10 icon-mask i-lucide-star" :class="i <= feedback.rating ? 'bg-orange-500' : 'bg-zinc-700'"></div>
              </button>
            </div>
          </div>

          <!-- Repeat -->
          <button 
            @click="feedback.repeat = !feedback.repeat"
            class="p-6 rounded-3xl border-2 flex items-center justify-between active:scale-95 transition-all"
            :class="feedback.repeat ? 'border-orange-500/50 bg-orange-500/5 text-white' : 'border-zinc-800 bg-zinc-950 text-zinc-500'"
          >
            <div class="flex flex-col items-start gap-1">
              <span class="font-black uppercase tracking-tight italic">Repeat this sequence?</span>
              <span class="text-[10px] opacity-60">I want more sensations like these</span>
            </div>
            <div 
              class="h-8 w-8 rounded-full flex items-center justify-center transition-all"
              :class="feedback.repeat ? 'bg-orange-500 text-white' : 'bg-zinc-800 text-zinc-600'"
            >
              <div class="h-5 w-5 icon-mask i-lucide-check"></div>
            </div>
          </button>

          <textarea 
            v-model="feedback.notes"
            placeholder="Training notes (optional)..."
            class="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 h-32 focus:outline-none focus:border-orange-500 italic font-medium"
          ></textarea>

          <button 
            @click="completeSession"
            :disabled="isSubmitting"
            class="btn-primary w-full h-16 shadow-2xl"
          >
            <span v-if="!isSubmitting">LOG & LOCK</span>
            <span v-else class="h-6 w-6 border-4 border-white/20 border-t-white rounded-full animate-spin"></span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
</style>
