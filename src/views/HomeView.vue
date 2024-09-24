<script setup lang="ts"></script>

<template>
  <main class="container pt-5">
    <div class="row">
      <div class="col-md-12 col-lg-4">
        <img
          src="@/assets/images/BakRep_logo-web.png"
          title="BakRep - bacterial web repository logo"
          style="width: 100%; max-width: 400px"
        />
      </div>
      <div class="col-md-12 col-lg-8">
        <h1 class="fs-5 fw-bold">TL;DR</h1>
        <p>
          >640,000 bacterial genomes, uniformly processed & characterized,
          enriched with metadata, accessible via a flexible search engine<br />
          <span class="ps-4">- genomic information at your fingertips!</span>
        </p>
        <p>
          Public databases are brimming with bacterial WGS data posing a genetic
          treasure for many different applications. However, most analyses focus
          on particular tiny subgroups that are hard to establish from raw
          sequencing data or metadata, only. To this end, BakRep (Denglish blend
          of Bakterien & Repository) provides access to both comprehensive
          standardized genome characterizations and metadata via a flexible
          search engine.
        </p>
        <p>
          BakRep comprises assembly QC metrics, robust taxonomic
          classifications, MLST typing, genome annotations and original metadata
          for a precious collection of bacterial genomes assembled by
          <a
            href="https://doi.org/10.1371/journal.pbio.3001421"
            target="_blank"
          >
            <em>Blackwell et al.</em>
          </a>
        </p>
        <div class="mt-5">
          <div class="d-flex justify-content-evenly">
            <div class="card" style="">
              <div class="card-body">
                <h5 class="card-title">Search</h5>
                <p class="card-text">by characterizations & metadata.</p>
                <RouterLink :to="{ name: 'search' }" class="btn btn-primary">
                  Search
                </RouterLink>
              </div>
            </div>
            <div class="card" style="">
              <div class="card-body">
                <h5 class="card-title">Browse</h5>
                <p class="card-text">by assembly/QC metrics.</p>
                <RouterLink :to="{ name: 'browse' }" class="btn btn-primary">
                  Browse
                </RouterLink>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<style></style>
