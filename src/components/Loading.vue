<template>
  <template v-if="state.loading">
    <slot name="loading"/>
  </template>
  <template v-else>
    <slot name="content"/>
  </template>
</template>
<script lang="ts">
import { defineComponent, type PropType } from "vue";
import type { PageState } from "../PageState";
// import CenteredLargeSpinner from "@/components/basic/CenteredLargeSpinner.vue";

export default defineComponent({
  // components: { CenteredLargeSpinner },
  props: {
    state: { type: Object as PropType<PageState>, default: () => null },
  },
});
</script>
