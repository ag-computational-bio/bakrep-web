<script setup lang="ts">
import { RouterLink, RouterView } from "vue-router";
import Navbar from "./components/Navbar.vue";
import Footer from "./components/Footer.vue";
import { ref } from 'vue';
import { onMounted } from "vue";

const theme = ref(window.matchMedia("(prefers-color-scheme: dark)").matches ? 'dark' : 'light')
const element = document.getElementById("root")

onMounted(() => {
  if (element) {
    element.dataset.bsTheme = theme.value
  }
})

</script>

<template>
  <Navbar />

  <div id="content" class="mt-5 min-vh-100 pt-5">
    <RouterView />
  </div>

  <Footer class="mt-5" />

</template>

<style>
</style>
