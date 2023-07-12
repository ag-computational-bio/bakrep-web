<script setup lang="ts">
defineProps({
    name: { type: String, required: true },
    active: { type: Boolean, required: false }
})
</script>

<template>
    <li class="nav-item">
        <a class="nav-link" :class="{active}" href="#">{{ name }}</a>
    </li>
</template> 