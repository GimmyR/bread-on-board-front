<template>
  <div class="container-fluid container-lg bg-light py-5 mt-5">
    <form class="d-flex flex-column col-12 col-lg-6 mx-auto mt-0 mt-lg-5 mb-0 mb-lg-5" @submit.prevent="createRecipe">
      <Transition name="alert">
        <div class="alert alert-danger mb-4" role="alert" v-if="errorMessage != null">
          {{ errorMessage }}
        </div>
      </Transition>
      <div class="mb-4">
        <label for="title" class="form-label text-success fw-bold">Titre de la recette</label>
        <input type="text" class="form-control" v-model="title" id="title">
      </div>
      <div class="mb-4">
        <label for="image" class="form-label text-success fw-bold">Image de la recette</label>
        <input type="file" class="form-control" accept="image/*" @change="fileSelected" id="image">
        <Transition name="image">
          <template v-if="image != null && image.name != ''">
            <img :src="imgURL" class="img-fluid mt-4"/>
          </template>
        </Transition>
      </div>
      <div class="mb-4">
        <label for="ingredients" class="form-label text-success fw-bold">Les ingrédients de la recette</label>
        <input type="text" class="form-control" v-model="ingredients" id="ingredients"/>
      </div>
      <div class="d-flex flex-column mb-4" v-for="(step, index) in steps" :key="getNowTimestamp">
        <label :for="`step-${index + 1}`" class="d-flex flex-row align-items-center form-label text-success fw-bold">
          <b-button @click="addStepRightAfter(index)" color="outline-light" class="border-0 px-0 me-2">
            <BIcon icon="bi:plus-lg" color="primary"/>
          </b-button>
          Etape #{{ index + 1 }}
          <b-button @click="removeStepAt(index)" color="outline-light" class="border-0 px-0 ms-2">
            <BIcon icon="bi:trash" color="primary"/>
          </b-button>
        </label>
        <input type="text" class="form-control" v-model="step.text" :id="`step-${index + 1}`"/>
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

  const route = useRoute();
  const router = useRouter();
  const title = ref("");
  const image = ref(new File([], ""));
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
  const appConfig = useAppConfig();

  onMounted(() => {
    let key = "title-for-create";
    if(localStorage.getItem(key) != null) {
      title.value = localStorage.getItem(key);
      localStorage.removeItem(key);
    }
  });

  const createRecipe = () => {
    if(localStorage.getItem("access-token") != null) {
      startSaveAnimation();
      let form = new FormData();
      form.append("title", title.value);
      form.append("image", image.value);
      form.append("ingredients", ingredients.value);

      $fetch(appConfig.apiURL + "/api/recipe/create", {
        method: 'POST',
        headers: {
          "Authorization": "Bearer " + localStorage.getItem("access-token")
        },
        body: form,
        onResponse({ request, response, options }) {
          if(response.status == 200 || response.status == 500)
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