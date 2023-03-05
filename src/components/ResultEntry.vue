<script lang="ts">

export default {
    props: {
        entry: Object
    },
    methods: {
        showResult(entry: object) {
            this.$router.push({
                name: 'result',
                params: { 
                    id: entry.id,
                    title: entry.Name
                }
            });
        }
    }
}
</script>

<template>
    <tr @click="showResult(entry)" class="pointer">
        <td scope="row">{{ entry.id }}</td>
        <td>{{ entry.GC }}</td>
        <td>{{ entry.Contigs }}</td>
        <td>{{ entry.Name }}</td>
    </tr>
</template>

<style>
.pointer { cursor: pointer; }
</style>