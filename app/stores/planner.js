// app/stores/planner.js
import { defineStore } from 'pinia';

export const usePlannerStore = defineStore('planner', {
  state: () => ({
    currentProgram: null,
    history: [],
    loading: false
  }),

  actions: {
    async fetchCurrentProgram() {
      this.loading = true;
      try {
        const data = await $fetch('/api/programs/current');
        this.currentProgram = data;
      } catch (error) {
        console.error("Failed to fetch program", error);
      } finally {
        this.loading = false;
      }
    },
    
    setProgram(program) {
      this.currentProgram = program;
    }
  }
});
