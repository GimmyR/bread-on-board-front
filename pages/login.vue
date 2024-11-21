<template>
  <div class="container-fluid container-lg pt-5">
    <div class="d-flex flex-row justify-content-center">
      <form @submit.prevent="logIn" class="d-flex flex-column align-items-center col-12 col-lg-8 mt-5 py-5 px-3 px-lg-0 bg-light">
        <Transition name="alert">
          <div class="alert alert-danger col-12 col-lg-6 mb-4" role="alert" v-if="errorMessage != null">
            {{ errorMessage }}
          </div>
        </Transition>
        <div class="col-12 col-lg-6 mb-3">
          <label for="username" class="form-label text-success">Nom d'utilisateur</label>
          <input type="text" class="form-control" v-model="account.username"/>
        </div>
        <div class="col-12 col-lg-6 mb-4">
          <label for="password" class="form-label text-success">Mots de passe</label>
          <input type="password" class="form-control" v-model="account.password"/>
        </div>
        <div class="d-flex flex-row col-12 col-lg-6 justify-content-end">
          <button type="submit" class="btn btn-success col-12 col-lg-5">Se connecter</button>
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

  const logIn = () => {
    let form = new FormData();
    form.append("username", account.value.username);
    form.append("password", account.value.password);

    $fetch("http://localhost:9001/api/account/log-in", {
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
</script>