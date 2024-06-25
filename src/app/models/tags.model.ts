export interface tagsModel {
    id: string,
    description: string,
    tags?: tag[]
}

export interface tag {
    tagCategory: string,
    tags: string[]
}

