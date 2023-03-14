<script setup lang="ts">
import { ref } from 'vue';
import Panetab from './Panetab.vue';

let props = defineProps({
    items: { type: Object, required: true },
    action: { type: Object, required: false }
})

let active = ref(props.items[0])

function isActive(item: Object) {
    return active === item
}
</script>

<template>
    <!-- Tabbed Navigation -->
    <div class="shadow-sm">
        <ul class="nav nav-tabs">
            <Panetab @click="active = item" :name="item" :active="isActive(item)" v-for="item in items" />
            <li class="ms-auto" v-if="action">
                <!-- @TODO: Figure out how to directly download an entry, json? -->
                <a class="btn btn-primary" href="#">{{ action.title }}</a>
            </li>
        </ul>
        <div class="tab-content">
            <div class="tab-pane" :class="{ active: isActive(item)}" v-for="item in items">
                <slot :name=item></slot>
            </div>
        </div>
    </div>

    <!-- Tabbed Content -->
</template> 