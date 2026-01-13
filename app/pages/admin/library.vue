<script setup>
// pages/admin/library.vue
const rawText = ref('');
const workoutData = ref(null);
const isParsing = ref(false);
const isSaving = ref(false);
const successMessage = ref('');

async function handleParse() {
  if (!rawText.value.trim()) return;
  isParsing.value = true;
  successMessage.value = '';
  try {
    const response = await $fetch('/api/workouts/parse', {
      method: 'POST',
      body: { text: rawText.value }
    });
    workoutData.value = response;
  } catch (error) {
    console.error("Parse error", error);
    alert("Error parsing text");
  } finally {
    isParsing.value = false;
  }
}

async function handleSave() {
  if (!workoutData.value) return;
  isSaving.value = true;
  try {
    const response = await $fetch('/api/workouts', {
      method: 'POST',
      body: workoutData.value
    });
    if (response.success) {
      successMessage.value = 'Workout saved successfully!';
      rawText.value = '';
      workoutData.value = null;
    }
  } catch (error) {
    console.error("Save error", error);
    alert("Error saving workout");
  } finally {
    isSaving.value = false;
  }
}

function removeExercise(blockIdx, exIdx) {
  workoutData.value.blocks[blockIdx].exercises.splice(exIdx, 1);
}

function addBlock() {
  workoutData.value.blocks.push({ type: 'main', exercises: [] });
}
</script>

<template>
  <div class="p-6 max-w-2xl mx-auto flex flex-col gap-8 pb-32">
    <header>
      <NuxtLink to="/" class="text-orange-500 text-xs font-bold flex items-center gap-1 mb-4 group transition-all">
        <div class="h-4 w-4 i-lucide-chevron-right rotate-180"></div>
        Back to Dashboard
      </NuxtLink>
      <h1 class="text-4xl font-black italic uppercase tracking-tighter">Workout Library</h1>
      <p class="text-zinc-500 font-bold uppercase text-[10px] tracking-widest mt-1">Admin // Content Ingestion</p>
    </header>

    <!-- Success Message -->
    <div v-if="successMessage" class="bg-green-500/10 border border-green-500/20 text-green-500 p-6 rounded-3xl text-center font-black italic uppercase tracking-tight animate-in zoom-in-95 duration-300">
      {{ successMessage }}
    </div>

    <!-- Step 1: Paste Area -->
    <section v-if="!workoutData" class="flex flex-col gap-6 animate-in fade-in duration-500">
      <div class="flex flex-col gap-2">
        <label class="text-[10px] font-black uppercase tracking-widest text-zinc-600 pl-1">Raw Training Text</label>
        <textarea 
          v-model="rawText"
          placeholder="Example: Power Build&#10;Warmup:&#10;10 Halos&#10;10 Slingshots&#10;&#10;Main:&#10;5x10 Kettlebell Swings&#10;5x5 Military Press"
          class="w-full bg-zinc-900 border border-zinc-800 rounded-[2rem] p-8 h-80 focus:outline-none focus:border-orange-500 font-mono text-sm leading-relaxed shadow-inner"
        ></textarea>
      </div>
      <button 
        @click="handleParse"
        :disabled="isParsing || !rawText.trim()"
        class="h-16 bg-white text-zinc-950 rounded-2xl font-black text-xl italic uppercase tracking-tighter active:scale-95 transition-all flex items-center justify-center disabled:opacity-50"
      >
        <span v-if="!isParsing">Identify Workout</span>
        <span v-else class="h-6 w-6 border-4 border-zinc-950/20 border-t-zinc-950 rounded-full animate-spin"></span>
      </button>
    </section>

    <!-- Step 2: Review & Edit Area -->
    <section v-else class="flex flex-col gap-8 animate-in slide-in-from-bottom-8 duration-500">
      <div class="flex justify-between items-center bg-zinc-950 border border-zinc-800 p-4 rounded-2xl">
        <h2 class="text-sm font-black uppercase text-orange-500 italic">Reviewing Draft</h2>
        <button @click="workoutData = null" class="text-[10px] font-black uppercase text-zinc-500 hover:text-white transition-colors">Discard / Retry</button>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div class="flex flex-col gap-6">
          <div class="flex flex-col gap-2">
            <label class="text-[10px] font-black uppercase tracking-widest text-zinc-600 pl-1">Title</label>
            <input v-model="workoutData.title" type="text" class="bg-zinc-900 border border-zinc-800 rounded-xl p-4 focus:border-orange-500 font-bold" />
          </div>
          <div class="grid grid-cols-2 gap-4">
             <div class="flex flex-col gap-2">
              <label class="text-[10px] font-black uppercase tracking-widest text-zinc-600 pl-1">Duration (min)</label>
              <input v-model="workoutData.durationMinutes" type="number" class="bg-zinc-900 border border-zinc-800 rounded-xl p-4 focus:border-orange-500 text-center font-bold" />
            </div>
            <div class="flex flex-col gap-2">
              <label class="text-[10px] font-black uppercase tracking-widest text-zinc-600 pl-1">Difficulty (1-5)</label>
              <input v-model="workoutData.difficulty" type="number" min="1" max="5" class="bg-zinc-900 border border-zinc-800 rounded-xl p-4 focus:border-orange-500 text-center font-bold" />
            </div>
          </div>
          <div class="flex flex-col gap-2">
            <label class="text-[10px] font-black uppercase tracking-widest text-zinc-600 pl-1">Format</label>
            <select v-model="workoutData.format" class="bg-zinc-900 border border-zinc-800 rounded-xl p-4 focus:border-orange-500 appearance-none font-bold">
              <option>Sets/Reps</option>
              <option>AMRAP</option>
              <option>EMOM</option>
              <option>Tabata</option>
              <option>Flow</option>
            </select>
          </div>
        </div>

        <div class="flex flex-col gap-4">
          <label class="text-[10px] font-black uppercase tracking-widest text-zinc-600 pl-1">Blocks & Exercises</label>
          <div class="flex flex-col gap-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
            <div v-for="(block, bIdx) in workoutData.blocks" :key="bIdx" class="p-6 bg-zinc-950 border border-zinc-800 rounded-[2rem] relative group border-l-4 border-l-orange-500">
              <div class="flex items-center justify-between mb-4">
                 <input v-model="block.type" class="bg-transparent font-black uppercase italic text-xs w-24 focus:outline-none text-orange-500" />
                 <span class="text-[10px] font-black text-zinc-700"># {{ bIdx + 1 }}</span>
              </div>
              
              <div class="flex flex-col gap-3">
                <div v-for="(ex, eIdx) in block.exercises" :key="eIdx" class="flex gap-2 items-center">
                  <input v-model="ex.name" placeholder="Exercise" class="flex-1 bg-zinc-900 border border-zinc-800 rounded-lg p-2 text-xs font-bold" />
                  <input v-model="ex.reps" placeholder="Reps" class="w-16 bg-zinc-800 border-none rounded-lg p-2 text-xs text-center font-bold text-orange-500" />
                  <button @click="removeExercise(bIdx, eIdx)" class="text-zinc-700 hover:text-red-500 transition-colors">&times;</button>
                </div>
                <button @click="block.exercises.push({name: '', reps: ''})" class="text-[10px] font-black uppercase tracking-widest text-orange-500 mt-2 hover:bg-orange-500/5 p-2 rounded-lg transition-all text-center border border-orange-500/20">+ Add Exercise</button>
              </div>
            </div>
            <button @click="addBlock" class="p-4 border-2 border-dashed border-zinc-800 text-zinc-600 text-[10px] font-black uppercase tracking-widest rounded-[2rem] hover:border-zinc-700 hover:text-zinc-400 transition-all">
              + Add Block
            </button>
          </div>
        </div>
      </div>

      <button 
        @click="handleSave"
        :disabled="isSaving"
        class="h-20 bg-orange-600 text-white rounded-[2.5rem] font-black text-2xl italic uppercase tracking-tighter active:scale-95 transition-all flex items-center justify-center shadow-2xl shadow-orange-500/30 disabled:opacity-50"
      >
        <span v-if="!isSaving">Lock into Library</span>
        <span v-else class="h-8 w-8 border-4 border-white/20 border-t-white rounded-full animate-spin"></span>
      </button>
    </section>
  </div>
</template>

<style scoped>
.custom-scrollbar::-webkit-scrollbar { width: 4px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: #27272a; border-radius: 10px; }
.i-lucide-chevron-right { content: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m9 18 6-6-6-6'/%3E%3C/svg%3E"); }
</style>
