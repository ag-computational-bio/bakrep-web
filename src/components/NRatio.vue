<script setup lang="ts">

let props = defineProps({
    value: { type: Number, required: true },
});

let parts = props.value.toExponential(3).split('e')

let factor = parts[0]
let exponent = Number(parts[1])
</script>
  
<template>
    {{ factor }} x 10<sup class="p-1">{{ exponent }}</sup>
</template>
