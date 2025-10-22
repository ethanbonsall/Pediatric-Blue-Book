import {
  CheckSquare,
  Ellipsis,
  HeartIcon,
  Plus,
  Square,
  SquareArrowUpRight,
} from "lucide-react";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import Popup from "./pop_up";

const FormulaNeedsCalculator = () => {
  const [popUp, setPopUp] = useState(false);
  const Heart = () => {
    return null;
  };
  const [search, setSearch] = useState(false);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("All");

  const ingredients = [
    { name: "Formula A", type: "Formula" },
    { name: "Formula B", type: "Formula" },
    { name: "Add in 1", type: "Add In" },
    { name: "Add in 2", type: "Add In" },
    { name: "Add in 3", type: "Add In" },
    { name: "Formula C", type: "Formula" },
    { name: "Formula D", type: "Formula" },
    { name: "Formula E", type: "Formula" },
    { name: "Water", type: "Add In" },
    { name: "Formula 1.2", type: "Add In" },
    { name: "Formula 0.9", type: "Add In" },
  ];

  const nutrients = [
    { name: "Protein", amount: "50g" },
    { name: "Carbohydrates", amount: "300g" },
    { name: "Fats", amount: "70g" },
    { name: "Fiber", amount: "30g" },
    { name: "Vitamin C", amount: "90mg" },
    { name: "Calcium", amount: "1000mg" },
    { name: "Iron", amount: "18mg" },
    { name: "Vitamin D", amount: "600mg" },
    { name: "Potassium", amount: "4700mg" },
    { name: "Magnesium", amount: "400mg" },
    { name: "Zinc", amount: "11mg" },
    { name: "Vitamin A", amount: "900mcg" },
    { name: "Vitamin E", amount: "15mg" },
  ];

  const idealNutrients = [
    { name: "Protein", amount: "50g" },
    { name: "Carbohydrates", amount: "300g" },
    { name: "Fats", amount: "70g" },
    { name: "Fiber", amount: "30g" },
    { name: "Vitamin C", amount: "90mg" },
    { name: "Calcium", amount: "1000mg" },
    { name: "Iron", amount: "18mg" },
    { name: "Vitamin D", amount: "600mg" },
    { name: "Potassium", amount: "4700mg" },
    { name: "Magnesium", amount: "400mg" },
    { name: "Zinc", amount: "11mg" },
    { name: "Vitamin A", amount: "900mcg" },
    { name: "Vitamin E", amount: "15mg" },
  ];

  const filteredIngredients = ingredients.filter(
    (ingredient) =>
      (ingredient.type === filter || filter === "All") &&
      ingredient.name.toLowerCase().includes(query.toLowerCase())
  );

  const selectedIngredients: { name: string; type: string; amount: string }[] =
    [
      { name: "Formula A", type: "Formula", amount: "1 cup" },
      { name: "Formula B", type: "Formula", amount: "1 cup" },
      { name: "Add in 1", type: "Add In", amount: "1 cup" },
    ];

  const [checked, setChecked] = useState<boolean[]>(
    Array(selectedIngredients.length).fill(false)
  );

  const toggleCheck = (index: number) => {
    setChecked((prev) => prev.map((val, i) => (i === index ? !val : val)));
  };

  return (
    <>
    <div
      className="flex flex-col min-h-screen w-screen bg-gray p-2"
      id="formula_calc"
    >
        <Popup popUp={popUp} setPopUp={setPopUp} />
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
                              onMouseDown={() => setPopUp(true)}
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
                  <div className="w-[8%]"></div>
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
                      <button>
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
            <p className="text-xl p-1 lg:p-2 2xl:p-3 m-1">Servings:</p>
              <div className="flex flex-col">

                  <input
                    className="w-[20dvw] md:w-[10dvw] rounded-xl border p-1 lg:p-2 2xl:p-3 m-1 text-lg lg:text-xl 2xl:text-2xl shadow-sm"
                    type="number"
                    defaultValue={1}
                    placeholder="1"
                  />
              </div>
              
            </div>
            <div>
            <div className="flex flex-col w-full border rounded-xl h-[75dvh] overflow-y-scroll no-scrollbar relative shadow-lg mb-10 md:mb-0">
              <div className="sticky top-0">
                <div className="flex flex-row w-full text-lg lg:text-xl 2xl:text-2xl bg-primary-400 font-medium py-[1dvh] pl-[1dvw]">
                  <p className="w-[40%]">Nutrient</p>
                  <p className="w-[30%]">Amount</p>
                  <p className="w-[30%]">Ideal</p>
                </div>
                <hr className="w-full" />
              </div>

              {nutrients.map((nutrient, index) => (
                <div key={index} className="bg-background">
                  <div className="flex flex-row w-full text-lg lg:text-xl 2xl:text-2xl font-medium py-[1dvh] pl-[1dvw]">
                    <p className="w-[40%] overflow-x-hidden">{nutrient.name}</p>
                    <p className="w-[30%] bg-white">{nutrient.amount}</p>
                    <p className="w-[30%]">{idealNutrients[index].amount}</p>
                  </div>
                  <hr className="w-full" />
                </div>
              ))}
            </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default FormulaNeedsCalculator;