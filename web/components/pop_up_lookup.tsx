import { X } from "lucide-react";

const Popup = ({
  popUp,
  setPopUp,
}: {
  popUp: boolean;
  setPopUp: (val: boolean) => void;
}) => {
  const product_name = "Product Name";
  const product_age = "Age (0-12)";
  const protein_percent = "10%";
  const protein_source = "Protein Place";
  const fat_percent = "20%";
  const fat_source = "Fat Place";
  const carbohydrate_percent = "70%";
  const carbohydrate_source = "Carb Place";
  const prebiotic = "Prebiotic";
  const probiotic = "Probiotic";
  const water_percent = "90.5%";
  const allergen = "Allergen";

  return (
    <div
      className={` ${
        popUp ? "fixed" : "hidden"
      } flex flex-col h-fit w-fit gap-y-4 justify-center top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-primary text-white p-4 lg:p-8 rounded-xl shadow-2xl z-50`}
    >
      <button onClick={() => setPopUp(false)} className="mr-4">
        <X />
      </button>
      <p className="text-2xl lg:text-3xl 2xl:text-4xl">{product_name}</p>
      <p className="text-lg lg:text-xl 2xl:text-2xl">
        Recommended Age: {product_age}
      </p>

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

      <p className="text-lg lg:text-xl 2xl:text-2xl">Allergens: {allergen}</p>
    </div>
  );
};
export default Popup;
