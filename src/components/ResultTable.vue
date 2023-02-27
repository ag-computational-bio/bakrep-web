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
        <table class="table table-hover">
            <thead>
                <tr>
                    <th scope="col">Id</th>
                    <th scope="col">GC</th>
                    <th scope="col">Contigs</th>
                    <th scope="col">Name</th>
                </tr>

            </thead>
            <tbody>
                <ResultEntry v-for="entry in entries" :key="entry.id" :entry="entry" />
            </tbody>
        </table>
    </div>
</template>

<style></style>