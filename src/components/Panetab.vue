<script setup lang="ts">
let props = defineProps({
    name: { type: String, required: true },
    active: { type: Boolean, required: false }
})

let title = props.name.charAt(0).toLocaleUpperCase() + props.name.slice(1)
</script>

<template>
    <li class="nav-item">
        <a class="nav-link" :class="{active}" href="#">{{ title }}</a>
    </li>
</template> 