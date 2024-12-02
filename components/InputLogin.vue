<script lang="ts" setup>
  defineProps<{ icon: string, type: string, placeholder: string }>();
  const model = defineModel();
</script>

<template>
  <div class="input-group">
    <span class="input-group-text">
      <BIcon :icon="`bi:${icon}`" />
    </span>
    <input :type="type" class="form-control" v-model="model" :placeholder="placeholder"/>
  </div>
</template>