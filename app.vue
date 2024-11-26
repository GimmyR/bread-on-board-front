<template>
  <div>
    <NuxtLoadingIndicator color="#27AAFF"/>
    <NuxtRouteAnnouncer />
    <Header/>
    <NuxtPage :keepalive="true" />
  </div>
</template>

<script setup>
  import '~/assets/css/app.css';
</script>