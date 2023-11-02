<script setup lang="ts">
import GenusStatistics from "@/components/GenusStatistics.vue";
import RepositoryStatistics from "@/components/RepositoryStatistics.vue";

const genusData = [
  {
    key: "Salmonella enterica",
    count: 178581,
  },
  {
    key: "Escherichia coli",
    count: 89135,
  },
  {
    key: "Streptococcus pneumoniae",
    count: 51433,
  },
  {
    key: "Mycobacterium tuberculosis",
    count: 49007,
  },
  {
    key: "Staphylococcus aureus",
    count: 47997,
  },
  {
    key: "Campylobacter_D jejuni",
    count: 28335,
  },
  {
    key: "Neisseria meningitidis",
    count: 17153,
  },
  {
    key: "Streptococcus pyogenes",
    count: 16821,
  },
  {
    key: "Klebsiella pneumoniae",
    count: 13637,
  },
  {
    key: "Clostridioides difficile",
    count: 13579,
  },
  {
    key: "Listeria monocytogenes",
    count: 12245,
  },
  {
    key: "Listeria monocytogenes_B",
    count: 12244,
  },
  {
    key: "Streptococcus agalactiae",
    count: 10359,
  },
  {
    key: "Neisseria gonorrhoeae",
    count: 8904,
  },
  {
    key: "Campylobacter_D coli",
    count: 8849,
  },
  {
    key: "Enterococcus_B faecium",
    count: 8284,
  },
  {
    key: "Pseudomonas aeruginosa",
    count: 6286,
  },
  {
    key: "Vibrio cholerae",
    count: 5562,
  },
  {
    key: "Acinetobacter baumannii",
    count: 5124,
  },
  {
    key: "Mycobacterium abscessus",
    count: 2689,
  },
  {
    key: "Legionella pneumophila",
    count: 2110,
  },
  {
    key: "Enterobacter hormaechei_A",
    count: 1917,
  },
  {
    key: "Enterococcus faecalis",
    count: 1906,
  },
  {
    key: "Burkholderia mallei",
    count: 1826,
  },
  {
    key: "",
    count: 1786,
  },
];
</script>

<template>
  <main class="container pt-5">
    <div class="row">
      <div class="col-md-12 col-lg-6">
        <h2>BakRep</h2>
        <p>
          The large amount of bacterial genomic data in public genome databases
          is an important resource for research in various fields. However, most
          of this data has been processed differently, making accurate
          comparisons challenging. <em>Blackwell et al</em>., used a uniform
          approach to assemble and characterise 661,405 bacterial genomes
          retrieved from the European Nucleotide Archive (ENA) in November of
          2018. We build up on this resource and further analyse the assembled
          genomes in a standardised manner. We conducted a robust taxonomic
          classification using the Genome Taxonomy Database (GTDB) and
          furthermore subtyped all eligible genomes via multilocus-sequence
          typing. In addition we annotated all genomes assigning functional
          categories, e.g. COG and E.C., and database cross references to public
          databases. The overarching goal is to make this standardised resource
          available to non-bioinformaticians via an interactive website. This
          website will provide researchers with a flexible search engine to
          query the repository
        </p>
      </div>
      <div class="col-md-12 col-lg-6">
        <img src="/krona_main.svg" class="w-100" />
      </div>
    </div>
    <div>
      <GenusStatistics :inputData="genusData" />
    </div>
    <div>
      <RepositoryStatistics
        class=""
        :entries="{ datasets: 661383, genera: 2467, species: 8208 }"
      />
    </div>
  </main>
</template>

<style></style>
