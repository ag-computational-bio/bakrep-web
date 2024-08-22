<template>
  <div class="container">
    <h1>BakRep documentation</h1>

    <article>
      <h2>Searching for datasets</h2>

      <p>
        You can search for datasets of your interest on the search page. First
        you will define your search query via the query builder on top of the
        page. Then you click on "Search" to find all datasets that match your
        query.
      </p>

      <h3>Build a search query</h3>
      <p>
        The query builder consists of three parts: The query type selector, the
        query-element selector and the query-element configuration area.
      </p>
      <p>
        Each group of criteria has a type. Either all criteria must match
        (logical and) or at least one criterion must match (logical or). Select
        the type on the top of each criteria group. You can change the type at
        any time.
      </p>
      <p>
        BakRep provides a set of criteria for searching the repository. To add
        them select your criterion of interest in the query-element selector and
        add click on add field. A new entry will be added to the configuration
        area. At the moment BakRep has four different criteria types:
        number-fields, text-fields, nested fields and groups.
      </p>
      <p>
        With groups you can nest up to three levels of grouped criteria. Each
        group has its type and a list of criteria. Example: You want find all
        datasets for a species with less than 10 contigs and all datasets for
        another species with 10-20 contigs. This can be mapped to "At least one
        must match"-type on the toplevel group, with two groups having "All must
        match"-type and the properly configured species and contigs criteria.
      </p>
      <p>
        Number-fields require a comparison operator and a reference number.
        BakRep supports the equals (==), not equals (!=), less (&lt;), less or
        equal (&lt;=), greater (>), greater or equal(>=) and between ([])
        operations. The between operation requires two reference numbers: The
        lower- and upper-limits.
      </p>
      <p>
        Similar to Number-fields, String-fields require a comparison operator
        and a text. BakRep supports exact text match (eq), exclude exact text
        match (neq), exact word match(~) and exclude exact word match (!~). For
        some criteria suggestions from the database will be presented when you
        type.
      </p>
      <p>
        The only nested field are the annotated features. They have a work
        similar to the groups, but provide criteria that are only available for
        the nested field.
      </p>
      <p>
        When you compiled your query click on search and after a few moments the
        results should appear below the query builder. You can refine your query
        at any moment and click on search again to obtain the new results.
      </p>

      <h3>Use the results table</h3>
      <p>
        The search results are presented in the result table. On top it shows
        the total number of datasets that match your query. By default it only
        shows the first 20 elements. Below the table you can switch to other
        pages of your results. You can visit a detailed page for each dataset
        via the link in the id column.
      </p>
      <p>
        The table header has symbols with arrows next to header labels. These
        indicate the sorting. An up and a down-arrow indicate that the column is
        not used for sorting. An up arrow indicates ascending sort direction
        whereas a down arrow indicates descending sort direction. To switch
        between the sorting modes for a column click on the array symbol.
      </p>
      <p>
        It is also possible to sort by multiple columns. The last modified
        column will become the first sort criterion and the previously changed
        sort columns become the secondary, tertiary etc. sort criteria. Example:
        To sort descending by species and for each species ascending by contig
        count, change the contigs column to ascending first and the species
        column to descending.
      </p>
      <h3>Export the table as a tsv file</h3>
      <p>
        You can download the results table as a tsv file that will include the
        visible columns and additional columns available in the repository. The
        download will take a moment. An indicator will show the progress. Do not
        close or switch the page until the download is completed and the file is
        saved.
      </p>
      <p>
        The resulting tsv file can be used to download the complete datasets to
        your computer with the BakRep-Download Tool. See:
        <a
          href="https://github.com/ag-computational-bio/bakrep-cli"
          target="_blank"
        >
          https://github.com/ag-computational-bio/bakrep-cli
        </a>
      </p>
    </article>
  </div>
</template>
