<script setup lang="ts"></script>

<template>
  <main class="container pt-5">
    <div class="row">
      <div
        class="col-sm-12 col-md-4 ml-4 py-2 px-2 bg-secondary rounded text-light text-center"
      >
        <h4>Statistics</h4>
        <div>Lorem ipsum dolor sit amet.</div>

        <div class="bg-light">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Impedit
          dolores optio incidunt ducimus cupiditate aut vel porro ratione atque.
          Tempore consequatur cum fuga modi quam, distinctio sunt assumenda
          obcaecati natus!
        </div>
        <div>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quod,
          veritatis!
        </div>
      </div>
      <div class="col-8 px-4">
        <h2>Project Description - Bakrep</h2>

                The large amount of bacterial genomic data in public genome databases is an important resource for research in various fields. However, most of this data has been processed differently, making accurate comparisons challenging. <em>Blackwell et al</em>., used a uniform approach to assemble and characterise 661,405 bacterial genomes retrieved from the European Nucleotide Archive (ENA) in November of 2018. We build up on this resource and further analyse the assembled genomes in a standardised manner. We conducted a robust taxonomic classification using the Genome Taxonomy Database (GTDB) and furthermore subtyped all eligible genomes via multilocus-sequence typing. In addition we annotated all genomes assigning functional categories, e.g. COG and E.C., and database cross references to public databases. The overarching goal is to make this standardised resource available to non-bioinformaticians via an interactive website. This website will provide researchers with a flexible search engine to query the repository.            </div>
        </div>
        <div class="row py-4">            
            <div class="col btn btn-primary me-5 py-2" @click="$router.push('browse')">Browse Genomes</div>
            <div class="col btn btn-light ms-5 py-2" @click="$router.push('search')">Go To Search</div>
        </div>
    </main>
</template>

<style></style>
