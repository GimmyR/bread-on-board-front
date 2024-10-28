<template>
  <div class="card col p-0">
    <img :src="`http://localhost:9001/images/${recipe.image}`" class="card-img-top" alt="recipe image">
    <div class="card-body">
      <p class="card-text">{{ recipe.title }}</p>
      <NuxtLink :to="`/recipe/${recipe.id}`" class="btn btn-success">Voir la recette</NuxtLink>
    </div>
  </div>
</template>

<script setup>
  defineProps({
    recipe: Object
  });
</script>