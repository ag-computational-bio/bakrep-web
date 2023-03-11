<script lang="ts">

export default {
    props: {
        entries: Object
    },
}
</script>

<template>
    <div class="py-3 my-5 rounded bg-light shadow-sm">
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
                <template v-for="entry in entries" :key="entry.id" :entry="entry">
                    <tr @click="$router.push({ name: 'result', params: { id: entry.id, title: entry.Name }});" class="pointer">
                        <td scope="row">{{ entry.id }}</td>
                        <td>{{ entry.GC }}</td>
                        <td>{{ entry.Contigs }}</td>
                        <td>{{ entry.Name }}</td>
                    </tr>
                </template>
            </tbody>
        </table>
    </div>
</template>

<style>
.pointer { cursor: pointer; }
</style>