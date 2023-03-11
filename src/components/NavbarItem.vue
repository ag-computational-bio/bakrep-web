<script lang="ts">
export default {
    props: {
        link: { type: String, required: true },
        text: String
    }
}
</script>

<template>
    <li>
        <router-link class="nav-link" :to="link">{{ text }}</router-link>
    </li>
</template>

<style></style>