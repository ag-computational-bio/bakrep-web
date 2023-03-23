<script setup lang="ts">
import Pane from "../components/Pane.vue";

let props = defineProps({ 
  id: { type: String, required: true }, 
  title: { type: String, required: false } 
})

</script>

<template>
  <main class="container pt-5">
    <div class="row">
      <h3>{{ title }}</h3>
    </div>
    <div class="row">
      <Pane :items="['Annotation', 'Taxonomy', 'Quality Control']" :action="{title: 'Download', link:'TBD'}">
        <template v-slot="Annotation">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptates ex quidem tempora laudantium? Veniam, quam, labore sit quae accusamus praesentium adipisci illo at eius corrupti nulla rem quod, eos nesciunt!
        </template>
      </Pane>
    </div>
  </main>
</template>

<style>
</style>