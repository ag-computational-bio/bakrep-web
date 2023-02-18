<script setup lang="ts">
import FooterItem from './FooterItem.vue'
</script>

<template>
    <div class="container">
        <footer class="py-3 my-3">
            <ul class="nav pb-3 mb-3 justify-content-center border-bottom">
                <FooterItem link="/" title="Home" />
                <FooterItem link="/about" title="About" />
                <FooterItem link="/imprint" title="Imprint" />
            </ul>
            <p class="text-center text-muted">
                2023 - Bakta
            </p>
        </footer>
    </div>
</template>