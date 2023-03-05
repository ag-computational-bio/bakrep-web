<script lang="ts">
import Panetab from './Panetab.vue';

export default {
    props: {
        items: { required: true, type: Object },
        action: { required: false, type: Object }
    },
    data() {
        return {
            active: this.items[0]
        }
    },
    components: { Panetab },
    methods: {
        isActive(item: Object) {
            return this.active === item
        }
    }
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
    </div>

    <!-- Tabbed Content -->
</template> 