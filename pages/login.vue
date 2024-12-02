<template>
  <div class="container-fluid container-lg pt-5">
    <div class="d-flex flex-row justify-content-center">
      <form @submit.prevent="logIn" class="d-flex flex-column align-items-center col-12 col-lg-8 mt-5 py-5 px-3 px-lg-0 bg-light">
        <h1 class="text-success mb-5">Connexion</h1>
        <Transition name="alert">
          <div class="alert alert-danger col-12 col-lg-6 mb-4" role="alert" v-if="errorMessage != null">
            {{ errorMessage }}
          </div>
        </Transition>
        <div class="col-12 col-lg-6 mb-3">
          <InputLogin type="text" v-model="account.username" placeholder="Nom d'utilisateur" icon="person" />
        </div>
        <div class="col-12 col-lg-6 mb-4">
          <InputLogin type="password" v-model="account.password" placeholder="Mots de passe" icon="lock" />
        </div>
        <div class="d-flex flex-column col-12 col-lg-6 mb-5">
          <button type="submit" class="btn btn-success mb-2">Se connecter</button>
          <button type="button" class="btn btn-dark" @click="signUp">S'inscrire</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
  import '~/assets/css/login.css';

  useSeoMeta({
    title: 'Connexion - Bread on Board'
  });

  const account = ref({
    username: '',
    password: ''
  });

  const errorMessage = ref(null);

  const jwtPayload = useState("jwt-payload");
  const router = useRouter();
  const appConfig = useAppConfig();

  const logIn = () => {
    let form = new FormData();
    form.append("username", account.value.username);
    form.append("password", account.value.password);

    $fetch(appConfig.apiURL + "/api/account/log-in", {
      method: 'POST',
      body: form,
      onResponse({ request, response, options }) {
        if(response.status == 200) {
          localStorage.setItem("access-token", response._data);
          decodeJwtPayload(response._data, jwtPayload);
          router.back();
        } else errorMessage.value = response._data;
      }
    });
  };

  const signUp = () => {
    router.push("#");
  };
</script>