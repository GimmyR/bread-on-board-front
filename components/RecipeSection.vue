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
  const { data: recipes } = useFetch('http://localhost:9001/api/recipe/get-all/');
</script>