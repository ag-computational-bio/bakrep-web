<script setup lang="ts">
import { onMounted, ref } from 'vue'


const props = defineProps({
    features: { type: Array<Feature>, required: true },
    length: { type: Number, required: true },
    n50: { type: Number, required: true }
})

function sortFeatures(featureList: Array<Feature>) {
    featureList.forEach((feature) => feature.length = feature.stop - feature.start)
    return featureList.sort((a, b) => a.length < b.length ? 1 : -1)
}


const randomColor = () => {
    return `rgb(${Math.floor(Math.random() * 255)} ${Math.floor(Math.random() * 255)} ${Math.floor(Math.random() * 255)})`
}

onMounted(() => {
    props.features.forEach((feature) => {
        feature.length = feature.stop - feature.start
    })
    sortFeatures(props.features)
})
</script>

<template>
    <div class="progress">
        <div v-for="feature in features" class="progress-bar" :style="{'width': (feature.length/props.length*100) + '%', 'background-color': randomColor()}"></div>
    </div>
    <div :style="{width: (n50/length) * 100+ '%'}">
        <div class="float-end bi-caret-up"></div>
    </div>
</template>

<style></style>