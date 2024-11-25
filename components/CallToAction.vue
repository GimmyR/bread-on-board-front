<template>
  <div class="container-fluid container-lg" id="call-to-action">
    <p class="col-12 col-lg-7 mx-auto text-center text-light fs-5 text-shadow">Bread on Board est une application web qui permet de consulter des recettes de cuisine mais également d'en créer.</p>
    <form class="col-10 col-lg-6 mx-auto" @submit.prevent="validate">
      <div class="input-group">
        <input type="text" class="form-control" placeholder="Nouvelle recette" v-model="title">
        <button type="submit"class="btn btn-success col-3 col-lg-2">Créer</button>
      </div>
    </form>
  </div>
</template>

<script lang="ts" setup>
  import '~/assets/css/CallToAction.css';
import Create from '~/pages/recipe/create.vue';

  const title = ref("");
  const router = useRouter();

  const validate = () => {
    localStorage.setItem("title-for-create", title.value);
    router.push({ path: "/recipe/create" });
  };
</script>