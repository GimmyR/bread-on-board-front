<template>
  <NuxtLink :to="to" class="nav-link text-light fw-bold" :title="title">
    <BIcon :icon="`bi:${icon}`"/>
  </NuxtLink>
</template>

<script lang="ts" setup>
  defineProps({
    to: String,
    title: String,
    icon: String
  });
</script>