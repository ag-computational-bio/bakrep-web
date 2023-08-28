<template>
  <table class="table">
    <thead>
      <th>Contig</th>
      <th>Start</th>
      <th>Stop</th>
      <th>Product</th>
      <th>X-Refs</th>
    </thead>
    <tr v-for="(feature, index) in features" :key="index">
      <td>{{ renameContig(feature.contig) }}</td>
      <td class="text-nowrap">{{ feature.start }}</td>
      <td class="text-nowrap">{{ feature.stop }}</td>
      <td>{{ feature.product }}</td>
      <td>
        <div
          class="bg-light btn py-2 rounded text-dark"
          id="show-modal"
          @click="showRefModal = index"
        >
          Refs
        </div>
        <Modal v-if="showRefModal == index" @close="showRefModal = null">
          <template v-slot:header>
            <h2>References</h2>
          </template>
          <template v-slot:body>
            <ul>
              <li v-for="ref in feature.db_xrefs" :key="ref">
                <a :href="dbxrefapi.redirectUrl(ref)" target="_blank">{{
                  ref
                }}</a>
              </li>
            </ul>
          </template>
        </Modal>
      </td>
    </tr>
  </table>
</template>
<script setup lang="ts">
import { useDbxrefApi } from "@/DbxrefApi";
import Modal from "@/components/Modal.vue";
import type { Feature } from "@/model/BaktaResults";
import { sigfig } from "@/util";
import type { PropType } from "vue";
import { ref } from "vue";
defineProps({
  features: { type: Array as PropType<Feature[]>, default: () => [] },
});
const dbxrefapi = useDbxrefApi();

const showRefModal = ref<number | null>();
function renameContig(contig: string): number {
  // SAMD00000344.contig00001
  // 1
  return Number(contig.split("contig")[1]);
}
</script>
