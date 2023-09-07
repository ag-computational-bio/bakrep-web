<script setup lang="ts">
import { RouterLink, RouterView } from "vue-router";
import Navbar from "./components/Navbar.vue";
import Footer from "./components/Footer.vue";
import { ref } from "vue";
import { onMounted } from "vue";

const theme = ref(
  window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light",
);
const element = document.getElementById("root");

onMounted(() => {
  if (element) {
    element.dataset.bsTheme = theme.value;
  }
});
</script>

<template>
  <Navbar />

  <div id="content" class="">
    <RouterView />
  </div>

  <Footer class="" />
</template>

<style>
#content {
  margin-top: calc(80px + 1rem);
  min-height: calc(100vh - 200px - 80px - 1rem);
}
</style>
