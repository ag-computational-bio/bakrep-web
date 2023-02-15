<script setup lang="ts">
import { RouterLink, RouterView } from "vue-router";
import Navbar from "./components/Navbar.vue";
import { ref } from 'vue';
const theme = ref(window.matchMedia("(prefers-color-scheme: dark)").matches ? 'dark' : 'light')
</script>

<template>
  <div :data-bs-theme="theme">
    <Navbar />
    <RouterView />
  </div>
</template>

<style scoped>

</style>
