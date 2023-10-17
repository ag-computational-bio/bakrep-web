<script setup lang="ts"></script>

<template>
  <main class="container pt-5">
    <h2>BakRep</h2>
    <div class="row">
      <div class="col-md-12 col-lg-6">
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
        repository
      </div>
      <div class="col-md-12 col-lg-6">
        <iframe src="/krona_main.html" class="w-100" style="height: 600px" />
      </div>
    </div>
  </main>
</template>

<style></style>
