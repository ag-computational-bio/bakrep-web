<template>
  <div class="grid-table">
    <slot></slot>
  </div>
</template>
<style lang="css">
.grid-table {
  display: grid;
  grid-template-columns: minmax(min-content, 1fr) 1fr;
  width: 100%;
  min-width: min-content;
}

.grid-cell {
  padding-left: 0.3rem;
  padding-right: 0.3rem;
  padding-top: 0.075rem;
  padding-bottom: 0.075rem;
}
</style>
