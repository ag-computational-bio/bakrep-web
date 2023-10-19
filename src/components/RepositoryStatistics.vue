<template>
  <table class="w-75">
    <tr>
      <th scope="row">Datasets:</th>
      <td>{{ datasets }}</td>
    </tr>
    <tr>
      <th scope="row">Genera:</th>
      <td>{{ genera }}</td>
    </tr>
    <tr>
      <th scope="row">Species:</th>
      <td>{{ species }}</td>
    </tr>
  </table>
</template>

<script setup lang="ts">
defineProps({
  datasets: { type: Number, required: true },
  genera: { type: Number, required: true },
  species: { type: Number, required: true },
});
</script>

<style scoped>
th {
  text-align: end;
}

td {
  text-align: end;
}
</style>
