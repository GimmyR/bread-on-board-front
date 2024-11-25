<template>
  <div class="container-fluid container-lg bg-light">
    <div v-if="recipe != null" class="d-flex flex-column align-items-center mt-5 py-5 px-3">
      <div class="d-flex flex-row align-items-center">
        <h1 class="text-success mb-1">
          {{ recipe.title }}
        </h1>
        <NuxtLink :to="`/recipe/edit/${recipe.id}`" class="ms-3" v-if="isConnectedAndAuthor">
          <BIcon icon="bi:pencil-square" class="fs-5"/>
        </NuxtLink>
        <NuxtLink @click="addToFavorite" class="ms-3" v-else>
          <BIcon :icon="favorite" class="fs-5"/>
        </NuxtLink>
      </div>
      <h3 class="fs-5 mb-5">
        par <NuxtLink :to="'/account/' + recipe.accountId" class="text-light-green text-decoration-none">Quelqu'un</NuxtLink>
      </h3>
      <img :src="runtimeConfig.public.apiURL + '/images/' + recipe.image" :alt="recipe.title" class="img-fluid col-12 col-lg-4 mb-5">
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
    <div v-else class="container-fluid bg-light vh-100">
      <RecipeNotFound v-if="error != null"/>
    </div>
  </div>
</template>

<script setup>
  import '~/assets/css/recipe.css';
  
  useSeoMeta({
    title: 'Détails d\'une recette - Bread on Board'
  });

  const route = useRoute();
  const router = useRouter();
  const recipe = ref(null);
  const steps = ref([]);
  const error = ref(null);
  const favorite = ref('bi:suit-heart');
  const isConnectedAndAuthor = ref(false);
  const runtimeConfig = useRuntimeConfig();

  onMounted(() => {
    fetchRecipe();
    if(localStorage.getItem("access-token") != null) {
      $fetch(runtimeConfig.public.apiURL + "/api/recipe/author/" + route.params.id, {
        method: 'GET',
        headers: {
          "Authorization": "Bearer " + localStorage.getItem("access-token")
        },
        onResponse({ request, response, options }) {
          if(response.status == 200)
            isConnectedAndAuthor.value = true;
          else console.log(response._data);
        }
      });
    }
  });

  const fetchRecipe = () => {
    $fetch(runtimeConfig.public.apiURL + "/api/recipe/get-one/" + route.params.id, {
      method: 'GET',
      onResponse({ request, response, options }) {
        if(response.status == 200) {
          recipe.value = response._data;
          fetchSteps();
        } else error.value = response._data;
      }
    });
  };

  const fetchSteps = () => {
    $fetch(runtimeConfig.public.apiURL + "/api/recipe-step/get-all/" + route.params.id, {
      method: 'GET',
      onResponse({ request, response, options }) {
        steps.value = response._data;
      }
    });
  };

  const addToFavorite = () => {
    if(localStorage.getItem("access-token") != null && isConnectedAndAuthor.value == false) {
      // ajouter vraiment aux favoris
    } else router.push("/login");
  };
</script>