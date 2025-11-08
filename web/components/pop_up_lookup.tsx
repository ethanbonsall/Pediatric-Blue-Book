import { X } from "lucide-react";
import type { ProductRow } from "@/lib/types";

const Popup = ({
  popUp,
  setPopUp,
  selectedIngredient,
}: {
  popUp: boolean;
  setPopUp: (val: boolean) => void;
  selectedIngredient?: ProductRow | null;
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
  const allergen = (s.allergens as string) ?? "?";
  const company = (s.company_brand as string) ?? (s.company as string) ?? "?";

  return (
    <div
      className={` ${
        popUp ? "fixed" : "hidden"
      } flex flex-col max-h-[80dvh] w-fit top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-[53%] bg-primary-700 text-white p-4 lg:p-8 rounded-xl shadow-2xl z-50`}
    >
      <div className="flex justify-end">
      <button onClick={() => setPopUp(false)} className="mr-2">
        <X />
      </button>
      </div>
      <div className="flex flex-col flex-1 overflow-y-auto gap-y-4">
      <p className="font-semibold text-2xl lg:text-3xl 2xl:text-4xl">{product_name}</p>
      <p className="text-lg lg:text-xl 2xl:text-2xl">
        <span className="font-medium">Recommended Age:</span> {product_age}
      </p>
      <p className="text-lg lg:text-xl 2xl:text-2xl"><span className="font-medium">Company:</span> {company}</p>
      <p className="text-lg lg:text-xl 2xl:text-2xl">
        <span className="font-medium">PRO ({protein_percent}):</span> {protein_source}
      </p>

      <p className="text-lg lg:text-xl 2xl:text-2xl">
        <span className="font-medium">Fat ({fat_percent}):</span> {fat_source}
      </p>

      <p className="text-lg lg:text-xl 2xl:text-2xl">
        <span className="font-medium">CHO ({carbohydrate_percent}):</span> {carbohydrate_source}
      </p>

      <p className="text-lg lg:text-xl 2xl:text-2xl"><span className="font-medium">Prebiotic:</span> {prebiotic}</p>

      <p className="text-lg lg:text-xl 2xl:text-2xl"><span className="font-medium">Probiotic:</span> {probiotic}</p>

      <p className="text-lg lg:text-xl 2xl:text-2xl">
        <span className="font-medium">Water (at standard dilution):</span> {water_percent}
      </p>

      <p className="text-lg lg:text-xl 2xl:text-2xl"><span className="font-medium">Allergens:</span> {allergen}</p>
    </div>
    </div>
  );
};
export default Popup;
