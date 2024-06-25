export interface DatabaseModel {
    total: number,
    count: number,
    results : IngredientModel[]
}

export interface IngredientModel {
    id: number,
    description: string,
    index?: number
}