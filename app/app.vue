<script setup>
var data = useData();
var requestPersistence = data.requestPersistence;

onMounted(function () {
  requestPersistence();
});
</script>

<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
