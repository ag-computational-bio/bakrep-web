<script lang="ts">
export default {
    props: ['id']
}
</script>

<template>
  <main class="container pt-5">
    <div class="row"> 
        does this work? {{ id }}
    </div>
  </main>
</template>

<style>
main {
  min-height: 100vh;
}
</style>