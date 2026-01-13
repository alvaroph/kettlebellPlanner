<script setup>
// pages/wizard.vue
const router = useRouter();

const currentStep = ref(1);
const totalSteps = 4;

const form = reactive({
  name: "My KB Program",
  weeks: 4,
  daysPerWeek: 3,
  duration: 30,
  goal: "Strength / Muscle",
  intensity: 3,
  focus: "Full body"
});

const isSubmitting = ref(false);

function nextStep() {
  if (currentStep.value < totalSteps) {
    currentStep.value = currentStep.value + 1;
  }
}

function prevStep() {
  if (currentStep.value > 1) {
    currentStep.value = currentStep.value - 1;
  }
}

const { createProgram: createProgramRemote } = useData();

async function createProgram() {
  isSubmitting.value = true;
  try {
    const response = await createProgramRemote({
      name: form.name,
      weeks: form.weeks,
      daysPerWeek: form.daysPerWeek,
      sessionDuration: form.duration,
      goal: form.goal,
      intensity: form.intensity,
      focusTags: form.focus
    });
    
    if (response.success) {
      router.push('/calendar');
    }
  } catch (error) {
    console.error("Error creating program", error);
    alert("Error creating program");
  } finally {
    isSubmitting.value = false;
  }
}
</script>

<template>
  <div class="p-6 max-w-md mx-auto min-h-screen flex flex-col pb-32">
    <header class="mb-10">
      <h1 class="text-4xl font-black italic uppercase tracking-tighter text-white">
        New Program
      </h1>
      <p class="text-zinc-500 font-bold uppercase text-[10px] tracking-widest mt-1">Setup Your Journey</p>
      <div class="flex gap-2 mt-6">
        <div 
          v-for="i in totalSteps" 
          :key="i"
          class="h-1.5 flex-1 rounded-full transition-all duration-500"
          :class="i <= currentStep ? 'bg-orange-500 shadow-sm shadow-orange-500/50' : 'bg-zinc-800'"
        ></div>
      </div>
    </header>

    <div class="flex-1 flex flex-col gap-8">
      <!-- Step 1: Basics -->
      <section v-if="currentStep === 1" class="flex flex-col gap-6 animate-in fade-in slide-in-from-right-4 duration-500">
        <h2 class="text-xl font-bold uppercase tracking-tight italic">Basic Concepts</h2>
        <div class="flex flex-col gap-2">
          <label class="text-[10px] font-black uppercase tracking-widest text-zinc-500">Program Name</label>
          <input 
            v-model="form.name"
            type="text" 
            class="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 focus:outline-none focus:border-orange-500 transition-colors font-bold"
          />
        </div>
        <div class="flex flex-col gap-2">
          <label class="text-[10px] font-black uppercase tracking-widest text-zinc-500">Primary Goal</label>
          <div class="grid grid-cols-1 gap-3">
             <button 
                v-for="g in ['Strength / Muscle', 'FAT Loss', 'Recovery / Mobility', 'General']" 
                :key="g"
                @click="form.goal = g"
                class="p-4 border rounded-2xl transition-all text-sm font-bold flex justify-between items-center"
                :class="form.goal === g ? 'bg-orange-500/10 border-orange-500 text-orange-500' : 'bg-zinc-900 border-zinc-800 text-zinc-400'"
              >
                {{ g }}
                <div v-if="form.goal === g" class="h-4 w-4 i-lucide-check-circle"></div>
              </button>
          </div>
        </div>
      </section>

      <!-- Step 2: Structure -->
      <section v-if="currentStep === 2" class="flex flex-col gap-6 animate-in fade-in slide-in-from-right-4 duration-500">
        <h2 class="text-xl font-bold uppercase tracking-tight italic">Plan Structure</h2>
        <div class="grid grid-cols-2 gap-4">
          <div class="flex flex-col gap-2">
            <label class="text-[10px] font-black uppercase tracking-widest text-zinc-500">Weeks (2-12)</label>
            <input 
              v-model="form.weeks"
              type="number" 
              class="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 focus:outline-none text-center font-bold"
            />
          </div>
          <div class="flex flex-col gap-2">
            <label class="text-[10px] font-black uppercase tracking-widest text-zinc-500">Days/Week (2-6)</label>
            <input 
              v-model="form.daysPerWeek"
              type="number" 
              class="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 focus:outline-none text-center font-bold"
            />
          </div>
        </div>
        <div class="flex flex-col gap-2">
          <label class="text-[10px] font-black uppercase tracking-widest text-zinc-500">Session Duration (min)</label>
          <input 
            v-model="form.duration"
            type="number" 
            class="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 focus:outline-none text-center font-bold"
          />
        </div>
      </section>

      <!-- Step 3: Intensity & Focus -->
      <section v-if="currentStep === 3" class="flex flex-col gap-6 animate-in fade-in slide-in-from-right-4 duration-500">
        <h2 class="text-xl font-bold uppercase tracking-tight italic">Intensity & Focus</h2>
        <div class="flex flex-col gap-2">
          <label class="text-[10px] font-black uppercase tracking-widest text-zinc-500">Intensity (1-5)</label>
          <input 
            v-model="form.intensity"
            type="range" min="1" max="5" 
            class="w-full h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-orange-500"
          />
          <div class="flex justify-between text-[10px] font-black uppercase text-zinc-600 px-1 mt-1">
            <span>Chill</span>
            <span>Hardcore</span>
          </div>
        </div>
        <div class="flex flex-col gap-2">
          <label class="text-[10px] font-black uppercase tracking-widest text-zinc-500">Body Focus</label>
          <div class="grid grid-cols-2 gap-2">
            <button 
              v-for="f in ['Full body', 'Legs', 'Upper', 'Core']" 
              :key="f"
              @click="form.focus = f"
              class="p-4 border rounded-2xl transition-all text-xs font-bold uppercase tracking-tighter"
              :class="form.focus === f ? 'bg-orange-500 border-orange-500 text-white' : 'bg-zinc-900 border-zinc-800 text-zinc-400'"
            >
              {{ f }}
            </button>
          </div>
        </div>
      </section>

      <!-- Step 4: Summary -->
      <section v-if="currentStep === 4" class="flex flex-col gap-6 animate-in fade-in slide-in-from-right-4 duration-500">
        <h2 class="text-xl font-bold uppercase tracking-tight italic">Confirm Plan</h2>
        <div class="glass-card flex flex-col gap-4">
          <div class="flex justify-between items-center pb-3 border-b border-zinc-800/50">
            <span class="text-[10px] font-black uppercase text-zinc-500">Program</span>
            <span class="font-black italic uppercase">{{ form.name }}</span>
          </div>
          <div class="flex justify-between items-center pb-3 border-b border-zinc-800/50">
            <span class="text-[10px] font-black uppercase text-zinc-500">Duration</span>
            <span class="font-bold">{{ form.weeks }} weeks</span>
          </div>
          <div class="flex justify-between items-center pb-3 border-b border-zinc-800/50">
            <span class="text-[10px] font-black uppercase text-zinc-500">Frequency</span>
            <span class="font-bold">{{ form.daysPerWeek }} days/week</span>
          </div>
          <div class="flex justify-between items-center">
            <span class="text-[10px] font-black uppercase text-zinc-500">Goal</span>
            <span class="text-orange-500 font-black italic uppercase">{{ form.goal }}</span>
          </div>
        </div>
        <p class="text-xs text-zinc-600 italic mt-auto text-center">
          "The distance between who you are and who you want to be is what you do."
        </p>
      </section>
    </div>

    <!-- Actions -->
    <div class="mt-8 flex gap-3">
      <button 
        v-if="currentStep > 1"
        @click="prevStep"
        class="h-16 px-8 rounded-2xl border-2 border-zinc-800 text-zinc-500 font-black uppercase text-xs active:scale-95 transition-all"
      >
        Back
      </button>
      <button 
        v-if="currentStep < totalSteps"
        @click="nextStep"
        class="h-16 flex-1 bg-white text-zinc-950 rounded-2xl font-black uppercase italic text-lg active:scale-95 transition-all shadow-xl shadow-white/5"
      >
        Continue
      </button>
      <button 
        v-else
        @click="createProgram"
        :disabled="isSubmitting"
        class="h-16 flex-1 bg-orange-600 text-white rounded-2xl font-black uppercase italic text-lg active:scale-95 transition-all flex items-center justify-center shadow-xl shadow-orange-500/20 disabled:opacity-50"
      >
        <span v-if="!isSubmitting">Generate Alpha!</span>
        <span v-else class="h-6 w-6 border-4 border-white/30 border-t-white rounded-full animate-spin"></span>
      </button>
    </div>
  </div>
</template>
