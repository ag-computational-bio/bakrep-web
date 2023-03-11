<script lang="ts">
export default {
    props: {
        href: { type: String, required: true },
        text: String
    }
}
</script>

<template>
    <li class="navitem">
        <router-link class="nav-link px-2 text-muted" :to="href">{{ text }}</router-link>
    </li>
</template>

<style></style>