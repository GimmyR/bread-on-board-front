<template>
  <div class="container-fluid container-lg bg-light pt-5" style="min-height: 1200px;">
    <h1>{{ route.params.id }}</h1>
  </div>
</template>

<script lang="ts" setup>
  const route = useRoute();
</script>