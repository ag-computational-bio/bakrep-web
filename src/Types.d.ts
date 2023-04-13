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
