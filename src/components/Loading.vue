<template>
  <template v-if="state.loading">
    <slot name="loading">
      <CenteredLargeSpinner />
    </slot>
  </template>
  <template v-else-if="state.error">
    <div class="alert alert-danger">Error: {{ state.message }}</div>
  </template>
  <template v-else>
    <slot name="content" />
    <slot />
  </template>
</template>
<script lang="ts">
import { defineComponent, type PropType } from "vue";
import type { PageState } from "../PageState";
import CenteredLargeSpinner from "./CenteredLargeSpinner.vue";

export default defineComponent({
  props: {
    state: { type: Object as PropType<PageState>, default: () => null },
  },
  components: { CenteredLargeSpinner },
});
</script>
