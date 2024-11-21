<template>
  <nav class="navbar fixed-top navbar-expand bg-success">
    <div class="container-fluid-md container">
      <NuxtLink class="navbar-brand text-light fw-bold" to="/">Bread on Board</NuxtLink>
        <b-button color="outline-light" toggle="modal" target="#searchModal" class="col-lg-4 text-start btn-search d-none d-lg-block">
          <BIcon icon="bi:search"/> Chercher
        </b-button>
      <div>
        <ul class="navbar-nav">
          <li class="nav-item d-lg-none">
            <b-button color="outline-light" toggle="modal" target="#searchModal" class="border-0 pt-2 btn-search">
              <BIcon icon="bi:search"/>
            </b-button>
          </li>
          <li class="nav-item">
            <NavIcon to="/recipe/create" title="Créer une recette" icon="plus-lg"/>
          </li>
          <li class="nav-item">
            <template v-if="jwtPayload == null">
              <NavIcon to="/login" title="Connexion" icon="person-circle"/>
            </template>
            <template v-else>
              <NavIcon to="#" :title="jwtPayload.sub" icon="person-circle" @click="logOut"/>
            </template>
          </li>
        </ul>
      </div>
    </div>
  </nav>
  <SearchModal/>
</template>

<script setup>
  import '~/assets/css/Header.css';

  const jwtPayload = useState("jwt-payload", () => null);

  const logOut = () => {
    localStorage.removeItem("access-token");
    jwtPayload.value = null;
  };

  onMounted(() => {
    decodeJwtPayload(localStorage.getItem("access-token"), jwtPayload);
  });
</script>