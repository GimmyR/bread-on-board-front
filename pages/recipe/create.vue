<template>
  <div class="container-fluid container-lg bg-light py-5 mt-5" style="min-height: 800px;">
    <form class="d-flex flex-column col-12 col-lg-6 mx-auto mt-0 mt-lg-5" @submit.prevent="createRecipe">
      <div class="mb-4">
        <label for="title" class="form-label text-success fw-bold">Titre de la recette</label>
        <input type="text" class="form-control" name="title" v-model="title">
      </div>
      <div class="mb-5">
        <label for="image" class="form-label text-success fw-bold">Image de la recette</label>
        <input type="file" class="form-control" accept="image/*" name="image" @change="fileSelected">
        <Transition name="image">
          <template v-if="image != null">
            <img :src="imgURL" class="img-fluid mt-4"/>
          </template>
        </Transition>
      </div>
      <div class="mb-4">
        <label for="ingredients" class="form-label text-success fw-bold">Les ingrédients de la recette</label>
        <textarea name="ingredients" class="form-control" v-model="ingredients"></textarea>
      </div>
      <div class="d-flex flex-row justify-content-end align-items-center">
        <Transition name="spinner">
          <Spinner sm v-show="showSpinner" text-color="secondary"/>
        </Transition>
        <b-button color="success" type="submit" class="ms-3">Créer la recette</b-button>
      </div>
    </form>
  </div>
</template>

<script setup>
  import '~/assets/css/create.css';
  
  useSeoMeta({
    title: "Création d'une recette - Bread on Board"
  });

  const title = ref('');
  const image = ref(null);
  const ingredients = ref('');
  const showSpinner = ref(false);

  const createRecipe = async () => {
    showSpinner.value = true;
    let form = new FormData();
    form.append("title", title.value);
    form.append("image", image.value);
    form.append("ingredients", ingredients.value);

    const { data: recipeId, error } = await useFetch("http://localhost:9001/api/recipe/create", {
      method: 'POST',
      body: form,
      onResponse({ request, response, options }) {
        let recipeId = response._data;
      },
      onResponseError({ request, response, options }) {
        showSpinner.value = false;
      }
    });
  };

  const fileSelected = (event) => {
    image.value = event.target.files[0];
  };

  const imgURL = computed(() => URL.createObjectURL(image.value));
</script>