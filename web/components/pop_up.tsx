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

  const product_name =
    (s.product as string) ?? (s.company_brand as string) ?? "None";
  const product_age =
    (s.age as string) ?? (s.recommended_age as string) ?? "None";
  const protein_percent =
    ((s.npc_percent_cal_from_protein as string) ?? "0") + "%";
  const protein_source = (s.protein_sources as string) ?? "None";
  const fat_percent = ((s.npc_percent_cal_from_fat as string) ?? "0") + "%";
  const fat_source = (s.fat_sources as string) ?? "None";
  const carbohydrate_percent =
    ((s.npc_percent_cal_from_cho as string) ?? "0") + "%";
  const carbohydrate_source = (s.carbohydrate_sources as string) ?? "None";
  const prebiotic = (s.prebiotic as string) ?? "None";
  const probiotic = (s.probiotic as string) ?? "None";
  const water_percent = ((s.npc_percent_free_water as string) ?? "0") + "%";
  const allergens = (s.allergens as string) ?? "None";
  const company =
    (s.company_brand as string) ?? (s.company as string) ?? "None";

  const isWater =
    product_name.toLowerCase() === "water" ||
    product_name.toLowerCase() === "none";

  function convertToMl(quantity: number, servingType: string) {
    switch (servingType) {
      case "Cup":
        return quantity * 236.6;
      case "Tablespoon":
        return quantity * 14.8;
      case "Teaspoon":
        return quantity * 4.9;
      default:
        return 0;
    }
  }

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
      {
        value: "Scoop",
        label: "Scoop",
        available: Boolean(selectedIngredient?.grams_per_scoop),
      },
      {
        value: "Teaspoon",
        label: "Teaspoon",
        available: Boolean(selectedIngredient?.grams_per_teaspoon),
      },
      {
        value: "Tablespoon",
        label: "Tablespoon",
        available: Boolean(selectedIngredient?.grams_per_tablespoon),
      },
      {
        value: "Cup",
        label: "Cup",
        available: Boolean(selectedIngredient?.grams_per_cup),
      },
    ];

    return options
      .filter((option) => option.available)
      .map(({ value, label }) => ({ value, label }));
  }, [isPowder, selectedIngredient]);

  const hasServingOptions = availableServingOptions.length > 0;

  const [serving, setServing] = useState("1");
  const [servingType, setServingType] = useState(() =>
    hasServingOptions ? availableServingOptions[0].value : ""
  );

  useEffect(() => {
    if (!popUp) return;

    if (initialAmount) {
      setServing(initialAmount.amount);
    } else {
      setServing("1");
    }

    if (
      initialAmount &&
      availableServingOptions.some(
        (option) => option.value === initialAmount.servingType
      )
    ) {
      setServingType(initialAmount.servingType);
    } else if (hasServingOptions) {
      setServingType(availableServingOptions[0].value);
    } else {
      setServingType("");
    }
  }, [
    popUp,
    selectedIngredient,
    initialAmount,
    isPowder,
    availableServingOptions,
    hasServingOptions,
  ]);

  return (
    <div
      className={` ${
        popUp ? "fixed" : "hidden"
      } flex flex-col w-fit h-3/4 bg-primary-600 text-white p-4 lg:p-8 rounded-xl shadow-2xl z-50 top-[53%] left-1/2 transform -translate-x-1/2 -translate-y-1/2`}
    >
      <div className="flex justify-end">
        <button onClick={() => setPopUp(false)} className="mr-2">
          <X />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto pr-2 flex flex-col gap-y-4">
        {isWater ? (
          <>
            <p className="font-semibold text-2xl lg:text-3xl 2xl:text-4xl">
              Water
            </p>

            <p className="text-lg lg:text-xl 2xl:text-2xl">
              Amount:{" "}
              {convertToMl(parseFloat(serving) || 0, servingType).toFixed(1)} ml
            </p>
          </>
        ) : (
          <>
            <p className="font-semibold text-2xl lg:text-3xl 2xl:text-4xl">
              {product_name}
            </p>

            <p className="text-lg lg:text-xl 2xl:text-2xl">
              <span className="font-medium">Recommended Age:</span>{" "}
              {product_age}
            </p>

            <p className="text-lg lg:text-xl 2xl:text-2xl">
              <span className="font-medium">Company:</span> {company}
            </p>

            <p className="text-lg lg:text-xl 2xl:text-2xl">
              <span className="font-medium">PRO ({protein_percent}):</span>{" "}
              {protein_source}
            </p>

            <p className="text-lg lg:text-xl 2xl:text-2xl">
              <span className="font-medium">Fat ({fat_percent}):</span>{" "}
              {fat_source}
            </p>

            <p className="text-lg lg:text-xl 2xl:text-2xl">
              <span className="font-medium">CHO ({carbohydrate_percent}):</span>{" "}
              {carbohydrate_source}
            </p>

            <p className="text-lg lg:text-xl 2xl:text-2xl">
              <span className="font-medium">Prebiotic:</span> {prebiotic}
            </p>

            <p className="text-lg lg:text-xl 2xl:text-2xl">
              <span className="font-medium">Probiotic:</span> {probiotic}
            </p>

            <p className="text-lg lg:text-xl 2xl:text-2xl">
              <span className="font-medium">Water (standard dilution):</span>{" "}
              {water_percent}
            </p>

            <p className="text-lg lg:text-xl 2xl:text-2xl">
              <span className="font-medium">Allergens:</span> {allergens}
            </p>
          </>
        )}
      </div>

      <div className="mt-4 flex flex-col gap-y-3">
        <div className="flex flex-row w-fit h-fit gap-x-2 items-center">
          <input
            className="px-2 2xl:px-4 rounded w-fit h-full text-black"
            type="number"
            value={serving}
            placeholder="1"
            onInput={(e) => setServing((e.target as HTMLInputElement).value)}
          />
          <Select
            value={servingType}
            onValueChange={(value) => setServingType(value)}
            disabled={!hasServingOptions}
          >
            <SelectTrigger className="w-[30dvw] md:w-[8dvw] lg:w-[10dvw] bg-white rounded text-text xl:text-lg 2xl:text-xl px-2 py-1 lg:px-4 lg:py-2">
              <SelectValue
                placeholder={
                  hasServingOptions ? availableServingOptions[0].label : "N/A"
                }
              />
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
    </div>
  );
};

export default Popup;
