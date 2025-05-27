<template>
  <table>
    <tbody>
      <tr v-for="(e, i) of entries">
        <td v-if="typeof e === 'string'" colspan="2">
          <h5 :class="{ 'mt-5': i > 0 }">{{ e }}</h5>
        </td>
        <template v-else>
          <th class="text-end pe-4">{{ e.k }}:</th>
          <td>{{ e.v }}</td>
        </template>
      </tr>
    </tbody>
  </table>
</template>
<script setup lang="ts">
import type { Host, Instrument, Location, Metadata } from "@/model/Metadata";
import { computed } from "vue";

const props = defineProps<{ metadata: Metadata | undefined }>();

type Header = string;
type Entry = { k: string; v: string };
type Description = (Header | Entry)[];

const entries = computed(() => {
  const out: Description = [];
  const m = props.metadata;
  if (m == undefined) return ["No medata available"];

  const s = m.sample;
  function add(title: string, value: string | undefined) {
    if (value) out.push({ k: title, v: value });
  }

  out.push("Sample");
  add("Accession", s.accession);
  add("Secondary accession", s.secondary_accession);
  add("Alias", s.alias);
  add("Collection date", s.collection_date);
  add("Collected by", s.collected_by);
  add("Isolation source", s.isolation_source);
  add("Country", s.country);
  add("Location", location(s.location));
  add("Bio material", s.bio_material);
  add("Isolate", s.isolate);
  add("Serovar", s.serovar);
  add("Serotype", s.serotype);
  add("Strain", s.strain);
  add("Sub strain", s.sub_strain);
  add("Environmental sample", environmental_sample(s.environmental_sample));
  add("Environment biome", s.environment?.biome);
  add("Environment feature", s.environment?.feature);
  add("Environment material", s.environment?.material);
  add("Host", host(s.host));

  if (m.studies.length > 0) {
    out.push(m.studies.length == 1 ? "Study" : "Studies");
    for (const x of m.studies) {
      add("Accession", x.accession);
      add("Secondary accession", x.secondary_accession);
      add("Alias", x.alias);
      add("Project name", x.project_name);
      add("Title", x.title);
    }
  }

  if (m.runs.length > 0) {
    out.push(m.studies.length == 1 ? "Sequencing run" : "Sequencing runs");
    for (const x of m.runs) {
      add("Accession", x.accession);
      add("Instrument", instrument(x.instrument));
      add("Depth", x.depth);
      add("First public", x.first_public);
      add("Submission accession", x.submission_accession);
      add("Center name", x.center_name);
    }
  }
  return out;
});

function instrument(i?: Instrument): string | undefined {
  if (i == undefined) return i;
  const out: string[] = [];
  if (i.platform) out.push(i.platform);
  if (i.model) out.push(i.model);
  return out.join(", ");
}

function host(host?: Host): string | undefined {
  if (host == undefined) return undefined;
  const fields = [];
  if (host.host) fields.push(host.host);
  if (host.tax_id) fields.push(host.tax_id);
  if (host.sex) fields.push(host.sex);
  if (host.status) fields.push(host.status);
  if (fields.length == 0) return undefined;
  return fields.join(", ");
}

function location(l?: Location): string | undefined {
  if (l == undefined) return undefined;
  return `${l.coordinates[1]} N, ${l.coordinates[0]} E`;
}

function environmental_sample(v: boolean | undefined): string | undefined {
  if (v == undefined) return v;
  return "" + v;
}
</script>
