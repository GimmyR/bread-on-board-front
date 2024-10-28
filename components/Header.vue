<template>
  <nav class="navbar navbar-expand bg-turquoise">
    <div class="container-fluid-md container">
      <a class="navbar-brand text-light fw-bold" href="#">Bread on Board</a>
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
            <NavIcon to="#" title="Créer une recette" icon="plus-lg"/>
          </li>
          <li class="nav-item">
            <NavIcon to="#" title="Connexion" icon="person-circle"/>
          </li>
        </ul>
      </div>
    </div>
  </nav>
  <SearchModal/>
</template>

<script lang="ts" setup>
  import '~/assets/css/Header.css';
</script>