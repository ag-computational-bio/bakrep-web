<template>
  <h5>{{ feature.id }}</h5>
  <table class="table table-sm">
    <tbody>
      <tr>
        <td class="text-end">Type</td>
        <td>{{ feature.type }}</td>
      </tr>
      <tr v-if="feature.strand">
        <td class="text-end">Strand</td>
        <td>{{ feature.strand }}</td>
      </tr>
      <tr>
        <td class="text-end">Coordinates</td>
        <td>
          {{
            feature.strand == "-"
              ? `${feature.stop}-${feature.start}`
              : `${feature.start}-${feature.stop}`
          }}
        </td>
      </tr>
      <tr v-if="feature.frame">
        <td class="text-end">Frame</td>
        <td>{{ feature.frame }}</td>
      </tr>

      <tr>
        <td class="text-end">Length</td>
        <td>{{ formatBp(feature.stop - feature.start, "bp") }}</td>
      </tr>
      <tr>
        <td class="text-end">Locus</td>
        <td>{{ feature.locus ?? "-" }}</td>
      </tr>
      <tr>
        <td class="text-end">Gene</td>
        <td>{{ feature.gene ?? "-" }}</td>
      </tr>
      <tr>
        <td class="text-end">Product</td>
        <td>{{ feature.product ?? "-" }}</td>
      </tr>

      <tr v-if="feature.nt">
        <td class="text-end">GC</td>
        <td>
          {{ formatGc(calcGcContent(feature.nt, 1, false).mean) }}
        </td>
      </tr>
      <tr v-if="feature.rbs_motif">
        <td class="text-end">RBS motif</td>
        <td>{{ feature.rbs_motif }}</td>
      </tr>
    </tbody>
  </table>
</template>
<script setup lang="ts">
import type { Feature } from "@/model/BaktaResults";
import { formatGc } from "../../formatters";
import { calcGcContent } from "../gc-content";
import { formatBp } from "../circluar-plot/formatters";

defineProps<{
  feature: Feature;
}>();
</script>
