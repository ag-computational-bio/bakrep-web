<script setup lang="ts">
type SearchResultEntry = {
    id: string
    GC: number
    Contigs: number
    Length: number
    Name: string
}

defineProps({
    entries: Array as PropType<SearchResultEntry>
})

</script>

<template>
    <div class="rounded bg-light shadow-sm">
        <table class="table table-hover">
            <thead>
                <tr>
                    <th scope="col">Id</th>
                    <th scope="col">GC</th>
                    <th scope="col">Contigs</th>
                    <th scope="col">Length</th>
                    <th scope="col">Name</th>
                </tr>

            </thead>
            <tbody>
                <template v-for="entry in entries" :key="entry.id" :entry="entry">
                    <tr @click="$router.push({ name: 'result', params: { id: entry.id, title: entry.Name }});" class="pointer">
                        <td scope="row">{{ entry.id }}</td>
                        <td>{{ entry.GC * 100 + '%'}}</td>
                        <td>{{ entry.Contigs }}</td>
                        <td>{{ entry.Length }}</td>
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