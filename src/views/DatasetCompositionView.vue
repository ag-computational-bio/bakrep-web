<template>
  <div class="d-flex justify-content-center mb-2">
    <ul class="nav nav-pills">
      <li class="nav-item">
        <button
          class="nav-link"
          :class="panel == 'main' ? 'active' : ''"
          @click="panel = 'main'"
        >
          Show species with more than 6000 entries
        </button>
      </li>
      <li class="nav-item">
        <button
          class="nav-link"
          :class="panel == 'sub' ? 'active' : ''"
          @click="panel = 'sub'"
        >
          Show species with 400 to 6000 entries
        </button>
      </li>
    </ul>
  </div>
  <div class="w-100 full-height">
    <iframe :src="file" class="w-100 full-height" />
  </div>
</template>
<script setup lang="ts">
import { computed, ref } from "vue";

const panel = ref<"main" | "sub">("main");
const file = computed(() => `/krona_${panel.value}.html`);
</script>
