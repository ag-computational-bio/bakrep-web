<script lang="ts">
export default {
    props: {
        link: { type: String, required: true },
        title: String
    }
}
</script>

<template>
    <li>
        <router-link class="nav-link" :to="link">{{ title }}</router-link>
    </li>
</template>

<style></style>