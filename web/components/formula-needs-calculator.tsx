import {
  CheckSquare,
  Ellipsis,
  HeartIcon,
  Plus,
  Square,
  SquareArrowUpRight,
  Trash2,
} from "lucide-react";
import { useState, useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import Popup from "./pop_up";
import { supabase } from "@/lib/supabase";
import type { ProductRow, Ingredient } from "@/lib/types";

type Nutrient = {
  name: string;
  amount: string;
};

type SelectedIngredient = {
  name: string;
  type: string;
  amount: string;
  row?: ProductRow;
};

interface FormulaNeedsCalculatorProps {
  idealNutrients?: Nutrient[];
}

const FormulaNeedsCalculator = ({ idealNutrients = [] }: FormulaNeedsCalculatorProps) => {
  const [popUp, setPopUp] = useState(false);
  const [selectedIngredientForPopup, setSelectedIngredientForPopup] = useState<Ingredient | null>(null);
  const Heart = () => {
    return null;
  };
  const [search, setSearch] = useState(false);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("All");
  const WATER_INGREDIENT: Ingredient = { name: "Water", type: "Liquid" };
  const [ingredients, setIngredients] = useState<Ingredient[]>([WATER_INGREDIENT]);
  const [selectedIngredients, setSelectedIngredients] = useState<SelectedIngredient[]>([]);
  const [servings, setServings] = useState<number>(1);

  useEffect(() => {
    getIngredients();
  }, []);

  const getIngredients = async () => {
    // fetch rows for powder and liquid
    const [powderRes, liquidRes] = await Promise.all([
      supabase.from("powder_ingredients").select("*"),
      supabase.from("liquid_ingredients").select("*"),
    ]);

    if (powderRes.error) console.error("powder_ingredients error:", powderRes.error);
    if (liquidRes.error) console.error("liquid_ingredients error:", liquidRes.error);

    const powderRows: ProductRow[] = (powderRes.data ?? []) as ProductRow[];
    const liquidRows: ProductRow[] = (liquidRes.data ?? []) as ProductRow[];

    const fetched: Ingredient[] = [
      ...powderRows.map((r) => ({ name: (r.product ?? "").toString().trim(), type: "Powder", row: r })),
      ...liquidRows.map((r) => ({ name: (r.product ?? "").toString().trim(), type: "Liquid", row: r })),
    ].filter((it) => it.name.length > 0);

    setIngredients((prev) => {
      const map = new Map<string, Ingredient>();
      [...prev, WATER_INGREDIENT, ...fetched].forEach((item) => map.set(item.name.toLowerCase(), item));
      return Array.from(map.values());
    });
  };

  // Extract minimum gram amount for Protein, Carbohydrates, and Fats
  const extractMinGrams = (amountString: string): string => {
    if (!amountString) return "";
    
    // Handle formats like:
    // - "≥ 15 g (1.5 g/kg)" -> extract "15 g"
    // - "15 - 25 g" -> extract "15 g" (first number, lower end of range)
    // - "15 g" -> extract "15 g"
    // - "15.5 - 25.2 g" -> extract "15.5 g"
    
    // First, try to match range format "X - Y g" or "X-Y g"
    const rangeMatch = amountString.match(/(\d+(?:\.\d+)?)\s*-\s*\d+(?:\.\d+)?\s*g/);
    if (rangeMatch) {
      return rangeMatch[1] + " g";
    }
    
    // Then try to match any format with number followed by "g"
    const match = amountString.match(/(\d+(?:\.\d+)?)\s*g/);
    if (match) {
      return match[1] + " g";
    }
    
    return amountString; // Fallback to original if pattern doesn't match
  };

  // Extract just calories from Energy Needs string
  const extractCalories = (amountString: string): string => {
    if (!amountString) return "";
    
    // Handle format like "1500 cal (100 cal/kg)" -> extract "1500 cal"
    const match = amountString.match(/(\d+(?:\.\d+)?)\s*cal/);
    if (match) {
      return match[1] + " cal";
    }
    
    return amountString; // Fallback to original if pattern doesn't match
  };

  // Parse numeric value from amount string (handles various formats)
  const parseAmountValue = (amountString: string): number | null => {
    if (!amountString) return null;
    
    // Extract the first number (can be decimal)
    const match = amountString.match(/(\d+(?:\.\d+)?)/);
    if (match) {
      return parseFloat(match[1]);
    }
    return null;
  };

  // Format ideal amount based on nutrient type and divide by servings
  const formatIdealAmount = (nutrientName: string, idealAmount: string, servingsPerDay: number): string => {
    if (!idealAmount) return "";
    
    let formatted: string;
    
    // For Energy Needs, extract just the calories
    if (nutrientName === "Calories") {
      formatted = extractCalories(idealAmount);
    }
    // For Protein, Carbohydrates, and Fats, extract just the minimum gram amount
    else if (nutrientName === "Protein" || nutrientName === "Carbohydrates" || nutrientName === "Fats") {
      formatted = extractMinGrams(idealAmount);
    }
    // For all other nutrients, return the full string
    else {
      formatted = idealAmount;
    }
    
    // Divide by servings if servings > 1
    if (servingsPerDay > 1 && formatted) {
      const numericValue = parseAmountValue(formatted);
      if (numericValue !== null) {
        const dividedValue = numericValue / servingsPerDay;
        
        // Extract unit - everything after the first number (with optional whitespace)
        const unitMatch = formatted.match(/\d+(?:\.\d+)?\s*(.+)$/);
        const unit = unitMatch ? unitMatch[1].trim() : "";
        
        // Format to reasonable decimal places
        const roundedValue = Math.round(dividedValue * 10) / 10;
        return `${roundedValue}${unit ? " " + unit : ""}`;
      }
    }
    
    return formatted;
  };

  // Generate nutrients list dynamically from idealNutrients or use a default structure
  // This ensures we show all nutrients that match the nutrient needs calculator
  const nutrients = idealNutrients.length > 0 
    ? idealNutrients
        .filter(n => n.name !== "" && n.amount !== "") // Filter out empty entries
        .map(n => ({ name: n.name, amount: "" })) // Start with empty amounts (will be calculated from formulas)
    : [
        { name: "Calories", amount: "" },
        { name: "Holliday-Segar", amount: "" },
        { name: "DRI Fluid", amount: "" },
        { name: "Protein", amount: "" },
        { name: "Carbohydrates", amount: "" },
        { name: "Fats", amount: "" },
        { name: "Calcium", amount: "" },
        { name: "Iron", amount: "" },
        { name: "Vitamin D", amount: "" },
        { name: "Potassium", amount: "" },
        { name: "Magnesium", amount: "" },
        { name: "Zinc", amount: "" },
        { name: "Vitamin A", amount: "" },
        { name: "Vitamin E", amount: "" },
        { name: "Vitamin C", amount: "" },
        { name: "Vitamin K", amount: "" },
        { name: "Thiamin", amount: "" },
        { name: "Riboflavin", amount: "" },
        { name: "Niacin", amount: "" },
        { name: "Vitamin B6", amount: "" },
        { name: "Folate", amount: "" },
        { name: "Vitamin B12", amount: "" },
        { name: "Pantothenic Acid", amount: "" },
        { name: "Biotin", amount: "" },
        { name: "Choline", amount: "" },
        { name: "Chromium", amount: "" },
        { name: "Copper", amount: "" },
        { name: "Fluoride", amount: "" },
        { name: "Iodine", amount: "" },
        { name: "Manganese", amount: "" },
        { name: "Phosphorus", amount: "" },
        { name: "Selenium", amount: "" },
        { name: "Sodium", amount: "" },
        { name: "Chloride", amount: "" },
        { name: "Fiber", amount: "" },
      ];

  const filteredIngredients = ingredients.filter(
    (ingredient) =>
      (ingredient.type === filter || filter === "All") &&
      ingredient.name.toLowerCase().includes(query.toLowerCase())
  );

  const [checked, setChecked] = useState<boolean[]>(
    Array(selectedIngredients.length).fill(false)
  );

  const toggleCheck = (index: number) => {
    setChecked((prev) => prev.map((val, i) => (i === index ? !val : val)));
  };

  const handleAddIngredient = (ingredient: Ingredient, amount: string, servingType: string) => {
    const newIngredient: SelectedIngredient = {
      name: ingredient.name,
      type: ingredient.type,
      amount: `${amount} ${servingType}`,
      row: ingredient.row,
    };
    setSelectedIngredients((prev) => [...prev, newIngredient]);
    setChecked((prev) => [...prev, false]);
    setPopUp(false);
    setSelectedIngredientForPopup(null);
  };

  const handlePlusClick = (ingredient: Ingredient) => {
    setSelectedIngredientForPopup(ingredient);
    setPopUp(true);
  };

  const handleEllipsisClick = (selectedIngredient: SelectedIngredient) => {
    // Create an Ingredient object from the SelectedIngredient
    const ingredient: Ingredient = {
      name: selectedIngredient.name,
      type: selectedIngredient.type,
      row: selectedIngredient.row,
    };
    setSelectedIngredientForPopup(ingredient);
    setPopUp(true);
  };

  const parseAmount = (amountString: string): { amount: string; servingType: string } => {
    // Parse "2 Scoop" or "1 Cup" format
    const parts = amountString.trim().split(" ");
    if (parts.length >= 2) {
      return {
        amount: parts[0],
        servingType: parts.slice(1).join(" "),
      };
    }
    return { amount: "1", servingType: "Scoop" };
  };

  // Convert serving to grams (for powder) or ml (for liquid)
  const isWaterIngredient = (ingredient: { name: string }) => ingredient.name.toLowerCase() === "water";

  const getGramsOrMl = (ingredient: SelectedIngredient): number => {
    const isWater = isWaterIngredient(ingredient);
    const parsed = parseAmount(ingredient.amount);
    const quantity = parseFloat(parsed.amount) || 0;
    const servingType = parsed.servingType;
    
    if (isWater) {
      const mlPerServing = 
        servingType === "Cup" ? 236.6 :
        servingType === "Tablespoon" ? 14.8 :
        servingType === "Teaspoon" ? 4.9 :
        servingType === "Scoop" ? 30 :
        0;
      return quantity * mlPerServing;
    }

    const row = ingredient.row;
    if (!row) return 0;

    if (ingredient.type === "Powder") {
      // Powder: use grams_per_* values
      const gramsPerServing = 
        servingType === "Scoop" ? (row.grams_per_scoop as number) || 0 :
        servingType === "Teaspoon" ? (row.grams_per_teaspoon as number) || 0 :
        servingType === "Tablespoon" ? (row.grams_per_tablespoon as number) || 0 :
        servingType === "Cup" ? (row.grams_per_cup as number) || 0 :
        0;
      
      // For np100 (per 100ml), we need to convert grams to ml of prepared formula
      // Assuming standard reconstitution: typically 1 scoop (8.5g) makes ~60ml
      // We can estimate using calories_per_gram if available, or use a standard ratio
      const grams = quantity * gramsPerServing;
      const caloriesPerGram = (row.calories_per_gram as number) || 0;
      
      // If we have calories_per_gram, we can estimate prepared volume
      // Standard formula is ~20 cal/oz = ~0.67 cal/ml, so ml = calories / 0.67
      // Or: if calories_per_gram = 5, then 8.5g = 42.5 cal, prepared = 42.5/0.67 = 63ml
      if (caloriesPerGram > 0) {
        const totalCalories = grams * caloriesPerGram;
        const mlPrepared = totalCalories / 0.67; // ~0.67 cal/ml for standard formula
        return mlPrepared;
      }
      
      // Fallback: assume 1g powder = 7ml prepared (rough estimate)
      return grams * 7;
    } else {
      // Liquid: convert serving type to ml
      const mlPerServing = 
        servingType === "Cup" ? 236.6 : // US cup = 236.6ml
        servingType === "Tablespoon" ? 14.8 : // 1 tbsp = 14.8ml
        servingType === "Teaspoon" ? 4.9 : // 1 tsp = 4.9ml
        servingType === "Scoop" ? 30 : // Approximate for scoop in liquid context
        0;
      
      return quantity * mlPerServing;
    }
  };

  // Calculate nutrients from all selected ingredients
  const calculateNutrients = (): Record<string, number> => {
    const totals: Record<string, number> = {};
    
    selectedIngredients.forEach((ingredient) => {
      const isWater = isWaterIngredient(ingredient);
      const row = ingredient.row;
      if (!row && !isWater) return;
      
      const mlPrepared = getGramsOrMl(ingredient);
      const parsedAmount = parseAmount(ingredient.amount);
      const quantity = parseFloat(parsedAmount.amount) || 0;
      const servingType = parsedAmount.servingType;

      if (isWater) {
        if (mlPrepared > 0) {
          if (!totals["Holliday-Segar"]) totals["Holliday-Segar"] = 0;
          totals["Holliday-Segar"] += mlPrepared;
          if (!totals["DRI Fluid"]) totals["DRI Fluid"] = 0;
          totals["DRI Fluid"] += mlPrepared / 1000;
        }
        return;
      }

      if (!row) return;
      
      if (ingredient.type === "Powder") {
        // For powder: np100 values are per 100ml of prepared formula
        const multiplier = mlPrepared / 100;

        // Map nutrient names to np100 column names
        const nutrientMap: Record<string, string> = {
          "Protein": "np100_total_protein_g",
          "Carbohydrates": "np100_total_carbohydrate_g",
          "Fats": "np100_total_fat_g",
          "Calcium": "np100_calcium_mg",
          "Iron": "np100_iron_mg",
          "Vitamin D": "np100_vitamin_d_mcg",
          "Potassium": "np100_potassium_mg",
          "Magnesium": "np100_magnesium_mg",
          "Zinc": "np100_zinc_mg",
          "Vitamin A": "np100_vitamin_a_mcg_re",
          "Vitamin E": "np100_vitamin_e_mg",
          "Vitamin C": "np100_vitamin_c_mg",
          "Vitamin K": "np100_vitamin_k_mcg",
          "Thiamin": "np100_thiamin_mg",
          "Riboflavin": "np100_riboflavin_mg",
          "Niacin": "np100_niacin_mg",
          "Vitamin B6": "np100_b6_mg",
          "Folate": "np100_folic_acid_mcg",
          "Vitamin B12": "np100_b12_mcg",
          "Pantothenic Acid": "np100_pantothenic_acid_mg",
          "Biotin": "np100_biotin_mcg",
          "Choline": "np100_choline_mg",
          "Chromium": "np100_chromium_mcg",
          "Copper": "np100_cooper_mg",
          "Fluoride": "fluoride",
          "Iodine": "np100_iodine_mcg",
          "Manganese": "np100_manganese_mg",
          "Phosphorus": "np100_phosphorus_mg",
          "Selenium": "np100_selenium_mcg",
          "Sodium": "np100_sodium_mg",
          "Chloride": "np100_chloride_mg",
          "Fiber": "fiber",
        };
        
        Object.entries(nutrientMap).forEach(([nutrientName, columnName]) => {
          if (!ingredient.row) return;
          const value = ingredient.row[columnName] as number;
          if (value != null && !isNaN(value)) {
            if (!totals[nutrientName]) totals[nutrientName] = 0;
            totals[nutrientName] += value * multiplier;
          }
        });

        const caloriesPerGram = (row.calories_per_gram as number) || 0;
        const gramsPerServing =
          servingType === "Scoop"
            ? ((row.grams_per_scoop as number) || 0)
            : servingType === "Teaspoon"
              ? ((row.grams_per_teaspoon as number) || 0)
              : servingType === "Tablespoon"
                ? ((row.grams_per_tablespoon as number) || 0)
                : servingType === "Cup"
                  ? ((row.grams_per_cup as number) || 0)
                  : 0;
        const totalGrams = gramsPerServing * quantity;
        const calories = totalGrams * caloriesPerGram;
        if (calories > 0) {
          if (!totals["Calories"]) totals["Calories"] = 0;
          totals["Calories"] += calories;
        }
      } else {
        const caloriesPerMl = (row.calories_per_ml as number) || 0;

        // For liquid: npc values are per container
        const amountPerCarton = (row.amount_per_carton_ml as number) || 1;
        const multiplier = mlPrepared / amountPerCarton;

        const nutrientMap: Record<string, string> = {
          "Protein": "total_protein_g",
          "Carbohydrates": "total_carbohydrate_g",
          "Fats": "total_fat_g",
          "Calcium": "npc_calcium_mg",
          "Iron": "npc_iron_mg",
          "Vitamin D": "npc_vitamin_d_mcg",
          "Potassium": "npc_potassium_mg",
          "Magnesium": "npc_magnesium_mg",
          "Zinc": "npc_zinc_mg",
          "Vitamin A": "npc_vitamin_a_mcg_re",
          "Vitamin E": "npc_vitamin_e_mg",
          "Vitamin C": "npc_vitamin_c_mg",
          "Vitamin K": "npc_vitamin_k_mcg",
          "Thiamin": "npc_thiamin_mg",
          "Riboflavin": "npc_riboflavin_mg",
          "Niacin": "npc_niacin_mg",
          "Vitamin B6": "npc_b6_mg",
          "Folate": "npc_folic_acid_mcg",
          "Vitamin B12": "npc_b12_mcg",
          "Pantothenic Acid": "npc_pantothenic_acid_mg",
          "Biotin": "npc_biotin_mcg",
          "Choline": "npc_choline_mg",
          "Chromium": "npc_chromium_mcg",
          "Copper": "npc_cooper_mg",
          "Fluoride": "fluoride",
          "Iodine": "npc_iodine_mcg",
          "Manganese": "npc_manganese_mg",
          "Phosphorus": "npc_phosphorus_mg",
          "Selenium": "npc_selenium_mcg",
          "Sodium": "npc_sodium_mg",
          "Chloride": "npc_chloride_mg",
          "Fiber": "fiber",
        };
        
        Object.entries(nutrientMap).forEach(([nutrientName, columnName]) => {
          const value = row[columnName] as number;
          if (value != null && !isNaN(value)) {
            if (!totals[nutrientName]) totals[nutrientName] = 0;
            totals[nutrientName] += value * multiplier;
          }
        });

        const calories = caloriesPerMl * mlPrepared;
        if (calories > 0) {
          if (!totals["Calories"]) totals["Calories"] = 0;
          totals["Calories"] += calories;
        }
      }
    });
    
    // Divide by servings per day
    Object.keys(totals).forEach((key) => {
      if (servings > 0) {
        totals[key] = totals[key] / servings;
      }
    });
    
    return totals;
  };


  const handleDeleteChecked = () => {
    const newSelectedIngredients = selectedIngredients.filter((_, index) => !checked[index]);
    const newChecked = newSelectedIngredients.map(() => false);
    setSelectedIngredients(newSelectedIngredients);
    setChecked(newChecked);
  };

  return (
    <>
    <div
      className="flex flex-col min-h-screen w-screen bg-gray p-2"
      id="formula_calc"
    >
        <Popup 
          popUp={popUp} 
          setPopUp={setPopUp}
          selectedIngredient={selectedIngredientForPopup?.row || null}
          ingredientType={selectedIngredientForPopup?.type}
          initialAmount={selectedIngredientForPopup ? (() => {
            // Find if this ingredient is already in selectedIngredients
            const existing = selectedIngredients.find(
              (si) => si.name === selectedIngredientForPopup.name
            );
            if (existing) {
              return parseAmount(existing.amount);
            }
            return null;
          })() : null}
          onAdd={(amount: string, servingType: string) => {
            if (selectedIngredientForPopup) {
              // Check if ingredient already exists in selected list
              const existingIndex = selectedIngredients.findIndex(
                (si) => si.name === selectedIngredientForPopup.name
              );
              if (existingIndex >= 0) {
                // Update existing ingredient
                const updated = [...selectedIngredients];
                updated[existingIndex] = {
                  ...updated[existingIndex],
                  amount: `${amount} ${servingType}`,
                };
                setSelectedIngredients(updated);
              } else {
                // Add new ingredient
                handleAddIngredient(selectedIngredientForPopup, amount, servingType);
              }
              setPopUp(false);
              setSelectedIngredientForPopup(null);
            }
          }}
        />
        <p className="text-3xl lg:text-5xl 2xl:text-6xl font-semibold w-fit rounded-[20px] p-2 mt-4 ml-[2dvw] mb-[2dvh]">
          Formula Calculator
        </p>
        <div className="flex flex-col md:flex-row min-h-screen">
          <div className="w-full md:w-[60dvw] flex flex-col items-center mb-10">
            <div className="flex flex-col text-black h-[10dvh] rounded ">
              <div className="flex flex-row w-full md:w-[50dvw] relative">
                <input
                  onFocus={() => setSearch(true)}
                  onBlur={() => setSearch(false)}
                  placeholder="Search Formulas and Add Ins"
                  onInput={(e) =>
                    setQuery((e.target as HTMLInputElement).value)
                  }
                  className="w-[70dvw] md:w-[40dvw] rounded-xl border p-1 lg:p-2 2xl:p-3 m-1 text-lg lg:text-xl 2xl:text-2xl"
                />
                <Select
                  onValueChange={(value) => {
                    switch (value) {
                      case "All":
                        setFilter("All");
                        break;
                      case "Powder":
                        setFilter("Powder");
                        break;
                      case "Liquid":
                        setFilter("Liquid");
                        break;
                      case "Favorites":
                        setFilter("Favorites");
                        break;
                    }
                  }}
                >
                  <SelectTrigger className="w-[20dvw] md:w-[10dvw] m-1 bg-white rounded-xl text-text xl:text-lg 2xl:text-xl px-2 py-1 lg:px-4 lg:py-2">
                    <SelectValue defaultValue="All" placeholder="All" />
                  </SelectTrigger>
                  <SelectContent className="bg-white w-fit rounded">
                    <SelectGroup className="bg-white">
                      <SelectItem
                        className="w-full bg-white rounded text-text px-4 py-2 hover:bg-primary"
                        value="All"
                      >
                        All
                      </SelectItem>
                      <SelectItem
                        className="w-full bg-white rounded text-text px-4 py-2 hover:bg-primary"
                        value="Powder"
                      >
                        Powder
                      </SelectItem>
                      <SelectItem
                        className="w-full bg-white rounded text-text px-4 py-2 hover:bg-primary"
                        value="Liquid"
                      >
                        Liquid
                      </SelectItem>
                      <SelectItem
                        className="w-full bg-white rounded text-text px-4 py-2 hover:bg-primary"
                        value="Favorites"
                      >
                        Favorites
                      </SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>

                <div
                  className={`${
                    search
                      ? "absolute top-full left-0 bg-white rounded w-full max-h-[40dvh] overflow-y-scroll no-scrollbar shadow-lg z-30 transition-all"
                      : "hidden"
                  }`}
                >
                  {filteredIngredients.map((ingredient, index) => (
                    <>
                      <div
                        className="w-full normal-case font-medium h-fit transition-all duration-200"
                        key={index}
                      >
                        <div className="flex flex-row text-lg lg:text-xl 2xl:text-2xl pl-[1dvw] py-[1dvh] text-start items-center hover:bg-gray-50">
                          <p className="w-2/5">{ingredient.name}</p>
                          <p className="w-2/5 text-medium">{ingredient.type}</p>
                          <div className="flex flex-row w-1/5 justify-end mr-[2%]">
                            <button
                              onMouseDown={() => handlePlusClick(ingredient)}
                              className="z-30 hover:bg-gray-200 place-self-end w-fit h-fit aspect-square transition-all"
                            >
                              <Plus className="w-8 aspect-square" />
                            </button>
                            <button
                              onClick={Heart}
                              className="z-30  ml-[1dvw] place-self-end w-fit h-fit aspect-square transition-all"
                            >
                              <HeartIcon className="w-8 aspect-square hover:fill-red-400" />
                            </button>
                          </div>
                        </div>
                      </div>
                      <hr className="w-full" />
                    </>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex flex-col h-[50dvh] w-full md:w-[50dvw] overflow-y-scroll border no-scrollbar bg-gray rounded-xl relative shadow-lg">
              <div className="w-full sticky top-0">
                <div className="flex flex-row w-full text-lg lg:text-xl 2xl:text-2xl bg-primary-400 font-medium py-[1dvh]">
                  <div className="w-[8%] flex justify-center items-center">
                  <button 
                        onClick={handleDeleteChecked}
                        className="p-0 m-0 space-x-0 hover:text-red-500 transition-colors"
                        title="Delete selected items"
                      >
                        <Trash2 className="w-8" />
                      </button>
                      </div>
                  <p className="w-1/4">Name</p>
                  <p className="w-1/4">Type</p>
                  <p className="w-1/4">Amount</p>
                  <div className="w-[12%] flex justify-end gap-2">
                    <button className="w-8">
                      <HeartIcon className="hover:fill-red-400" />
                    </button>
                    <button className="w-8">
                      <SquareArrowUpRight />
                    </button>
                  </div>
                </div>
                <hr className="w-full" />
              </div>
              {selectedIngredients.map((selectedIngredient, index) => (
                <div key={index}>
                  <div className="flex flex-row w-full text-lg lg:text-xl 2xl:text-2xl font-medium py-[1dvh]">
                    <div className="flex justify-center w-[8%]">
                      <button
                        onClick={() => toggleCheck(index)}
                        className="p-0 m-0 space-x-0"
                      >
                        {checked[index] ? (
                          <CheckSquare className="w-8 text-red-500" />
                        ) : (
                          <Square className="w-8" />
                        )}
                      </button>
                    </div>
                    <p className="w-1/4">{selectedIngredient.name}</p>
                    <p className="w-1/4">{selectedIngredient.type}</p>
                    <p className="w-1/4">{selectedIngredient.amount}</p>
                    <div className="flex justify-end w-[12%]">
                      <button
                        onClick={() => handleEllipsisClick(selectedIngredient)}
                        className="hover:bg-gray-100 rounded p-1"
                      >
                        <Ellipsis className="w-8" />
                      </button>
                    </div>
                  </div>
                  <hr className="w-full" />
                </div>
              ))}
            </div>
          </div>
         
          <div className="w-full md:w-[30dvw] flex flex-col">
            <div className="flex flex-row h-[10dvh] md:w-[50dvw]]">
            <p className="text-xl p-1 lg:p-2 2xl:p-3 m-1">Servings (per day):</p>
              <div className="flex flex-col">

                  <input
                    className="w-[20dvw] md:w-[10dvw] rounded-xl border p-1 lg:p-2 2xl:p-3 m-1 text-lg lg:text-xl 2xl:text-2xl shadow-sm"
                    type="number"
                    min="1"
                    value={servings}
                    placeholder="1"
                    onInput={(e) => {
                      const value = parseFloat((e.target as HTMLInputElement).value);
                      if (!isNaN(value) && value >= 1) {
                        setServings(value);
                      } else if ((e.target as HTMLInputElement).value === "") {
                        setServings(1);
                      }
                    }}
                  />
              </div>
              
            </div>
            <div>
            <div className="flex flex-col w-full border rounded-xl h-[75dvh] overflow-y-scroll no-scrollbar relative shadow-lg mb-10 md:mb-0">
              <div className="sticky top-0">
                <div className="flex flex-row w-full text-lg lg:text-xl 2xl:text-2xl bg-primary-400 font-medium py-[1dvh] pl-[1dvw]">
                  <p className="w-[40%]">Nutrient</p>
                  <p className="w-[30%]">Amount</p>
                  <p className="w-[30%]">DRI</p>
                </div>
                <hr className="w-full" />
              </div>

              {(() => {
                const calculatedNutrients = calculateNutrients();
                
                return nutrients.map((nutrient, index) => {
                  const idealNutrient = idealNutrients.find(
                    (ideal) => ideal.name === nutrient.name
                  );
                  const formattedIdeal = idealNutrient 
                    ? formatIdealAmount(nutrient.name, idealNutrient.amount, servings)
                    : "";
                  
                  // Format calculated amount
                  const calculatedValue = calculatedNutrients[nutrient.name] || 0;
                  let formattedAmount = "";
                  let isBelowThreshold = false;
                  
                  if (calculatedValue > 0) {
                    // Determine unit based on nutrient name
                    let unit = "";
                    if (nutrient.name === "Calories") {
                      unit = "cal";
                    } else if (nutrient.name === "Protein" || nutrient.name === "Carbohydrates" || nutrient.name === "Fats" || nutrient.name === "Fiber") {
                      unit = "g";
                    } else if (nutrient.name === "Holliday-Segar" || nutrient.name === "DRI Fluid") {
                      unit = nutrient.name === "DRI Fluid" ? "L" : "mL";
                    } else if (nutrient.name === "Chromium" || nutrient.name === "Iodine" || nutrient.name === "Selenium" || nutrient.name === "Biotin" || nutrient.name === "Folate" || nutrient.name === "Vitamin A" || nutrient.name === "Vitamin D" || nutrient.name === "Vitamin B12" || nutrient.name === "Molybdenum") {
                      // Nutrients that use mcg
                      unit = "mcg";
                    } else if (nutrient.name.includes("Vitamin") || nutrient.name === "Thiamin" || nutrient.name === "Riboflavin" || nutrient.name === "Niacin" || nutrient.name === "Pantothenic Acid" || nutrient.name === "Choline" || nutrient.name === "Iron" || nutrient.name === "Zinc" || nutrient.name === "Magnesium" || nutrient.name === "Manganese" || nutrient.name === "Copper" || nutrient.name === "Potassium" || nutrient.name === "Sodium" || nutrient.name === "Chloride" || nutrient.name === "Calcium" || nutrient.name === "Phosphorus") {
                      // Most vitamins and minerals use mg
                      unit = "mg";
                    }
                    
                    const roundedValue = Math.round(calculatedValue * 10) / 10;
                    formattedAmount = `${roundedValue} ${unit}`;
                    
                    // Check if below 67% of ideal - need to convert units for comparison
                    if (formattedIdeal && idealNutrient) {
                      const idealNumeric = parseAmountValue(formattedIdeal);
                      if (idealNumeric !== null && idealNumeric > 0) {
                        // Extract unit from ideal amount
                        const idealUnitMatch = formattedIdeal.match(/\d+(?:\.\d+)?\s*(cal|g|mg|mcg|μg|mL|L|RAE|DFE)/i);
                        const idealUnit = idealUnitMatch ? idealUnitMatch[1].toLowerCase() : "";
                        
                        // Convert both to same unit for comparison
                        let calculatedInSameUnit = calculatedValue;
                        let idealInSameUnit = idealNumeric;
                        
                        // Convert to base unit (mg for most, g for macros/calories)
                        if (nutrient.name === "Calories") {
                          // Calories don't need conversion
                          calculatedInSameUnit = calculatedValue;
                          idealInSameUnit = idealNumeric;
                        } else if (nutrient.name === "Protein" || nutrient.name === "Carbohydrates" || nutrient.name === "Fats" || nutrient.name === "Fiber") {
                          // Convert to grams
                          if (unit === "mg") calculatedInSameUnit = calculatedValue / 1000;
                          else if (unit === "mcg") calculatedInSameUnit = calculatedValue / 1000000;
                          
                          if (idealUnit === "mg") idealInSameUnit = idealNumeric / 1000;
                          else if (idealUnit === "mcg") idealInSameUnit = idealNumeric / 1000000;
                        } else {
                          // Convert to mg for vitamins/minerals
                          if (unit === "g") calculatedInSameUnit = calculatedValue * 1000;
                          else if (unit === "mcg") calculatedInSameUnit = calculatedValue / 1000;
                          
                          if (idealUnit === "g") idealInSameUnit = idealNumeric * 1000;
                          else if (idealUnit === "mcg") idealInSameUnit = idealNumeric / 1000;
                        }
                        
                        const percentage = (calculatedInSameUnit / idealInSameUnit) * 100;
                        isBelowThreshold = percentage < 67;
                      }
                    }
                  }
                  
                  return (
                    <div key={index} className="bg-background">
                      <div className="flex flex-row w-full text-lg lg:text-xl 2xl:text-2xl font-medium py-[1dvh] pl-[1dvw]">
                        <p className="w-[40%] overflow-x-hidden">{nutrient.name}</p>
                        <p className={`w-[30%] bg-white ${isBelowThreshold ? "text-red-500 font-bold" : ""}`}>
                          {formattedAmount || "-"}
                        </p>
                        <p className="w-[30%]">{formattedIdeal}</p>
                      </div>
                      <hr className="w-full" />
                    </div>
                  );
                });
              })()}
            </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default FormulaNeedsCalculator;