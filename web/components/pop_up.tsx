import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectItem,
} from "./ui/select";
import { Plus, X } from "lucide-react";
import { useState } from "react";

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
  const allergens = "allergen";
  const [serving, setServing] = useState("");
  const [servingType, setServingType] = useState("");

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

      <p className="text-lg lg:text-xl 2xl:text-2xl">Allergens: {allergens}</p>
      <div className="flex flex-row w-fit h-fit gap-x-1">
        <input
          className="px-2 2xl:px-4 rounded text-black"
          type="number"
          defaultValue={1}
          placeholder="1"
          onInput={(e) => setServing((e.target as HTMLInputElement).value)}
        />
        <Select
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
        >
          <SelectTrigger className="w-[30dvw] md:w-[8dvw] h-full  bg-white rounded text-text xl:text-lg 2xl:text-xl px-2 py-1 lg:px-4 lg:py-2">
            <SelectValue defaultValue="Scoop" placeholder="Scoop" />
          </SelectTrigger>
          <SelectContent className="bg-white w-fit rounded">
            <SelectGroup className="bg-white">
              <SelectItem
                className="w-full bg-white rounded text-text px-4 py-2 hover:bg-primary"
                value="Scoop"
              >
                Scoop
              </SelectItem>
              <SelectItem
                className="w-full bg-white rounded text-text px-4 py-2 hover:bg-primary"
                value="Teaspoon"
              >
                Teaspoon
              </SelectItem>
              <SelectItem
                className="w-full bg-white rounded text-text px-4 py-2 hover:bg-primary"
                value="Tablespoon"
              >
                Tablespoon
              </SelectItem>
              <SelectItem
                className="w-full bg-white rounded text-text px-4 py-2 hover:bg-primary"
                value="Cup"
              >
                Cup
              </SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      <div className="flex flex-row justify-end">
        <button className="flex flex-row items-center py-1 px-2 lg:py-2 lg:px-4 2xl:py-3 2xl:px-6 bg-primary-700 hover:bg-primary-800 w-fit rounded">
          Add &nbsp; <Plus />
        </button>
      </div>
    </div>
  );
};
export default Popup;
