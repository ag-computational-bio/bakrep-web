<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import Panetab from './Panetab.vue';

type Action = {
    title: string
    href: object
}

let props = defineProps({
    items: { type: Array<string>, required: true },
    action: { type: Object, required: true }
})


const emits = defineEmits(['update:value'])

let value = ref(props.items[0])

onMounted(() => {
    emits('update:value', value)
})

</script>

<template>
    <!-- Tabbed Navigation -->
    <div class="shadow-sm p-4">
        <ul class="nav nav-pills py-3">
            <Panetab @click="value = item; $emit('update:value', item)" :name="item" :active="value == item"
                v-for="item in items" />

            <slot name="action">
                <li class="ms-auto" v-if="action">
                    <!-- @TODO: Figure out how to directly download an entry, json? -->
                    <a class="btn btn-primary" href="#">{{ action.title }}</a>
                </li>
            </slot>
        </ul>
        <div class="tab-content">
            <div class="tab-pane" :class="{ 'active': value === item }" v-for="item in items">
                <slot></slot>
            </div>
        </div>
    </div>
</template> 