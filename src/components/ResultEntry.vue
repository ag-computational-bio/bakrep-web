<script lang="ts">

export default {
    props: {
        entry: Object
    },
    methods: {
        showResult(resultId: String) {
            this.$router.push({
                name: 'result',
                params: { id: resultId}
            });
        }
    }
}
</script>

<template>
    <tr @click="showResult(entry.id)" class="pointer">
        <td scope="row">{{ entry.id }}</td>
        <td>{{ entry.GC }}</td>
        <td>{{ entry.Contigs }}</td>
        <td>{{ entry.Name }}</td>
    </tr>
</template>

<style>
.pointer { cursor: pointer; }
</style>