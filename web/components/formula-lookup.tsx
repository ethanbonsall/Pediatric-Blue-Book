import { HeartIcon, Search } from "lucide-react";
import { useState, useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import Popup from "./pop_up_lookup";
import { supabase } from "@/lib/supabase";

const FormulaNeedsCalculator = () => {
  const Heart = () => {
    return null;
  };
  const [search, setSearch] = useState(false);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("All");
  const [popUp, setPopUp] = useState(false);

  useEffect(() => {
    getIngredients();
  }, []);

  const [ingredients, setIngredients] = useState<{ name: string; type: string }[]>([]);

  const getIngredients = async () => {
    // Define a small row type to avoid implicit any
    type ProductRow = { product?: string | null };

   
    const [powderRes] = await Promise.all([
      supabase.from("powder_ingredients").select("product")
    ]);

    const [liquidRes] = await Promise.all([
      supabase.from("liquid_ingredients").select("product")
    ]);


    if (powderRes.error) console.error("powder_ingredients error:", powderRes.error);
    if (liquidRes.error) console.error("liquid_ingredients error:", liquidRes.error);

    

    const powderRows: ProductRow[] = powderRes.data ?? [];
    const liquidRows: ProductRow[] = liquidRes.data ?? [];

    const fetched = [
      ...powderRows.map((r) => ({ name: (r.product ?? "").toString().trim(), type: "Powder" })),
      ...liquidRows.map((r) => ({ name: (r.product ?? "").toString().trim(), type: "Liquid" })),
    ].filter((it) => it.name.length > 0);

    setIngredients((prev) => {
      const map = new Map<string, { name: string; type: string }>();
      [...prev, ...fetched].forEach((item) => map.set(item.name.toLowerCase(), item));
      return Array.from(map.values());
    });
  };

  const filteredIngredients = ingredients.filter(
    (ingredient) =>
      (ingredient.type === filter || filter === "All") &&
      ingredient.name.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div
      className="flex flex-col min-h-screen w-full bg-gradient-to-tr from-primary-500 to-primary-700 rounded-t-[20px] pb-2"
      id="formula_lookup"
    >
      <Popup popUp={popUp} setPopUp={setPopUp} />
      <p className="text-3xl lg:text-5xl 2xl:text-6xl font-semibold text-white w-fit rounded-[20px] p-2 mt-4 ml-[2dvw] mb-[2dvh]">
        Formula Lookup
      </p>
      <div className="flex flex-col md:flex-row min-h-screen">
        <div className="w-full flex flex-col mt-[2%] items-center">
          <div className="flex flex-col text-black h-[10dvh] rounded ">
            <div className="flex flex-row w-full relative">
              <input
                onFocus={() => setSearch(true)}
                onBlur={() => setSearch(false)}
                placeholder="Search Formulas and Add Ins"
                onInput={(e) => setQuery((e.target as HTMLInputElement).value)}
                className="w-[70dvw] rounded-xl border p-1 lg:p-2 2xl:p-3 m-1 text-lg lg:text-xl 2xl:text-2xl"
              />
              <Select
                onValueChange={(value) => {
                  switch (value) {
                    case "All":
                      setFilter("All");
                      break;
                    case "Formula":
                      setFilter("Formula");
                      break;
                    case "Add In":
                      setFilter("Add In");
                      break;
                    case "Favorites":
                      setFilter("Favorites");
                      break;
                  }
                }}
              >
                <SelectTrigger className="w-1/5 m-1 bg-white rounded-xl text-text xl:text-lg 2xl:text-xl px-2 py-1 lg:px-4 lg:py-2">
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
                      value="Formula"
                    >
                      Formula
                    </SelectItem>
                    <SelectItem
                      className="w-full bg-white rounded text-text px-4 py-2 hover:bg-primary"
                      value="Add In"
                    >
                      Add In
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
                    ? "absolute top-full left-0 bg-white rounded w-full max-h-4/5 overflow-y-scroll no-scrollbar shadow-lg z-30 transition-all"
                    : "hidden"
                }`}
              >
                
                {filteredIngredients.map((ingredient, index) => (
                  <>
                    <button
                      className="w-full normal-case font-medium h-fit transition-all duration-200"
                      key={index}
                    >
                      <div className="flex flex-row text-lg lg:text-xl 2xl:text-2xl pl-[1dvw] py-[1dvh] text-start items-center hover:bg-gray-50">
                        <p className="w-2/5">{ingredient.name}</p>
                        <p className="w-2/5 text-medium">{ingredient.type}</p>
                        <div className="flex flex-row w-1/5 justify-end mr-[2%]">
                          <button
                            onMouseDown={() => setPopUp(true)}
                            className="z-30 hover:bg-gray-200 place-self-end w-fit h-fit aspect-square transition-all"
                          >
                            <Search className="w-8 aspect-square" />
                          </button>
                          <button
                            onClick={Heart}
                            className="z-30  ml-[1dvw] place-self-end w-fit h-fit aspect-square transition-all"
                          >
                            <HeartIcon className="w-8 aspect-square hover:fill-red-400" />
                          </button>
                        </div>
                      </div>
                    </button>
                    <hr className="w-full" />
                  </>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormulaNeedsCalculator;
