<template>
  <div class="container-fluid container-lg bg-light py-5 mt-5" style="min-height: 800px;">
    <form class="d-flex flex-column col-12 col-lg-6 mx-auto mt-0 mt-lg-5" @submit.prevent="createRecipe">
      <div class="mb-4">
        <label for="title" class="form-label text-success fw-bold">Titre de la recette</label>
        <input type="text" class="form-control" v-model="title">
      </div>
      <div class="mb-4">
        <label for="image" class="form-label text-success fw-bold">Image de la recette</label>
        <input type="file" class="form-control" accept="image/*" @change="fileSelected">
        <Transition name="image">
          <template v-if="image != null">
            <img :src="imgURL" class="img-fluid mt-4"/>
          </template>
        </Transition>
      </div>
      <div class="mb-4">
        <label for="ingredients" class="form-label text-success fw-bold">Les ingrédients de la recette</label>
        <input type="text" class="form-control" v-model="ingredients"/>
      </div>
      <div class="d-flex flex-column mb-4" v-for="(step, index) in steps" :key="getNowTimestamp">
        <label :for="`step-${index + 1}`" class="form-label text-success fw-bold">
          <a href="#" @click="addStepRightAfter(index)" class="me-1" title="Ajouter une étape juste après">
            <BIcon icon="bi:plus-lg" color="primary"/>
          </a>
          Etape #{{ index + 1 }}
          <a href="#" class="ms-1" title="Supprimer cette étape" @click="removeStepAt(index)">
            <BIcon icon="bi:trash" color="primary"/>
          </a>
        </label>
        <input type="text" class="form-control" v-model="step.text"/>
      </div>
      <div class="d-flex flex-row justify-content-end align-items-center">
        <Transition name="spinner">
          <Spinner spinner="grow" v-show="showSpinner" text-color="secondary" class="me-1" sm/>
        </Transition>
        <b-button :color="saveButton.color" type="submit" class="ms-3" :class="{disabled: saveButton.disabled}">
          Enregistrer
        </b-button>
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
  const steps = ref([
    { text: '' }
  ]);

  const showSpinner = ref(false);
  const saveButton = ref({
    color: "success",
    disabled: false
  });

  const createRecipe = () => {
    showSpinner.value = true;
    saveButton.value.color = "secondary";
    saveButton.value.disabled = true;
    let form = new FormData();
    form.append("title", title.value);
    form.append("image", image.value);
    form.append("ingredients", ingredients.value);

    console.log(steps.value);

    useFetch("http://localhost:9001/api/recipe/create", {
      method: 'POST',
      body: form,
      onResponse({ request, response, options }) {
        saveAllSteps(response._data);
      },
      onResponseError({ request, response, options }) {
        showSpinner.value = false;
        saveButton.value.color = "success";
        saveButton.value.disabled = false;
      }
    });
  };

  const saveAllSteps = (recipeId) => {
    useFetch("http://localhost:9001/api/recipe-step/save-all", {
      method: 'POST',
      body: {
        recipeId: recipeId,
        steps: steps.value
      },
      onResponse({ request, response, options }) {
        const router = useRouter();
        router.push("/recipe/" + recipeId);
      }
    });
  };

  const fileSelected = (event) => {
    image.value = event.target.files[0];
  };

  const imgURL = computed(() => URL.createObjectURL(image.value));

  const addStepRightAfter = (index) => {
    steps.value.splice(index + 1, 0, { text: '' });
  };

  const removeStepAt = (index) => {
    steps.value.splice(index, 1);
  };

  const getNowTimestamp = () => {
    return Date.now();
  };
</script>