<script setup>
const route = useRoute();
</script>

<template>
  <div class="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col">
    <!-- Main Content -->
    <main class="flex-1 overflow-x-hidden">
      <slot />
    </main>

    <!-- Bottom Navigation (Mobile First) -->
    <nav class="h-20 bg-zinc-900/80 backdrop-blur-lg border-t border-zinc-800 flex items-center justify-around px-4 sticky bottom-0 z-50">
      <NuxtLink to="/" class="flex flex-col items-center gap-1 transition-all active:scale-95" :class="route.path === '/' ? 'text-orange-500' : 'text-zinc-500'">
        <div class="h-6 w-6 icon-mask i-lucide-layout-dashboard"></div>
        <span class="text-[10px] font-black uppercase tracking-widest">Dash</span>
      </NuxtLink>

      <NuxtLink to="/calendar" class="flex flex-col items-center gap-1 transition-all active:scale-95" :class="route.path === '/calendar' ? 'text-orange-500' : 'text-zinc-500'">
        <div class="h-6 w-6 icon-mask i-lucide-calendar"></div>
        <span class="text-[10px] font-black uppercase tracking-widest">Plan</span>
      </NuxtLink>

      <NuxtLink to="/stats" class="flex flex-col items-center gap-1 transition-all active:scale-95" :class="route.path === '/stats' ? 'text-orange-500' : 'text-zinc-500'">
        <div class="h-6 w-6 icon-mask i-lucide-bar-chart"></div>
        <span class="text-[10px] font-black uppercase tracking-widest">Stats</span>
      </NuxtLink>

      <NuxtLink to="/library" class="flex flex-col items-center gap-1 transition-all active:scale-95" :class="route.path === '/library' ? 'text-orange-500' : 'text-zinc-500'">
        <div class="h-6 w-6 icon-mask i-lucide-book-open"></div>
        <span class="text-[10px] font-black uppercase tracking-widest">Library</span>
      </NuxtLink>
    </nav>
  </div>
</template>

<style scoped>
</style>
