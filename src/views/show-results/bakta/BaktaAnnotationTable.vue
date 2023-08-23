<template>
  <DataTable
    :columns="columns"
    :data="table"
    :configuration="dataTableConfig"
    tableId="bakta-annotation"
  />
</template>

<script setup lang="ts">
import type { BaktaResult } from "@/model/BaktaResults";
import DataTablesCore from "datatables.net-bs5";
import DataTable from "datatables.net-vue3";
import { computed, ref, type PropType } from "vue";
DataTable.use(DataTablesCore);
const props = defineProps({
  data: {
    type: Object as PropType<BaktaResult>,
    default: () => {},
  },
});

const columns = ref([
  {
    data: "contig",
    title: "Sequence",
    render: DataTablesCore.render.text(),
  },
  { data: "type", title: "Type", render: DataTablesCore.render.text() },
  {
    data: "start",
    title: "Start",
    render: DataTablesCore.render.text(),
  },
  {
    data: "stop",
    title: "Stop",
    render: DataTablesCore.render.text(),
  },
  {
    data: "strand",
    title: "Strand",
    render: DataTablesCore.render.text(),
  },
  {
    data: "locus",
    title: "Locus tag",
    render: DataTablesCore.render.text(),
  },
  {
    data: "product",
    title: "Product",
    render: DataTablesCore.render.text(),
  },
  { data: "dbxrefs", title: "DbXrefs" },
]);

const dataTableConfig = ref({
  scrollCollapse: true,
  paging: true,
  pageLength: 100,
  processing: true,
  deferRender: true,
  lengthMenu: [50, 100, 250],
});

const table = computed(() => {
  return props.data.features.map((x) => ({
    contig: x.contig || "",
    type: x.type || "",
    start: x.start || "",
    stop: x.stop || "",
    strand: x.strand || "",
    locus: x.locus || "",
    product: x.product || "",
    dbxrefs: x.db_xrefs
      ? x.db_xrefs
          // url is hard coded for the moment. Should be moved to rest-api module
          .map(
            (x) =>
              '<a target="_" href=https://psos-staging.computational.bio/api/v1/dbxref/redirect/' +
              x +
              ">" +
              x +
              "</a>"
          )
          .join("<br> ")
      : "",
  }));
});
</script>
<style>
@import "datatables.net-bs5";
.odd > td {
  background-color: lightgray;
}
.even > td {
  background-color: white;
}
</style>
