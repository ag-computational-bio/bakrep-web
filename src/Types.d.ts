type Result = {
    md5: string
    size: number
    url: string
    attributes: object
    data: object|null
}

type Dataset = {
    id: string
    results: Array<Result>
}

type Feature = {
    type: string,
    contig: string,
    start: number,
    stop: number,
    strand: string,
    gene: any,
    product: string
    length: number
}

type Annotation = {
    genome: {
        genus: string,
        species: string,
        strain: string,
        complete: boolean,
        gram: string,
        translation_table: string
    },
    stats: {
        no_sequence: number,
        size: number,
        gc: number,
        n_ratio: number,
        n50: number,
        coding_ratio: number
    }
    features: Array<Feature>
}