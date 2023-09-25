<script setup lang="ts">
import { onMounted, ref } from "vue";
import { RouterView } from "vue-router";
import Footer from "./components/Footer.vue";
import Navbar from "./components/Navbar.vue";

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

  <div id="content" class="pb-5">
    <RouterView />
  </div>

  <Footer />
</template>
