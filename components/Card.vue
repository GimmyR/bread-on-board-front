<template>
  <div class="card col p-0">
    <img :src="imgSrc" class="card-img-top" alt="recipe image" height="200">
    <div class="card-body">
      <p class="card-text">{{ recipe.title }}</p>
      <NuxtLink :to="`/recipe/${recipe.id}`" class="btn btn-success">Voir la recette</NuxtLink>
    </div>
  </div>
</template>

<script setup>
  const props = defineProps({
    recipe: Object
  });

  const appConfig = useAppConfig();
  const imgSrc = ref(appConfig.apiURL + "/images/" + props.recipe.image);
</script>