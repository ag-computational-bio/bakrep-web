<script lang="ts">
import Pane from "../components/Pane.vue";
import PaneTab from "../components/Panetab.vue";
export default {
  props: ["id", "title"],
  components: { Pane, PaneTab }
}
</script>

<template>
  <main class="container pt-5">
    <div class="row">
      <h3>{{ title }}</h3>
    </div>
    <div class="row">
      <Pane :items="['Annotation', 'Taxonomy', 'Quality Control']" :action="{title: 'Download', link:'TBD'}" />
    </div>
  </main>
</template>

<style>
main {
  min-height: 100vh;
}
</style>