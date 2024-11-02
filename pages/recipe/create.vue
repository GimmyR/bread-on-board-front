<template>
  <div class="container-fluid container-lg bg-light py-5 mt-5">
    <form class="d-flex flex-column col-12 col-lg-6 mx-auto mt-0 mt-lg-5 mb-0 mb-lg-5" @submit.prevent="createRecipe">
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
      <Transition name="alert">
        <div class="alert alert-danger mb-4" role="alert" v-if="errorMessage != null">
          {{ errorMessage }}
        </div>
      </Transition>
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

  const router = useRouter();
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

  const errorMessage = ref(null);

  const createRecipe = () => {
    if(localStorage.getItem("token") != null) {
      startSaveAnimation();
      let form = new FormData();
      form.append("token", localStorage.getItem("token"));
      form.append("title", title.value);
      form.append("image", image.value);
      form.append("ingredients", ingredients.value);

      $fetch("http://localhost:9001/api/recipe/create", {
        method: 'POST',
        body: form,
        onResponse({ request, response, options }) {
          if(response.status == 200)
            saveAllSteps(response._data);
          else {
            endSaveAnimation();
            errorMessage.value = response._data;
          }
        }
      });
    } else router.push("/login");
  };

  const saveAllSteps = (recipeId) => {
    $fetch("http://localhost:9001/api/recipe-step/save-all", {
      method: 'POST',
      body: {
        recipeId: recipeId,
        steps: steps.value
      },
      onResponse({ request, response, options }) {
        if(response.status == 200)
          router.push("/recipe/" + recipeId);
        else {
          endSaveAnimation();
          errorMessage.value = response._data;
        }
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

  const startSaveAnimation = () => {
    showSpinner.value = true;
    saveButton.value.color = "secondary";
    saveButton.value.disabled = true;
  };

  const endSaveAnimation = () => {
    showSpinner.value = false;
    saveButton.value.color = "success";
    saveButton.value.disabled = false;
  };
</script>