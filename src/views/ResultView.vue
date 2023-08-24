<script setup lang="ts">
import { getDatasetById, getReference } from "../Api";
import { onMounted, ref } from "vue";
import Loading from "../components/Loading.vue";
import ContigBar from "../components/ContigBar.vue";
import Pane from "../components/Pane.vue";
import usePageState from "../PageState";
import { State } from "../PageState";
import Modal from "../components/Modal.vue";
import NRatio from "@/components/NRatio.vue";


let props = defineProps({
  id: { type: String, required: true },
  title: { type: String, required: false }
});

let dataset = ref();
let annotation = ref();
let taxonomy = ref();

let featureTable = ref(true);
let toggle = ref({
  'annotation': true,
  'taxonomy': true,
  'checkm': true
});

let active_tab = ref("")

let state = usePageState();
state.value.setState(State.Loading);

let showRefModal = ref<number | null>()

let showActionModal = ref(false)

function ratioToPercentage(value: number) {
  return Math.round(value * 10000) / 100 + '%'
}

function renameContig(contig: string): number {
  // SAMD00000344.contig00001
  // 1
  return Number(contig.split('contig')[1])
}


// from: https://script.google.com/home/projects/1J_I0Vcmz_mSsKurJnYQPmFo-9c2h5DILVCVGY90KPgygfH4ngszi83is/edit?pli=1
// Calculates significant figures with suffixes K/M/B/T, e.g. 1234 = 1.23K
function sigfig(num: number, sigfigs_opt?: number) {
  // Set default sigfigs to 3
  sigfigs_opt = (typeof sigfigs_opt === "undefined") ? 3 : sigfigs_opt;
  // Only assigns sig figs and suffixes for numbers > 1
  if (num <= 1) return num.toPrecision(sigfigs_opt);
  // Calculate for numbers > 1
  var power10 = log10(num);
  var power10ceiling = Math.floor(power10) + 1;
  // 0 = '', 1 = 'K', 2 = 'M', 3 = 'B', 4 = 'T'
  var SUFFIXES = ['', 'K', 'M', 'B', 'T'];
  // 100: power10 = 2, suffixNum = 0, suffix = ''
  // 1000: power10 = 3, suffixNum = 1, suffix = 'K'
  var suffixNum = Math.floor(power10 / 3);
  var suffix = SUFFIXES[suffixNum];
  // Would be 1 for '', 1000 for 'K', 1000000 for 'M', etc.
  var suffixPower10 = Math.pow(10, suffixNum * 3);
  var base = num / suffixPower10;
  var baseRound = base.toPrecision(sigfigs_opt);
  return baseRound + suffix;
}

function log10(num: number) {
  // Per http://stackoverflow.com/questions/3019278/how-can-i-specify-the-base-for-math-log-in-javascript#comment29970629_16868744
  // Handles floating-point errors log10(1000) otherwise fails at (2.99999996)
  return (Math.round(Math.log(num) / Math.LN10 * 1e6) / 1e6);
}

function position(start: number, end: number) {
  let start_string = sigfig(start);
  let end_string = sigfig(end);

  return `${start_string} - ${end_string}`
}

getDatasetById(props.id)
  .then((res: Dataset) => {
    res.results.forEach((result: Result) => {
      if (result.attributes.type == 'annotation') {
        annotation.value = result
      } else if (result.attributes.type == 'taxonomy') {
        taxonomy.value = result
      }
    })
    dataset.value = res;
    return res;
  })
  .then(() => state.value.setState(State.Main));

</script>

<template>
  <main class="container">
    <div class="row">
      <h2>Dataset: </h2>
    </div>

    <Loading :state="state">
      <template v-slot:loading>
        Loading
      </template>
      <template v-slot:content>
        <Pane :action="{ 'title': 'Download' }" :items="['summary', 'annotation', 'taxonomy']" :value="active_tab"
          @update:value="newValue => active_tab = newValue">
          <template v-if="active_tab == 'summary'">
            <div class="col-4">
              <table class="table">
                <tr>
                  <th scope="row">Genus</th>
                  <td>{{ annotation.data.genome.genus }}</td>
                </tr>
                <tr>
                  <th scope="row">Species</th>
                  <td>{{ annotation.data.genome.species }}</td>
                </tr>
                <tr>
                  <th scope="row">Strain</th>
                  <td>{{ annotation.data.genome.strain }}</td>
                </tr>
                <tr>
                  <th scope="row">Complete</th>
                  <td>{{ annotation.data.genome.complete }}</td>
                </tr>
                <tr>
                  <th scope="row">Gram</th>
                  <td>{{ annotation.data.genome.gram }}</td>
                </tr>
                <tr>
                  <th scope="row">Translation Table</th>
                  <td>{{ annotation.data.genome.translation_table }}</td>
                </tr>
                <tr>
                  <th scope="row">No Sequences</th>
                  <td>{{ annotation.data.stats.no_sequences }}</td>
                </tr>
                <tr>
                  <th scope="row">Size</th>
                  <td>{{ annotation.data.stats.size }}</td>
                </tr>
                <tr>
                  <th scope="row">GC Ratio</th>
                  <td>{{ ratioToPercentage(annotation.data.stats.gc) }}</td>
                </tr>
                <tr>
                  <th scope="row">n Ratio</th>
                  <td>
                    <NRatio :value="annotation.data.stats.n_ratio"></NRatio>
                  </td>
                </tr>
                <tr>
                  <th scope="row">n50</th>
                  <td>{{ annotation.data.stats.n50 }}</td>
                </tr>
                <tr>
                  <th scope="row">Coding Ratio</th>
                  <td>{{ ratioToPercentage(annotation.data.stats.coding_ratio) }}</td>
                </tr>
              </table>
            </div>
          </template>
          <template v-if="active_tab == 'annotation'">
            <!-- <div class="h5" @click="toggle.annotation = !toggle.annotation"><i class="bi"
                :class="toggle.annotation ? 'bi-caret-down' : 'bi-caret-right'"></i>Annotation</div> -->
            <div v-if="toggle.annotation">
              <table class="table">
                <tr>
                  <th>Genus</th>
                  <td>{{ annotation.data.genome.genus }}</td>
                </tr>
                <tr>
                  <th>Species</th>
                  <td>{{ annotation.data.genome.species }}</td>
                </tr>
                <tr>
                  <th>Strain</th>
                  <td>{{ annotation.data.genome.strain }}</td>
                </tr>
                <tr>
                  <th>Complete</th>
                  <td>{{ annotation.data.genome.complete }}</td>
                </tr>
                <tr>
                  <th>Gram</th>
                  <td>{{ annotation.data.genome.gram }}</td>
                </tr>
                <tr>
                  <th>Translation Table</th>
                  <td>{{ annotation.data.genome.translation_table }}</td>
                </tr>
                <tr>
                  <th>No Sequences</th>
                  <td>{{ annotation.data.stats.no_sequences }}</td>
                </tr>
                <tr>
                  <th>Size</th>
                  <td>{{ annotation.data.stats.size }}</td>
                </tr>
                <tr>
                  <th>GC Ratio</th>
                  <td>{{ ratioToPercentage(annotation.data.stats.gc) }}</td>
                </tr>
                <tr>
                  <th>n Ratio</th>
                  <td>
                    <NRatio :value="annotation.data.stats.n_ratio"></NRatio>
                  </td>
                </tr>
                <tr>
                  <th>n50</th>
                  <td>{{ annotation.data.stats.n50 }}</td>
                </tr>
                <tr>
                  <th>Coding Ratio</th>
                  <td>{{ ratioToPercentage(annotation.data.stats.coding_ratio) }}</td>
                </tr>
              </table>
              <h3>Contig Lengths:</h3>
              <div>
                <ContigBar :sequences="annotation.data.sequences" :length="annotation.data.stats.size"
                  :n50="annotation.data.stats.n50">
                </ContigBar>
              </div>

              <button class="my-4 btn btn-primary" @click="featureTable = !featureTable">
                <template v-if="featureTable">
                  Hide Table
                </template>
                <template v-else>
                  Show Table
                </template>
              </button>
              <table class="table" v-if="featureTable">
                <!-- <thead>
                  <th>contig</th>
                  <th>length</th>
                  <th>X-Refs</th>
                  <th>Details</th>
                </thead> -->
                <thead>
                  <th>Contig</th>
                  <th>Start</th>
                  <th>End</th>
                  <th>Type</th>
                  <th>Gene</th>
                  <th>Product</th>
                  <th>X-Refs</th>
                </thead>
                <tr v-for="(feature, index) in annotation.data.features">
                  <td>{{ renameContig(feature.contig) }}</td>
                  <td class="text-nowrap">{{ sigfig(feature.start, 2) }}</td>
                  <td class="text-nowrap">{{ sigfig(feature.stop, 2) }}</td>
                  <td>{{ feature.product }}</td>
                  <td>
                    <div class="bg-light btn py-2 rounded text-dark" id="show-modal" @click="showRefModal = index">Refs
                    </div>
                    <Modal v-if="showRefModal == index" @close="showRefModal = null">
                      <template v-slot:header>
                        <h2>References</h2>
                      </template>
                      <template v-slot:body>
                        <ul>
                          <li v-for="ref in feature.db_xrefs"><a
                              :href="getReference(ref).then((ref) => { return ref[0].locations.html[0] })"
                              target="_blank">{{ ref }}</a></li>
                        </ul>
                      </template>
                    </Modal>
                  </td>
                </tr>
              </table>
            </div>
          </template>
          <template v-if="active_tab == 'taxonomy'">
            <!-- <div class="h5" @click="toggle.taxonomy = !toggle.taxonomy"><i class="bi"
                :class="toggle.taxonomy ? 'bi-caret-down' : 'bi-caret-right'"></i>Taxonomy</div> -->
            <div v-if="toggle.taxonomy">
              <div>
                <span class="fw-bold">GTDB Tree:</span>
                <div v-for="(entry, index) in taxonomy.data.classification.split(';')">
                  <a :style="{ 'margin-left': (index * 5) + 'px' }"
                    :href="'https://gtdb.ecogenomic.org/tree?r=' + entry">{{
                      entry }};</a>
                </div>
              </div>
              <div>
                <table class="table">
                  <tr>
                    <th>Fastani</th>
                    <td>{{ taxonomy.data.fastani_reference }}</td>
                  </tr>
                  <tr>
                    <th>Classification Method:</th>
                    <td>{{ taxonomy.data.classification_method }}</td>
                  </tr>
                </table>
              </div>

              <div class="warning">
                <template v-if="taxonomy.data.warning != 'NaN'">
                  {{ taxonomy.data.warning }}
                </template>
              </div>
            </div>
          </template>
          <template v-slot:action>
            <div class="btn btn-primary ms-auto" @click="showActionModal = true">
              Download
            </div>
            <Modal v-if="showActionModal == true" @close="showActionModal = false">
              <template v-slot:header>
                <h2>Download Dataset</h2>
              </template>
              <template v-slot:body>
                  <ul>
                    <li>Link to One</li>
                    <li>Link to Two
                    </li>
                    <li>Link to Three</li>
                    <li>Link to All?</li>
                  </ul>
              </template>
            </Modal>
          </template>
        </Pane>
      </template>
    </Loading>
</main></template>