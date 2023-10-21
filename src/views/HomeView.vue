<script setup lang="ts">
import RepositoryStatistics from "@/components/RepositoryStatistics.vue";
</script>

<template>
  <main class="container pt-5">
    <div class="row">
      <div class="col-2 bg-secondary card text-light">
        <div class="card-body">
          <h5 class="card-title">Repository Statistics:</h5>
          <div class="card-text">
            <RepositoryStatistics
              class=""
              :entries="{ datasets: 661383, genera: 2467, species: 8208 }"
            />
          </div>
        </div>
      </div>
      <div class="col-8 px-4">
        <h2>BakRep</h2>
        The large amount of bacterial genomic data in public genome databases is
        an important resource for research in various fields. However, most of
        this data has been processed differently, making accurate comparisons
        challenging. <em>Blackwell et al</em>., used a uniform approach to
        assemble and characterise 661,405 bacterial genomes retrieved from the
        European Nucleotide Archive (ENA) in November of 2018. We build up on
        this resource and further analyse the assembled genomes in a
        standardised manner. We conducted a robust taxonomic classification
        using the Genome Taxonomy Database (GTDB) and furthermore subtyped all
        eligible genomes via multilocus-sequence typing. In addition we
        annotated all genomes assigning functional categories, e.g. COG and
        E.C., and database cross references to public databases. The overarching
        goal is to make this standardised resource available to
        non-bioinformaticians via an interactive website. This website will
        provide researchers with a flexible search engine to query the
        repository.
      </div>
    </div>
    <div class="row py-4">
      <div
        class="col btn btn-primary me-5 py-2"
        @click="$router.push('browse')"
      >
        Browse
      </div>
      <div class="col btn btn-light ms-5 py-2" @click="$router.push('search')">
        Search
      </div>
    </div>
  </main>
</template>

<style></style>
