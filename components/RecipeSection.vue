<template>
  <div class="container-fluid container-lg bg-light px-5 py-5" style="min-height: 700px;">
    <div class="row row-cols-1 row-cols-lg-4 gy-4">
      <div v-for="recipe in recipes">
        <Card :recipe="recipe" />
      </div>
    </div>
  </div>
</template>

<script setup>
  const appConfig = useAppConfig();

  const { data: recipes } = await useFetch(appConfig.apiURL + '/api/recipe/get-all/');
</script>