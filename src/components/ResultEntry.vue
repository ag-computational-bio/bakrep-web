<script lang="ts">

export default {
    props: {
        entry: Object
    },
}
</script>

<template>
    <td scope="row">{{ entry.id }}</td>
    <td>{{ entry.GC }}</td>
    <td>{{ entry.Contigs }}</td>
    <td>{{ entry.Name }}</td>
</template>

<style>

</style>