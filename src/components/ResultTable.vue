<script lang="ts">
import ResultEntry from './ResultEntry.vue';

export default {
    props: {
        entries: Object
    },
    components: { ResultEntry }
}
</script>

<template>
    <div class="py-3 my-5 rounded bg-body-tertiary">
        <table class="table">
            <thead>
                <tr>
                    <th scope="col">Id</th>
                    <th scope="col">GC</th>
                    <th scope="col">Contigs</th>
                    <th scope="col">Name</th>
                </tr>

            </thead>
            <tbody>
                <tr v-for="entry in entries" :key="entry.id">
                    <ResultEntry :entry="entry" />
                </tr>
            </tbody>
        </table>
    </div>
</template>

<style></style>