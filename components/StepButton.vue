<script lang="ts" setup>
 defineProps<{ class: string, icon: string, iconColor: string }>();
</script>

<template>
  <b-button @click="$emit('handleClick')" color="outline-light" :class="class">
    <BIcon :icon="`bi:${icon}`" :color="iconColor"/>
  </b-button>
</template>