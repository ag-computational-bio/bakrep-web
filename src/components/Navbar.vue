<script setup lang="ts">
import { ref } from "vue";
const items = ref([
  { href: { name: "home" }, text: "Home" },
  { href: { name: "browse" }, text: "Browse" },
  { href: { name: "search" }, text: "Search" },
  { href: { name: "composition" }, text: "Species composition" },
  { href: { name: "about" }, text: "About" },
]);
</script>

<template>
  <nav
    class="navbar navbar-expand-lg navbar-light fixed-top bg-light navbar-scroll"
  >
    <div class="container-fluid">
      <router-link class="navbar-brand" to="/">BakRep Web</router-link>
      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarSupportedContent"
        aria-controls="navbarSupportedContent"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <ul class="navbar-nav me-auto mb-2 mb-lg-0">
          <template v-for="{ href, text } in items" :key="href">
            <li>
              <router-link class="nav-link" :to="href">{{ text }}</router-link>
            </li>
          </template>
        </ul>
        <ul class="navbar-nav">
          <!-- <li><a class="nav-link " href="https://www.microbiologyresearch.org/content/journal/mgen/10.1099/mgen.0.000685">Citation</a></li> -->
          <li>
            <a
              style="font-size: 2em"
              class="nav-link"
              href="https://github.com/ag-computational-bio/bakrep-web"
              target="_blank"
              ><i class="bi bi-github text-dark"></i
            ></a>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<style></style>
