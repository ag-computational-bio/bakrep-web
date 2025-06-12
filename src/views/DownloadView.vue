<template>
  <div class="container">
    <h1 class="mb-3">Downloads</h1>

    <div class="card mb-3">
      <div class="card-header">
        <h5 class="card-title">Bakrep download tool</h5>
      </div>
      <div class="card-body">
        <p>
          The bakrep commandline tool can be used if you need to download large
          amounts of datasets to your computer. Install it either with pip or
          conda.
        </p>
        <a
          class="card-link"
          href="https://github.com/ag-computational-bio/bakrep-cli"
          target="_blank"
        >
          <i class="bi bi-github me-1"></i> Github
        </a>
        <a
          class="card-link"
          href="https://bioconda.github.io/recipes/bakrep-cli/README.html"
          target="_blank"
        >
          <i class="bi bi-link-45deg me-1"></i> Bioconda
        </a>
      </div>
    </div>
    <div class="card">
      <div class="card-header">
        <h5 class="card-title">TSV export of all datasets</h5>
      </div>
      <div class="card-body">
        <p>
          Use this if you need a tsv that contains all datasets or when your
          search result is so large that the download of the tsv fails.
        </p>
        <a
          class="card-link"
          href="https://bakrep-v2-addons.s3.computational.bio.uni-giessen.de/bakrep-export.tsv.gz"
          target="_blank"
        >
          <i class="bi bi-download me-2"></i> Download
        </a>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
const props = defineProps<{}>();
const emit = defineEmits<{}>();
</script>
