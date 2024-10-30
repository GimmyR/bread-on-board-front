<template>
  <div class="container-fluid container-lg bg-light py-5 mt-5" style="min-height: 800px;">
    <form class="d-flex flex-column col-12 col-lg-6 mx-auto mt-0 mt-lg-5" @submit.prevent="createRecipe">
      <div class="mb-4">
        <label for="title" class="form-label text-success fw-bold">Titre de la recette</label>
        <input type="text" class="form-control" name="title" v-model="title">
      </div>
      <div class="mb-4">
        <label for="image" class="form-label text-success fw-bold">Image de la recette</label>
        <input type="file" class="form-control" accept="image/*" name="image" @change="fileSelected">
      </div>
      <div class="mb-4">
        <label for="ingredients" class="form-label text-success fw-bold">Les ingrédients de la recette</label>
        <textarea name="ingredients" class="form-control" v-model="ingredients"></textarea>
      </div>
      <div class="d-flex flex-row justify-content-end align-items-center">
        <BIcon icon="bi:check-circle" v-show="showCorrect" class="text-success"/>
        <Spinner sm v-show="showSprinner" text-color="secondary"/>
        <b-button color="success" type="submit" class="ms-3">Créer la recette</b-button>
      </div>
    </form>
  </div>
</template>

<script setup>
  useSeoMeta({
    title: "Création d'une recette - Bread on Board"
  });

  const title = ref('');
  let image = null;
  const ingredients = ref('');
  
  const showCorrect = ref(false);
  const showSprinner = ref(false);

  const createRecipe = async () => {
    showSprinner.value = true;
    let form = new FormData();
    form.append("title", title.value);
    form.append("image", image);
    form.append("ingredients", ingredients.value);

    const { data: recipeId, error } = await useFetch("http://localhost:9001/api/recipe/create", {
      method: 'POST',
      body: form,

      onResponse({ request, response, options }) {
        let recipeId = response._data;
        showCorrect.value = true;
        showSprinner.value = false;
        console.log(recipeId);
      },

      onResponseError({ request, response, options }) {
        showSprinner.value = false;
      }
    });
  };

  const fileSelected = (event) => {
    image = event.target.files[0];
  };
</script>