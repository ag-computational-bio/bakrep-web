<script setup lang="ts">
import { ref } from 'vue';
import NavbarItem from './NavbarItem.vue';
const items = ref([
    {link: '/', title: 'Home'},
    {link: '/search', title: 'Search'},
    {link: '/about', title: 'About'}
])
</script>

<template>
    <nav class="navbar navbar-expand-lg fixed-top bg-body-tertiary navbar-scroll">
        <div class="container-fluid">
            <router-link class="navbar-brand" to="/">BakRep Web</router-link>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse"
                data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false"
                aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarSupportedContent">
                <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                    <NavbarItem :link=link :title=title v-for="{link, title} in items"/>
                </ul>
            </div>
        </div>
    </nav>
</template>

<style>

</style>