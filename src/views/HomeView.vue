<script setup lang="ts"></script>

<template>
  <main class="container pt-5">
    <div class="row">
      <div class="col-md-12 col-lg-10">
        <h2>BakRep</h2>
        <p>&nbsp;</p>
        <p>
            <b>TL;DR</b><br>
            >640,000 bacterial genomes, uniformly processed & characterized, enriched with metadata, accessible via a flexible search engine<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- genomic information at your fingertips!
        </p>
        <p>
            Public databases are brimming with bacterial WGS data posing a genetic treasure for many different applications. 
            However, most analyses focus on particular tiny subgroups that are hard to establish from raw sequencing data or metadata, only. 
            To this end, BakRep (Denglish blend of Bakterien & Repository) provides access to both comprehensive standardized genome characterizations and metadata via a flexible search engine.
        </p>
        <p>
            BakRep comprises assembly QC metrics, robust taxonomic classifications, MLST typing, genome annotations and original metadata 
            for a precious collection of bacterial genomes assembled by <a href="https://doi.org/10.1371/journal.pbio.3001421" target="_blank"><em>Blackwell et al.</em></a>
        </p>
      </div>
    </div>
    <div class="row mt-5">
        <div class="col-md-6 col-lg-5">
            <div class="card" style="width: 18rem;">
                <div class="card-body">
                    <h5 class="card-title">Search</h5>
                    <p class="card-text">by characterizations & metadata.</p>
                    <a href="search" class="btn btn-primary">Search</a>
                </div>
            </div>
        </div>
        <div class="col-md-6 col-lg-5">
            <div class="card" style="width: 18rem;">
                <div class="card-body">
                    <h5 class="card-title">Browse</h5>
                    <p class="card-text">by assembly/QC metrics.</p>
                    <a href="browse" class="btn btn-primary">Browse</a>
                </div>
            </div>
        </div>
    </div>
  </main>
</template>

<style></style>
