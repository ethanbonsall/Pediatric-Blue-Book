import { UUID } from "crypto";

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

export interface LiquidProductRow {
    id: UUID;
    product?: string | null;
    company_brand?: string | null;
    age?: string | null;
    amount_per_carton_ml?: number | null;
    calories_per_ml?: number | null;
    protein_sources?: string | null;
    carbohydrate_sources?: string | null;
    fat_sources?: string | null;
    specialty_ingredients?: string | null;
    npc_percent_free_water?: number | null;
    npc_percent_cal_from_protein?: number | null;
    npc_percent_cal_from_cho?: number | null;
    npc_percent_cal_from_fat?: number | null;
    npc_vitamin_a_mcg_re?: number | null;
    npc_vitamin_d_mcg?: number | null;
    npc_vitamin_e_mg?: number | null;
    npc_vitamin_k_mcg?: number | null;
    npc_thiamin_mg?: number | null;
    npc_riboflavin_mg?: number | null;
    npc_niacin_mg?: number | null;
    npc_b6_mg?: number | null;
    npc_b12_mcg?: number | null;
    npc_vitamin_c_mg?: number | null;
    npc_folic_acid_mcg?: number | null;
    npc_biotin_mcg?: number | null;
    npc_pantothenic_acid_mg?: number | null;
    npc_choline_mg?: number | null;
    npc_inositol_mg?: number | null;
    npc_sodium_mg?: number | null;
    npc_potassium_mg?: number | null;
    npc_chloride_mg?: number | null;
    npc_calcium_mg?: number | null;
    npc_phosphorus_mg?: number | null;
    npc_iron_mg?: number | null;
    npc_zinc_mg?: number | null;
    npc_magnesium_mg?: number | null;
    npc_iodine_mcg?: number | null;
    npc_manganese_mg?: number | null;
    npc_selenium_mcg?: number | null;
    npc_chromium_mcg?: number | null;
    npc_molybdenum_mcg?: number | null;
    npc_cooper_mg?: number | null;
    notes?: string | null;
    active?: boolean | null;
    approved?: boolean | null;
    total_protein_g?: number | null;
    total_fat_g?: number | null;
    total_carbohydrate_g?: number | null;
    water_ml?: number | null;
    prebiotic_sources?: string | null;
    probiotic_sources?: string | null
}


export interface PowderProductRow {
    id: UUID;
    product?: string | null;
    company_brand?: string | null;
    age?: string | null;
    protein_sources?: string | null;
    carbohydrate_sources?: string | null;
    fat_sources?: string | null;
    specialty_ingredients?: string | null;
    grams_per_scoop?: number | null;
    grams_per_teaspoon?: number | null;
    grams_per_tablespoon?: number | null;
    grams_per_cup?: number | null;
    calories_per_gram?: number | null;
    np100_total_protein_g?: number | null;
    np100_total_fat_g?: number | null;
    np100_total_carbohydrate_g?: number | null;
    np100_percent_free_water?: number | null;
    np100_percent_cal_from_protein?: number | null;
    np100_percent_cal_from_cho?: number | null;
    np100_percent_cal_from_fat?: number | null;
    np100_vitamin_a_mcg_re?: number | null;
    np100_vitamin_d_mcg?: number | null;
    np100_vitamin_e_mg?: number | null;
    np100_vitamin_k_mcg?: number | null;
    np100_thiamin_mg?: number | null;
    np100_riboflavin_mg?: number | null;
    np100_niacin_mg?: number | null;
    np100_b6_mg?: number | null;
    np100_b12_mcg?: number | null;
    np100_vitamin_c_mg?: number | null;
    np100_folic_acid_mcg?: number | null;
    np100_biotin_mcg?: number | null;
    np100_pantothenic_acid_mg?: number | null;
    np100_choline_mg?: number | null;
    np100_inositol_mg?: number | null;
    np100_sodium_mg?: number | null;
    np100_potassium_mg?: number | null;
    np100_chloride_mg?: number | null;
    np100_calcium_mg?: number | null;
    np100_phosphorus_mg?: number | null;
    np100_iron_mg?: number | null;
    np100_zinc_mg?: number | null;
    np100_magnesium_mg?: number | null;
    np100_iodine_mcg?: number | null;
    np100_selenium_mcg?: number | null;
    np100_chromium_mcg?: number | null;
    np100_molybdenum_mcg?: number | null;
    np100_copper_mg?: number | null;
    notes?: string | null;
    active?: boolean | null;
    approved?: boolean | null;
    probiotic?: string | null;
    allergens?: string | null;
    displacement_ml_per_g?: number | null;
    np100_water_ml_standard?: number | null;
    prebiotic_sources?: string | null;
    probiotic_sources?: string | null;
    np100_standard_volume?: string | null;




}