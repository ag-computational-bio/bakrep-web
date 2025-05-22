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
        <div class="fw-bold fs-3">
          2,438,386 bacterial genomes at your fingertips <br />
        </div>
        <div class="mb-4 fw-bold ps-4">
          consistently processed & characterized, enriched with metadata,
          accessible via a flexible search engine.
        </div>
        <h1 class="fs-4 fw-bold mt-5">Why?</h1>
        <p>
          Databases are brimming with WGS samples posing a genetic treasure.
          However, while most data is publicly available, compiling targeted
          sub-cohorts for focused analyses remains challenging.
        </p>
        <h1 class="fs-4 fw-bold mt-4">What?</h1>
        <p>
          BakRep (Denglish blend of Bakterien & Repository) simplifies access to
          this data. It integrates enriched genomic information with metadata
          accessible via a flexible search-engine.
        </p>
        <h1 class="fs-4 fw-bold mt-4">Key features</h1>
        <ul class="lh-lg">
          <li>
            Assembly statistics: ensure data quality with genome-based key
            metrics
          </li>
          <li>
            Taxonomic classification: robust, purely genome-based
            classifications (<a
              href="https://gtdb.ecogenomic.org/"
              target="_blank"
              >GTDB</a
            >)
          </li>
          <li>
            <a href="https://pubmlst.org/">MLST</a>: subtyping for deeper
            insights into genetic variation
          </li>
          <li>
            Annotation: comprehensive & taxonomy-independent (<a
              href="https://bakta.computational.bio"
              target="_blank"
              >Bakta</a
            >)
          </li>
          <li>Metadata: full original submission records</li>
        </ul>

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
