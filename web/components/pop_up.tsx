import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectItem,
} from "./ui/select";
import { Plus, X } from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import type { ProductRow } from "@/lib/types";

const Popup = ({
  popUp,
  setPopUp,
  selectedIngredient,
  onAdd,
  initialAmount,
  ingredientType,
}: {
  popUp: boolean;
  setPopUp: (val: boolean) => void;
  selectedIngredient?: ProductRow | null;
  onAdd?: (amount: string, servingType: string) => void;
  initialAmount?: { amount: string; servingType: string } | null;
  ingredientType?: string;
}) => {
  const s = selectedIngredient ?? {};
  const product_name = (s.product as string) ?? (s.company_brand as string) ?? "?";
  const product_age = (s.age as string) ?? (s.recommended_age as string) ?? "?";
  const protein_percent = ((s.npc_percent_cal_from_protein as string) ?? "?") + "%";
  const protein_source = (s.protein_sources as string) ?? "?";
  const fat_percent = ((s.npc_percent_cal_from_fat as string) ?? "?") + "%";
  const fat_source = (s.fat_sources as string) ?? "?";
  const carbohydrate_percent = ((s.npc_percent_cal_from_cho as string) ?? "?") + "%";
  const carbohydrate_source = (s.carbohydrate_sources as string) ?? "?";
  const prebiotic = (s.prebiotic as string) ?? "?";
  const probiotic = (s.probiotic as string) ?? "?";
  const water_percent = ((s.npc_percent_free_water as string) ?? "?") + "%";
  const isPowder = ingredientType === "Powder";
  const availableServingOptions = useMemo(() => {
    if (!isPowder) {
      return [
        { value: "Teaspoon", label: "Teaspoon" },
        { value: "Tablespoon", label: "Tablespoon" },
        { value: "Cup", label: "Cup" },
      ];
    }

    const options = [
      { value: "Scoop", label: "Scoop", available: Boolean(selectedIngredient?.grams_per_scoop) },
      { value: "Teaspoon", label: "Teaspoon", available: Boolean(selectedIngredient?.grams_per_teaspoon) },
      { value: "Tablespoon", label: "Tablespoon", available: Boolean(selectedIngredient?.grams_per_tablespoon) },
      { value: "Cup", label: "Cup", available: Boolean(selectedIngredient?.grams_per_cup) },
    ];

    return options.filter((option) => option.available).map(({ value, label }) => ({ value, label }));
  }, [isPowder, selectedIngredient]);

  const hasServingOptions = availableServingOptions.length > 0;

  const [serving, setServing] = useState("1");
  const [servingType, setServingType] = useState(() =>
    hasServingOptions ? availableServingOptions[0].value : ""
  );
  const allergens = (s.allergens as string) ?? "?";
  const company = (s.company_brand as string) ?? (s.company as string) ?? "?";

  // Reset serving when popup opens or ingredient changes, or use initialAmount if provided
  useEffect(() => {
    if (!popUp) return;

    if (initialAmount) {
      setServing(initialAmount.amount);
    } else {
      setServing("1");
    }

    if (initialAmount && availableServingOptions.some((option) => option.value === initialAmount.servingType)) {
      setServingType(initialAmount.servingType);
    } else if (hasServingOptions) {
      setServingType(availableServingOptions[0].value);
    } else {
      setServingType("");
    }
  }, [popUp, selectedIngredient, initialAmount, isPowder, availableServingOptions, hasServingOptions]);

  return (
    <div
      className={` ${
        popUp ? "fixed" : "hidden"
      } flex flex-col h-fit w-fit gap-y-4 justify-center top-[53%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-primary-600 text-white p-4 lg:p-8 rounded-xl shadow-2xl z-50`}
    >
      <button onClick={() => setPopUp(false)} className="mr-4">
        <X />
      </button>
      <p className="text-2xl lg:text-3xl 2xl:text-4xl">{product_name}</p>
      <p className="text-lg lg:text-xl 2xl:text-2xl">
        Recommended Age: {product_age}
      </p>
      <p className="text-lg lg:text-xl 2xl:text-2xl">Company: {company}</p>

      <p className="text-lg lg:text-xl 2xl:text-2xl">
        PRO ({protein_percent}): {protein_source}
      </p>

      <p className="text-lg lg:text-xl 2xl:text-2xl">
        Fat ({fat_percent}): {fat_source}
      </p>

      <p className="text-lg lg:text-xl 2xl:text-2xl">
        CHO ({carbohydrate_percent}): {carbohydrate_source}
      </p>

      <p className="text-lg lg:text-xl 2xl:text-2xl">Prebiotic: {prebiotic}</p>

      <p className="text-lg lg:text-xl 2xl:text-2xl">Probiotic: {probiotic}</p>

      <p className="text-lg lg:text-xl 2xl:text-2xl">
        Water (at standard dilution): {water_percent}
      </p>

      <p className="text-lg lg:text-xl 2xl:text-2xl">Allergens: {allergens}</p>
      <div className="flex flex-row w-fit h-fit gap-x-1">
        <input
          className="px-2 2xl:px-4 rounded text-black"
          type="number"
          value={serving}
          placeholder="1"
          onInput={(e) => setServing((e.target as HTMLInputElement).value)}
        />
        <Select
          value={servingType}
          onValueChange={(value) => {
            switch (value) {
              case "Scoop":
                setServingType("Scoop");
                break;
              case "Teaspoon":
                setServingType("Teaspoon");
                break;
              case "Tablespoon":
                setServingType("Tablespoon");
                break;
              case "Cup":
                setServingType("Cup");
                break;
            }
          }}
          disabled={!hasServingOptions}
        >
          <SelectTrigger className="w-[30dvw] md:w-[8dvw] h-full  bg-white rounded text-text xl:text-lg 2xl:text-xl px-2 py-1 lg:px-4 lg:py-2">
            <SelectValue placeholder={hasServingOptions ? availableServingOptions[0].label : "N/A"} />
          </SelectTrigger>
          <SelectContent className="bg-white w-fit rounded">
            <SelectGroup className="bg-white">
              {availableServingOptions.map((option) => (
                <SelectItem
                  key={option.value}
                  className="w-full bg-white rounded text-text px-4 py-2 hover:bg-primary"
                  value={option.value}
                >
                  {option.label}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      <div className="flex flex-row justify-end">
        <button 
          disabled={!hasServingOptions || !servingType}
          onClick={() => {
            if (onAdd && servingType) {
              onAdd(serving, servingType);
            }
          }}
          className={`flex flex-row items-center py-1 px-2 lg:py-2 lg:px-4 2xl:py-3 2xl:px-6 w-fit rounded ${
            !hasServingOptions || !servingType
              ? "bg-primary-500 cursor-not-allowed opacity-50"
              : "bg-primary-700 hover:bg-primary-800"
          }`}
        >
          Add &nbsp; <Plus />
        </button>
      </div>
    </div>
  );
};
export default Popup;
