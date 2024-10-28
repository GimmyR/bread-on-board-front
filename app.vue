<template>
  <div>
    <NuxtLoadingIndicator/>
    <NuxtRouteAnnouncer />
    <Header/>
    <NuxtPage />
  </div>
</template>

<style>
  body {
    background-image: url('~/assets/img/background-kitchen.jpg');
    background-repeat: no-repeat;
    background-size: cover;
    background-position: center;
  }

  .page-enter-active,
  .page-leave-active {
    transition: all 0.4s;
  }
  .page-enter-from,
  .page-leave-to {
    opacity: 0;
    filter: blur(1rem);
  }
</style>