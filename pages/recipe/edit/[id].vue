<template>
  <div class="container-fluid container-lg bg-light py-5 mt-5">
    <form class="d-flex flex-column col-12 col-lg-6 mx-auto mt-0 mt-lg-5 mb-0 mb-lg-5" @submit.prevent="editRecipe">
      <div class="mb-4">
        <label for="title" class="form-label text-success fw-bold">Titre de la recette</label>
        <input type="text" class="form-control" v-model="title" id="title">
      </div>
      <div class="mb-4">
        <label for="image" class="form-label text-success fw-bold">Image de la recette</label>
        <input type="file" class="form-control" accept="image/*" @change="fileSelected" id="image">
        <Transition name="image">
          <template v-if="image != null">
            <img :src="imgURL" class="img-fluid mt-4"/>
          </template>
        </Transition>
      </div>
      <div class="mb-4">
        <label for="ingredients" class="form-label text-success fw-bold">Les ingrédients de la recette</label>
        <textarea class="form-control" v-model="ingredients" id="ingredients"></textarea>
      </div>
      <div class="d-flex flex-column mb-4" v-for="(step, index) in steps" :key="getNowTimestamp">
        <label :for="`step-${index + 1}`" class="d-flex flex-row align-items-center form-label text-success fw-bold">
          <StepButton @handle-click="addStepRightAfter(index)" icon="plus-lg" icon-color="primary" class="border-0 px-0 me-2" />
          Etape #{{ index + 1 }}
          <StepButton @handle-click="removeStepAt(index)" icon="trash" icon-color="primary" class="border-0 px-0 ms-2" />
        </label>
        <textarea class="form-control" v-model="step.text" :id="`step-${index + 1}`"></textarea>
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
        <b-button color="danger" type="button" class="ms-3" @click="deleteRecipe">
          Supprimer
        </b-button>
        <b-button :color="saveButton.color" type="submit" class="ms-3" :class="{disabled: saveButton.disabled}">
          Enregistrer
        </b-button>
      </div>
    </form>
  </div>
</template>

<script setup>
  import '~/assets/css/edit.css';
  
  useSeoMeta({
    title: "Création d'une recette - Bread on Board"
  });

  const route = useRoute();
  const router = useRouter();
  const title = ref('');
  const image = ref(null);
  const imgURL = ref(null);
  const ingredients = ref('');
  const steps = ref([]);

  const showSpinner = ref(false);
  const saveButton = ref({
    color: "success",
    disabled: false
  });

  const errorMessage = ref(null);
  const appConfig = useAppConfig();

  onMounted(() => {
    $fetch(appConfig.apiURL + "/api/recipe/get-one/" + route.params.id, {
      method: 'GET',
      onResponse({ request, response, options }) {
        if(response.status == 200) {
          title.value = response._data.title;
          image.value = new File([], response._data.image);
          imgURL.value = appConfig.apiURL + "/images/" + response._data.image;
          ingredients.value = response._data.ingredients;
          fetchSteps();
        }
      }
    });
  });

  const fetchSteps = () => {
    $fetch(appConfig.apiURL + "/api/recipe-step/get-all/" + route.params.id, {
      method: 'GET',
      onResponse({ request, response, options }) {
        if(response.status == 200) {
          steps.value = response._data;
        }
      }
    });
  };

  const editRecipe = () => {
    if(localStorage.getItem("access-token") != null) {
      startSaveAnimation();
      let form = new FormData();
      form.append("title", title.value);
      form.append("image", image.value);
      form.append("ingredients", ingredients.value);

      $fetch(appConfig.apiURL + "/api/recipe/edit/" + route.params.id, {
        method: 'POST',
        headers: {
          "Authorization": "Bearer " + localStorage.getItem("access-token")
        },
        body: form,
        onResponse({ request, response, options }) {
          if(response.status == 200)
            saveAllSteps(response._data);
          else {
            endSaveAnimation();
            console.log(response._data);
            errorMessage.value = response._data;
          }
        }
      });
    } else router.push("/login");
  };

  const saveAllSteps = (recipeId) => {
    $fetch(appConfig.apiURL + "/api/recipe-step/save-all", {
      method: 'POST',
      headers: {
        "Authorization": "Bearer " + localStorage.getItem("access-token")
      },
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

  const deleteRecipe = () => {
    if(localStorage.getItem("access-token") != null) {
      $fetch(appConfig.apiURL + "/api/recipe/delete/" + route.params.id, {
        method: 'GET',
        headers: {
          "Authorization": "Bearer " + localStorage.getItem("access-token")
        },
        onResponse({ request, response, options }) {
          if(response.status == 200)
            router.push("/");
          else console.log(response._data);
        }
      });
    } else router.push("/login");
  };

  const fileSelected = (event) => {
    image.value = event.target.files[0];
    imgURL.value = URL.createObjectURL(image.value);
  };

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