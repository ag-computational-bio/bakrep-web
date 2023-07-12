<script setup lang="ts">
import { ref } from 'vue';
import Panetab from './Panetab.vue';

type Action = {
    title: string
    href: object
}

let props = defineProps({
    items: { type: Array<String>, required: true },
    action: { type: Object, required: true }
})

let active = ref(props.items[0])

</script>

<template>
    <!-- Tabbed Navigation -->
    <div class="shadow-sm p-4">
        <ul class="nav nav-pills">
            <Panetab @click="active = item" :name="item" :active="active == item" v-for="item in items" />
            <li class="ms-auto" v-if="action">
                <!-- @TODO: Figure out how to directly download an entry, json? -->
                <a class="btn btn-primary" href="#">{{ action.title }}</a>
            </li>
        </ul>
        <div class="tab-content">
            <div class="tab-pane" :class="{ 'active': active === item}" v-for="item in items">
                <slot :name=item></slot>
            </div>
        </div>
    </div>
</template> 