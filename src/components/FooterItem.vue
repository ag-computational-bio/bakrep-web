<script lang="ts">
export default {
    props: {
        link: { type: String, required: true },
        title: String
    }
}
</script>

<template>
    <li class="navitem">
        <router-link class="nav-link px-2 text-muted" :to="link">{{ title }}</router-link>
    </li>
</template>

<style></style>