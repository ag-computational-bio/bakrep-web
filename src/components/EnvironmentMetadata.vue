<script setup lang="ts">
import type { PropType } from "vue";
import { type Environment } from "@/model/Metadata";

defineProps({
  environment: { type: Object as PropType<Environment>, required: true },
});
</script>

<template>
  <tr class="ps-2">
    <th class="text-end">Biome:</th>
    <td class="ps-5" v-if="environment.biome">
      {{ environment.biome }}
    </td>
    <td class="ps-5" v-else>?</td>
  </tr>
  <tr>
    <th class="text-end">Feature:</th>
    <td class="ps-5" v-if="environment.feature">
      {{ environment.feature }}
    </td>
    <td class="ps-5" v-else>?</td>
  </tr>
  <tr>
    <th class="text-end">Material:</th>
    <td class="ps-5" v-if="environment.material">
      {{ environment.material }}
    </td>
    <td class="ps-5" v-else>?</td>
  </tr>
</template>

<style scoped>
th {
  font-weight: normal;
}
</style>
