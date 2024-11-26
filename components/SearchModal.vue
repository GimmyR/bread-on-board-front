<template>
  <Modal id="searchModal" size="lg">
    <ModalDialog fullscreen="md-down">
      <ModalContent rounded-size="1">
        <ModalHeader>
          <input type="text" class="form-control me-1" placeholder="Rechercher une recette" v-model="search" @keypress.enter="fetchRecipes">
          <CloseButton dismiss="modal" />
        </ModalHeader>
        <ModalBody class="px-4" style="height: 750px;">
          <div class="d-flex flex-row align-items-center" v-for="recipe in recipes">
            <Anchor class="fs-6 text-truncate my-auto py-2 text-decoration-none" :to="`/recipe/${recipe.id}`" dismiss="modal">
              <span class="text-success me-3">{{ recipe.title }}</span> {{ recipe.ingredients }}
            </Anchor>
          </div>
        </ModalBody>
      </ModalContent>
    </ModalDialog>
  </Modal>
</template>

<script setup>
  const search = ref('');
  const recipes = ref([]);
  const appConfig = useAppConfig();
  
  const fetchRecipes = () => {
    let form = new FormData();
    form.append("search", search.value);
    $fetch(appConfig.apiURL + "/api/recipe/search/", {
      method: 'POST',
      body: form,
      onResponse({ request, response, options }) {
        recipes.value = response._data;
      }
    });
  };
</script>