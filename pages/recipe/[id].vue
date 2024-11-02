<template>
  <div class="container-fluid container-lg bg-light py-5">
    <h1 v-if="error">Recipe not found</h1>
    <div v-else class="d-flex flex-column align-items-center my-5 px-3">
      <h1 class="text-success mb-1">{{ recipe.title }}</h1>
      <h3 class="fs-5 mb-5">
        par <NuxtLink :to="'/account/' + recipe.accountId" class="text-light-green text-decoration-none">Quelqu'un</NuxtLink>
      </h3>
      <img :src="'http://localhost:9001/images/' + recipe.image" :alt="recipe.title" class="img-fluid col-12 col-lg-4 mb-5">
      <div class="d-flex flex-column col-12 col-lg-8 mt-2 mb-3">
        <h2 class="text-success text-center text-lg-start text-decoration-underline fs-4 mb-3">Les ingrédients</h2>
        <p class="ps-0 ps-lg-3">{{ recipe.ingredients }}</p>
      </div>
      <div class="d-flex flex-column col-12 col-lg-8">
        <h2 class="text-success text-center text-lg-start text-decoration-underline fs-4">Les étapes à suivre</h2>
        <ol class="pt-3">
          <li v-for="step in steps" class="mb-4">{{ step.text }}</li>
        </ol>
      </div>
    </div>
  </div>
</template>

<script setup>
  import '~/assets/css/recipe.css';
  
  useSeoMeta({
    title: 'Détails d\'une recette - Bread on Board'
  });

  const route = useRoute();
  const { data: recipe, error } = await useFetch("http://localhost:9001/api/recipe/get-one/" + route.params.id);
  const { data: steps } = await useFetch("http://localhost:9001/api/recipe-step/get-all/" + route.params.id);
</script>