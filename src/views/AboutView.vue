<template>
  <div class="container">
    <h2>About</h2>
    <p>&nbsp;</p>
    <p>
        BakRep is a searchable large-scale web repository for bacterial genomes enriched with standardized genome characterizations and related metadata. Researchers can query this repository via a flexible search engine thus combining genomic information and metadata.
    </p>
    <p>
        For technical questions and bug reports, we happily accept issues on <a href="https://github.com/ag-computational-bio/bakrep-web" target="_blank">GitHub</a>.<br/>
        General contact and questions: <a href="mailto:bakrep@computational.bio.uni-giessen.de" target="_blank">bakrep@computational.bio.uni-giessen.de</a>
    </p>
    <p>
        We gratefully acknowledge the initial assembly of all genomes, which was conducted by <a href="https://doi.org/10.1371/journal.pbio.3001421" target="_blank"><em>Blackwell et al.</em></a> in 2021<br>
        the EBI computational genomics research group led by <a href="https://www.ebi.ac.uk/people/person/zamin-iqbal/" target="_blank">Zamin Iqbal</a>.
    </p>
    <p>
        Based on these achievements, we additionally computed assembly metrics, conducted robust taxonomic classifications as well as MLST subtypings,<br>
        and annotated all genomes by taking advantage of the following software tools & databases:
        <ul>
            <li>Assembly QC: <a href="https://doi.org/10.1038/s41592-023-01940-w" target="_blank">CheckM2</a> (v1.0.1); <a href="https://github.com/rpetit3/assembly-scan" target="_blank">rpetit3/assembly-scan</a></li>
            <li>Taxonomy: <a href="https://doi.org/10.1093/bioinformatics/btz848" target="_blank">GTDB-Tk</a> (Software: v2.2.6, DB: R207)</li>
            <li>MLST: <a href="https://github.com/tseemann/mlst" target="_blank">tseemann/mlst</a></li>
            <li>Annotation: <a href="https://doi.org/10.1099/mgen.0.000685" target="_blank">Bakta</a> (Software: v1.7.0, DB: v5.0 - full)</li>
        </ul>
    </p>
  </div>
</template>
