<script setup>
const { requestPersistence } = useData();
onMounted(() => {
  requestPersistence();
});
</script>

<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
