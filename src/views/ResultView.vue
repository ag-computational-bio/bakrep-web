<script setup lang="ts">
import { getDatasetById } from "../Api";
import { onMounted, ref } from "vue";
import Loading from "../components/Loading.vue";
import ContigBar from "../components/ContigBar.vue";
import Pane from "../components/Pane.vue";
import usePageState from "../PageState";
import { State } from "../PageState";
import Modal from "../components/Modal.vue"

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
let state = usePageState();
state.value.setState(State.Loading);

let showModal = ref<number | null>()
const resolve = async (ref: string): Promise<string> => {
  const response = await fetch('https://psos.computational.bio/api/v1/dbxref/resolve/' + ref, {
    mode: 'no-cors',
    headers: {
      'Access-Control-Allow-Origin': '*'
    }
  }).then((res) => {
    console.log(res)
    if (res.ok) {
      return res.json();
    } else {
      throw new Error(res.statusText);
    }
  })
  console.log(response)
  return response[0].locations.html[0];
}

onMounted(() => {
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
});

</script>

<template>
  <main class="container">
    <div class="row">
      <h2>Dataset</h2>
    </div>

    <Loading :state="state">
      <template v-slot:loading>
        Loading
      </template>
      <template v-slot:content>
        <Pane :action="{'title': 'Test'}" :items="['test', 'test2']">
          <template v-slot:test>
            <h3 class="py-3">Test</h3>
          </template>
          <template v-slot:test2>
            <h3 class="py-3">Test2</h3>
          </template>
        </Pane>
      </template>
      <template v-slot:content-old>
        <div class="row" v-for="result in dataset.results">
          <div v-if="result.attributes.type == 'annotation'">
            <div class="h5" @click="toggle.annotation = !toggle.annotation"><i class="bi"
                :class="toggle.annotation ? 'bi-caret-down' : 'bi-caret-right'"></i>Annotation</div>
            <div v-if="toggle.annotation">
              <table class="table">
                <tr>
                  <th>Genus</th>
                  <td>{{ result.data.genome.genus }}</td>
                </tr>
                <tr>
                  <th>Species</th>
                  <td>{{ result.data.genome.species }}</td>
                </tr>
                <tr>
                  <th>Strain</th>
                  <td>{{ result.data.genome.strain }}</td>
                </tr>
                <tr>
                  <th>Complete</th>
                  <td>{{ result.data.genome.complete }}</td>
                </tr>
                <tr>
                  <th>Gram</th>
                  <td>{{ result.data.genome.gram }}</td>
                </tr>
                <tr>
                  <th>Translation Table</th>
                  <td>{{ result.data.genome.translation_table }}</td>
                </tr>
              </table>

              <table class="table">
                <tr>
                  <th>No Sequences</th>
                  <td>{{ result.data.stats.no_sequences }}</td>
                </tr>
                <tr>
                  <th>Size</th>
                  <td>{{ result.data.stats.size }}</td>
                </tr>
                <tr>
                  <th>GC Ratio</th>
                  <td>{{ result.data.stats.gc }}</td>
                </tr>
                <tr>
                  <th>n Ratio</th>
                  <td>{{ result.data.stats.n_ratio }}</td>
                </tr>
                <tr>
                  <th>n50</th>
                  <td>{{ result.data.stats.n50 }}</td>
                </tr>
                <tr>
                  <th>Coding Ratio</th>
                  <td>{{ result.data.stats.coding_ratio }}</td>
                </tr>
              </table>

              <div>
                <ContigBar :features="result.data.features" :length="result.data.stats.size" :n50="result.data.stats.n50">
                </ContigBar>
              </div>

              <button class="btn btn-primary" @click="featureTable = !featureTable">
                <template v-if="featureTable">
                  Hide
                </template>
                <template v-else>
                  Show
                </template>
              </button>
              <table class="table" v-if="featureTable">
                <thead>
                  <th>Type</th>
                  <th>Contig</th>
                  <th>Start</th>
                  <th>Stop</th>
                  <th>Strand</th>
                  <th>Gene</th>
                  <th>Product</th>
                  <th>Start Type</th>
                  <th>RBS Motif</th>
                  <th>X-Refs</th>
                  <th>Amino Acid Sequence</th>
                </thead>
                <tr v-for="(feature, index) in result.data.features">
                  <td>{{ feature.type }}</td>
                  <td>{{ feature.contig }}</td>
                  <td>{{ feature.start }}</td>
                  <td>{{ feature.stop }}</td>
                  <td>{{ feature.strand }}</td>
                  <td>{{ feature.gene }}</td>
                  <td>{{ feature.product }}</td>
                  <td>{{ feature.start_type }}</td>
                  <td>{{ feature.rbs_motif }}</td>
                  <td>
                    <span class="btn" id="show-modal" @click="showModal = index">Refs</span>
                    <!-- use the modal component, pass in the prop -->
                    <Modal v-if="showModal == index" @close="showModal = null">
                      <template v-slot:header>
                        <h2>References</h2>
                      </template>
                      <template v-slot:body>
                        <ul>
                          <li v-for="ref in feature.db_xrefs"><a :href="resolve(ref).then((res)=>res)" target="_blank">{{ ref }}</a></li>
                        </ul>
                      </template>
                    </Modal>
                  </td>
                  <!-- <td><a v-for="ref in feature.db_xrefs"
                      :href="'https://psos.computational.bio/api/v1/dbxref/resolve/' + ref">{{ ref }}</a></td> -->
                  <td>{{ feature.aa }}</td>
                </tr>
              </table>
            </div>
          </div>
          <div v-else-if="result.attributes.type == 'taxonomy'">
            <div class="h5" @click="toggle.taxonomy = !toggle.taxonomy"><i class="bi"
                :class="toggle.taxonomy ? 'bi-caret-down' : 'bi-caret-right'"></i>Taxonomy</div>
            <div v-if="toggle.taxonomy">
              <div>
                GTDB:
                <div>
                  <a v-for="entry in result.data.classification.split(';')"
                    :href="'https://gtdb.ecogenomic.org/tree?r=' + entry">{{ entry }};</a>
                </div>
              </div>
              <div>
                Fastani:
                <div>
                  {{ result.data.fastani_reference }}
                </div>
              </div>

              <div>
                <div class="start-0">
                  Classification Method:
                </div>

                <div>
                  {{ result.data.classification_method }}
                </div>
              </div>

              <div class="warning">
                <template v-if="result.data.warning != 'NaN'">
                  {{ result.data.warning }}
                </template>
              </div>
            </div>
          </div>
          <div v-else-if="result.attributes.type == ''"></div>
        </div>
      </template>
    </Loading>
  </main>
</template>

<style></style>