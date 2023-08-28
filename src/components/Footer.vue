<script setup lang="ts">
</script>

<template>
    <div class="container">
        <footer class="py-3 my-3">
            <div class="d-flex flex-row">
                <a href="https://www.uni-giessen.de/de/fbz/fb08/Inst/bioinformatik/" target="_blank">
                    <img
                        src="@/assets/images/CB.AG_Logo.svg"
                        height="200"
                        width="350"
                    />
                </a>
                <a href="">
                    <img
                        src="@/assets/images/De.NBI_Logo.svg"
                        width="350"
                        height="160"
                    />
                </a>
                <div class="mx-5 vr"></div>
                <ul class="nav pb-3 mb-3 justify-content-center border-bottom d-flex flex-column">
                    <li class="navitem">
                        <router-link class="nav-link px-2 text-muted" to="/">Home</router-link>
                    </li>
                    <li class="navitem">
                        <router-link class="nav-link px-2 text-muted" to="/about">About</router-link>
                    </li>
                    <li class="navitem">
                        <router-link class="nav-link px-2 text-muted" to="/imprint">Imprint</router-link>
                    </li>
                </ul>
            </div>
            
            <p class="text-center text-muted">
                2023 - Bakta
            </p>
        </footer>
    </div>
</template>