export interface ProductRow {
    product?: string | null;
    company_brand?: string | null;
    age?: string | null;
    recommended_age?: string | null;
    npc_percent_cal_from_protein?: number | string | null;
    protein_sources?: string | null;
    npc_percent_cal_from_fat?: number | string | null;
    fat_sources?: string | null;
    npc_percent_cal_from_cho?: number | string | null;
    carbohydrate_sources?: string | null;
    npc_percent_free_water?: number | string | null;
    allergens?: string | null;
    manufacturer?: string | null;
    company?: string | null;
    // allow other columns without losing type-safety for the known fields
    [key: string]: string | number | null | undefined;
}

export type Ingredient = {
    name: string;
    type: string;
    row?: ProductRow;
};
