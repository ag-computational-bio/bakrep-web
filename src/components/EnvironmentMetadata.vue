<script setup lang="ts">
import type { PropType } from "vue";
import { type Environment } from "@/model/Environment";

defineProps({
  environment: { type: Object as PropType<Environment>, required: true },
});
</script>

<template>
  <div class="container-full py-2">
    <div>
      <div class="fw-bold">Biome:</div>
      <div>{{ environment.biome }}</div>
    </div>
    <div>
      <div class="fw-bold">Feature:</div>
      <div>{{ environment.feature }}</div>
    </div>
    <div>
      <div class="fw-bold">Material:</div>
      <div>
        {{ environment.material }}
      </div>
    </div>
  </div>
</template>
