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
        <div class="h-6 w-6 i-lucide-layout-dashboard"></div>
        <span class="text-[10px] font-black uppercase tracking-widest">Dash</span>
      </NuxtLink>

      <NuxtLink to="/calendar" class="flex flex-col items-center gap-1 transition-all active:scale-95" :class="route.path === '/calendar' ? 'text-orange-500' : 'text-zinc-500'">
        <div class="h-6 w-6 i-lucide-calendar"></div>
        <span class="text-[10px] font-black uppercase tracking-widest">Plan</span>
      </NuxtLink>

      <NuxtLink to="/library" class="flex flex-col items-center gap-1 transition-all active:scale-95" :class="route.path === '/library' ? 'text-orange-500' : 'text-zinc-500'">
        <div class="h-6 w-6 i-lucide-book-open"></div>
        <span class="text-[10px] font-black uppercase tracking-widest">Library</span>
      </NuxtLink>
      
      <NuxtLink to="/wizard" class="flex flex-col items-center gap-1 transition-all active:scale-95" :class="route.path === '/wizard' ? 'text-orange-500' : 'text-zinc-500'">
        <div class="h-6 w-6 i-lucide-plus-circle"></div>
        <span class="text-[10px] font-black uppercase tracking-widest">New</span>
      </NuxtLink>

      <NuxtLink to="/admin/library" class="flex flex-col items-center gap-1 transition-all active:scale-95" :class="route.path === '/admin/library' ? 'text-orange-500' : 'text-zinc-500'">
        <div class="h-6 w-6 i-lucide-plus-square"></div>
        <span class="text-[10px] font-black uppercase tracking-widest">Import</span>
      </NuxtLink>
    </nav>
  </div>
</template>

<style scoped>
.i-lucide-layout-dashboard { content: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Crect width='7' height='9' x='3' y='3' rx='1'/%3E%3Crect width='7' height='5' x='14' y='3' rx='1'/%3E%3Crect width='7' height='9' x='14' y='12' rx='1'/%3E%3Crect width='7' height='5' x='3' y='16' rx='1'/%3E%3C/svg%3E"); }
.i-lucide-calendar { content: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M8 2v4'/%3E%3Cpath d='M16 2v4'/%3E%3Crect width='18' height='18' x='3' y='4' rx='2'/%3E%3Cpath d='M3 10h18'/%3E%3C/svg%3E"); }
.i-lucide-book-open { content: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z'/%3E%3Cpath d='M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z'/%3E%3C/svg%3E"); }
.i-lucide-plus-circle { content: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Ccircle cx='12' cy='12' r='10'/%3E%3Cpath d='M8 12h8'/%3E%3Cpath d='M12 8v8'/%3E%3C/svg%3E"); }
.i-lucide-plus-square { content: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Crect width='18' height='18' x='3' y='3' rx='2'/%3E%3Cpath d='M8 12h8'/%3E%3Cpath d='M12 8v8'/%3E%3C/svg%3E"); }
</style>
