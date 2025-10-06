import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import Link from "next/link";

const NutrientNeedsCalculator = () => {
  let agePlaceholder = "Years 0-18";
  let max = 18;
  let measurment = "cm";
  let measurmentLength = "cm";

  const [age, setAge] = useState("");
  const [ageUnit, setAgeUnit] = useState("Years");
  const [height, setHeight] = useState("");
  const [heightUnit, setHeightUnit] = useState("Metric");
  const [heightInches, setHeightInches] = useState("");
  const [length, setLength] = useState("");
  const [lengthUnit, setLengthUnit] = useState("Metric");
  const [lengthInches, setLengthInches] = useState("");
  const [sex, setSex] = useState("");
  const [activityLevel, setActivityLevel] = useState("");
  const [needsType, setNeedsType] = useState("");

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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    const numericValue = inputValue
      .replace(/[^0-9.]/g, "")
      .replace(/(\..*?)\..*/g, "$1");

    e.target.value = numericValue;
    setAge(numericValue);
  };
  const handleHeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    const numericValue = inputValue
      .replace(/[^0-9.]/g, "")
      .replace(/(\..*?)\..*/g, "$1");
    e.target.value = numericValue;
    setHeight(numericValue);
  };
  const handleLengthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    const numericValue = inputValue
      .replace(/[^0-9.]/g, "")
      .replace(/(\..*?)\..*/g, "$1");

    e.target.value = numericValue;
    setLength(numericValue);
  };
  const handleHeightChangeInches = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    const numericValue = inputValue.replace(/[^0-9]/g, "");
    e.target.value = numericValue;
    setHeightInches(numericValue);
  };
  const handleLengthChangeInches = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    const numericValue = inputValue.replace(/[^0-9]/g, "");
    e.target.value = numericValue;
    setLengthInches(numericValue);
  };

  const calculate = () => {
    const number =
      age +
      height +
      heightInches +
      length +
      lengthInches +
      sex +
      activityLevel +
      needsType;
    return number;
  };

  const printNutrientPDF = () => {
    return null;
  };

  if (ageUnit === "Years") {
    agePlaceholder = "Years (0-18)";
    max = 18;
  } else if (ageUnit === "Months") {
    agePlaceholder = "Months (0-36)";
    max = 36;
  } else if (ageUnit === "Weeks") {
    agePlaceholder = "Weeks (0-52)";
    max = 52;
  }
  if (heightUnit === "Imperial") {
    measurment = "ft";
  } else if (heightUnit === "Metric") {
    measurment = "cm";
  }

  if (lengthUnit === "Imperial") {
    measurmentLength = "ft";
  } else if (lengthUnit === "Metric") {
    measurmentLength = "cm";
  }
  const heightBool = heightUnit === "Imperial" ? true : false;
  const lengthBool = lengthUnit === "Imperial" ? true : false;
  const BMI50 = "30 lbs";
  const BMI25 = "25 lbs";
  const Catchup = "10 cm";

  return (
    <div
      className="flex flex-col bg-gradient-to-tl from-primary-200 to-primary-400 w-full h-fit mb-4 pb-4"
      id="nutrient"
    >
      <p className="text-3xl lg:text-5xl 2xl:text-6xl font-semibold w-fit rounded-[20px] p-2 mt-[8dvh] mb-[2dvh] ml-[2dvw]">
        Nutrient Needs Calculator
      </p>
      <div className="grid grid-cols-1 md:grid-cols-3 min-h-[50dvh] gap-[3dvh] md:gap-[3dvw] px-1 md:px-[3dvw] items-center md:items-start justify-center">
        <div className="flex flex-col gap-y-[2dvh] 2xl:gap-y-[3dvh] h-full bg-white rounded-[20px] shadow-2xl p-[2dvw]">
          <div className="flex flex-col gap-y-1">
            <p className="text-2xl xl:text-3xl 2xl:text-4xl font-medium">Age</p>
            <div className="flex flex-row gap-x-1 lg:gap-x-2 w-full">
              <input
                className="border rounded focus:outline-none xl:text-lg 2xl:text-xl p-1 lg:p-2 w-[60%]"
                inputMode="numeric"
                min="0"
                max={max}
                onInput={handleInputChange}
                placeholder={agePlaceholder}
              ></input>
              <Select
                onValueChange={(value) => {
                  switch (value) {
                    case "Years":
                      setAgeUnit("Years");
                      break;
                    case "Months":
                      setAgeUnit("Months");
                      break;
                    case "Weeks":
                      setAgeUnit("Weeks");
                      break;
                  }
                }}
              >
                <SelectTrigger className="w-[33%] bg-white rounded text-text xl:text-lg 2xl:text-xl px-2 py-1 lg:px-4 lg:py-2">
                  <SelectValue defaultValue="Years" placeholder="Years" />
                </SelectTrigger>
                <SelectContent className="bg-white w-fit rounded">
                  <SelectGroup className="bg-white">
                    <SelectItem
                      className="w-full bg-white rounded text-text px-4 py-2 hover:bg-primary"
                      value="Years"
                    >
                      Years
                    </SelectItem>
                    <SelectItem
                      className="w-full bg-white rounded text-text px-4 py-2 hover:bg-primary"
                      value="Months"
                    >
                      Months
                    </SelectItem>
                    <SelectItem
                      className="w-full bg-white rounded text-text px-4 py-2 hover:bg-primary"
                      value="Weeks"
                    >
                      Weeks
                    </SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex flex-col gap-y-1">
            <p className="text-2xl xl:text-3xl 2xl:text-4xl font-medium">
              Height
            </p>
            <div className="flex flex-row gap-x-1 lg:gap-x-2 w-full">
              <input
                className={`${
                  heightBool ? "w-[26.5%]" : " w-[55%]"
                } border rounded focus:outline-none xl:text-lg 2xl:text-xl p-1 lg:p-2 `}
                inputMode="numeric"
                min="0"
                onInput={handleHeightChange}
                placeholder="Height"
              ></input>
              <p className="text-md font-medium self-center">{measurment}</p>
              <input
                className={`${
                  heightBool ? "block w-[26%]" : "hidden"
                } border rounded focus:outline-none xl:text-lg 2xl:text-xl p-1 lg:p-2`}
                inputMode="numeric"
                min="0"
                onInput={handleHeightChangeInches}
              ></input>
              <p
                className={`${
                  heightBool ? "block" : "hidden"
                } text-md font-medium self-center`}
              >
                in
              </p>

              <Select
                onValueChange={(value) => {
                  switch (value) {
                    case "Metric":
                      setHeightUnit("Metric");
                      break;
                    case "Imperial":
                      setHeightUnit("Imperial");
                      break;
                  }
                }}
              >
                <SelectTrigger className="w-[33%] bg-white rounded text-text xl:text-lg 2xl:text-xl px-2 py-1 lg:px-4 lg:py-2">
                  <SelectValue defaultValue="Metric" placeholder="Metric" />
                </SelectTrigger>
                <SelectContent className="bg-white w-fit rounded">
                  <SelectGroup className="bg-white">
                    <SelectItem
                      className="w-full bg-white rounded text-text px-4 py-2 hover:bg-primary"
                      value="Metric"
                    >
                      Metric
                    </SelectItem>
                    <SelectItem
                      className="w-full bg-white rounded text-text px-4 py-2 hover:bg-primary"
                      value="Imperial"
                    >
                      Imperial
                    </SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex flex-col gap-y-1">
            <p className="text-2xl xl:text-3xl 2xl:text-4xl font-medium">
              Length
            </p>
            <div className="flex flex-row gap-x-1 lg:gap-x-2 w-full">
              <input
                className={`${
                  lengthBool ? "w-[26.5%] " : " w-[55%] "
                } border rounded focus:outline-none xl:text-lg 2xl:text-xl p-1 lg:p-2 `}
                inputMode="numeric"
                min="0"
                onInput={handleLengthChange}
                placeholder="Height"
              ></input>
              <p className="text-md font-medium self-center">
                {measurmentLength}
              </p>
              <input
                className={`${
                  lengthBool ? "block w-[26%] " : "hidden"
                } border rounded focus:outline-none xl:text-lg 2xl:text-xl p-1 lg:p-2`}
                inputMode="numeric"
                min="0"
                onInput={handleLengthChangeInches}
              ></input>
              <p
                className={`${
                  lengthBool ? "block" : "hidden"
                } text-md font-medium self-center`}
              >
                in
              </p>

              <Select
                onValueChange={(value) => {
                  switch (value) {
                    case "Metric":
                      setLengthUnit("Metric");
                      break;
                    case "Imperial":
                      setLengthUnit("Imperial");
                      break;
                  }
                }}
              >
                <SelectTrigger className="w-[33%]  bg-white rounded text-text xl:text-lg 2xl:text-xl px-2 py-1 lg:px-4 lg:py-2">
                  <SelectValue defaultValue="Metric" placeholder="Metric" />
                </SelectTrigger>
                <SelectContent className="bg-white w-fit rounded">
                  <SelectGroup className="bg-white">
                    <SelectItem
                      className="w-full bg-white rounded text-text px-4 py-2 hover:bg-primary"
                      value="Metric"
                    >
                      Metric
                    </SelectItem>
                    <SelectItem
                      className="w-full bg-white rounded text-text px-4 py-2 hover:bg-primary"
                      value="Imperial"
                    >
                      Imperial
                    </SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex flex-col gap-y-1">
            <p className="text-2xl xl:text-3xl 2xl:text-4xl font-medium">Sex</p>
            <Select
              onValueChange={(value) => {
                switch (value) {
                  case "Male":
                    setSex("Male");
                    break;
                  case "Female":
                    setSex("Female");
                    break;
                }
              }}
            >
              <SelectTrigger className="w-[60%]  bg-white rounded text-text xl:text-lg 2xl:text-xl px-2 py-1 lg:px-4 lg:py-2">
                <SelectValue defaultValue="Male" placeholder="Select Sex" />
              </SelectTrigger>
              <SelectContent className="bg-white w-fit rounded">
                <SelectGroup className="bg-white">
                  <SelectItem
                    className="w-full bg-white rounded text-text px-4 py-2 hover:bg-primary"
                    value="Male"
                  >
                    Male
                  </SelectItem>
                  <SelectItem
                    className="w-full bg-white rounded text-text px-4 py-2 hover:bg-primary"
                    value="Female"
                  >
                    Female
                  </SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-y-1">
            <p className="text-2xl xl:text-3xl 2xl:text-4xl font-medium">
              Activity Level
            </p>
            <Select
              onValueChange={(value) => {
                switch (value) {
                  case "Not Applicable":
                    setActivityLevel("Not Applicable");
                    break;
                  case "Inactive":
                    setActivityLevel("Inactive");
                    break;
                  case "Low Active":
                    setActivityLevel("Low Active");
                    break;
                  case "Active":
                    setActivityLevel("Active");
                    break;
                  case "Very Active":
                    setActivityLevel("Very Active");
                    break;
                }
              }}
            >
              <SelectTrigger className="w-[60%]  bg-white rounded text-text xl:text-lg 2xl:text-xl px-2 py-1 lg:px-4 lg:py-2">
                <SelectValue
                  defaultValue="Not Applicable"
                  placeholder="Select Activity Level"
                />
              </SelectTrigger>
              <SelectContent className="bg-white w-fit rounded">
                <SelectGroup className="bg-white">
                  <SelectItem
                    className="w-full bg-white rounded text-text px-4 py-2 hover:bg-primary"
                    value="Not Applicable"
                  >
                    Not Applicable
                  </SelectItem>
                  <SelectItem
                    className="w-full bg-white rounded text-text px-4 py-2 hover:bg-primary"
                    value="Inactive"
                  >
                    Inactive
                  </SelectItem>
                  <SelectItem
                    className="w-full bg-white rounded text-text px-4 py-2 hover:bg-primary"
                    value="Low Active"
                  >
                    Low Active
                  </SelectItem>
                  <SelectItem
                    className="w-full bg-white rounded text-text px-4 py-2 hover:bg-primary"
                    value="Active"
                  >
                    Active
                  </SelectItem>
                  <SelectItem
                    className="w-full bg-white rounded text-text px-4 py-2 hover:bg-primary"
                    value="Very Active"
                  >
                    Very Active
                  </SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-y-1">
            <p className="text-2xl xl:text-3xl 2xl:text-4xl font-medium">
              Needs Type
            </p>
            <Select
              onValueChange={(value) => {
                switch (value) {
                  case "Standard":
                    setNeedsType("Standard");
                    break;
                  case "Reduced":
                    setNeedsType("Reduced");
                    break;
                  case "Increased":
                    setNeedsType("Increased");
                    break;
                }
              }}
            >
              <SelectTrigger className="w-[60%]  bg-white rounded text-text xl:text-lg 2xl:text-xl px-2 py-1 lg:px-4 lg:py-2">
                <SelectValue
                  defaultValue="Standard"
                  placeholder="Select Needs Type"
                />
              </SelectTrigger>
              <SelectContent className="bg-white w-fit rounded">
                <SelectGroup className="bg-white">
                  <SelectItem
                    className="w-full bg-white rounded text-text px-4 py-2 hover:bg-primary"
                    value="Standard"
                  >
                    Standard (BMI at 50%ile)
                  </SelectItem>
                  <SelectItem
                    className="w-full bg-white rounded text-text px-4 py-2 hover:bg-primary"
                    value="Reduced"
                  >
                    Reduced (BMI at 25%ile)
                  </SelectItem>
                  <SelectItem
                    className="w-full bg-white rounded text-text px-4 py-2 hover:bg-primary"
                    value="Increased"
                  >
                    Increased (Catch-up Growth)
                  </SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <button
            className="rounded text-white bg-primary-600 px-6 py-3 w-fit text-md xl:text-lg 2xl:text-xl hover:bg-primary-700 transition-all duration-300 self-end mt-6 mb-4 lg:mb-0"
            onClick={calculate}
          >
            Calculate
          </button>
        </div>
        <div className="flex flex-col h-full bg-white rounded-[20px] shadow-2xl p-[2dvw] gap-y-[1dvh]">
          <>
            <p className="text-lg xl:text-xl 2xl:text-2xl font-bold">
              Daily Estimated Nutritional Needs
            </p>
            <p className="text-lg xl:text-xl 2xl:text-2xl ">
              Needs are based on the selected needs type
            </p>
          </>
          <div className="flex flex-col w-full border rounded-[20px] min-h-[75%] max-h-[65dvh] overflow-y-scroll no-scrollbar relative">
            <div className="sticky top-0">
              <div className="flex flex-row text-xl lg:text-2xl pl-[1dvw] py-[1dvh] font-semibold bg-white">
                <p className="w-[55%] ">Nutrient</p>
                <p className="w-[35%] ">Amount</p>
              </div>
              <hr className="w-full" />
            </div>

            {nutrients.map((nutrient, index) => (
              <div key={index}>
                <div className="flex flex-row text-xl lg:text-2xl pl-[1dvw] py-[1dvh]">
                  <p className="w-[55%]">{nutrient.name}</p>
                  <p className="w-[35%]">{nutrient.amount}</p>
                </div>
                <hr className="w-full" />
              </div>
            ))}
          </div>
        </div>
        <div className="flex flex-col h-full items-center justify-center md:justify-start">
          <div className="flex flex-col w-full bg-white rounded-[20px] shadow-2xl p-[2dvw] md:p-[1dvw] gap-y-[4dvh]">
            <p className="text-3xl md:text-4xl 2xl:text-6l font-semibold">
              Ideal Body Weight
            </p>
            <div className="flex flex-row text-lg lg:text-xl 2xl:text-3xl ">
              <p className="font-semibold">
                BMI (50th Percentile for age):&nbsp;
              </p>
              <p>{BMI50}</p>
            </div>
            <div className="flex flex-row text-lg lg:text-xl 2xl:text-3xl ">
              <p className="font-semibold">
                BMI (25th Percentile for age):&nbsp;
              </p>
              <p>{BMI25}</p>
            </div>
            <div className="flex flex-row text-lg lg:text-xl 2xl:text-3xl">
              <p className="font-semibold">Catch up Growth:&nbsp;</p>
              <p>{Catchup}</p>
            </div>
          </div>
          <div className="flex flex-row justify-center gap-x-[8dvw] md:gap-x-[1dvw] md:w-fit mt-[5dvh] mb-[1dvh] h-fit self-center">
            <Link
              className="flex uppercase w-fit bg-primary-600 hover:bg-primary-700 transition-all px-2 py-1 lg:px-4 lg:py-2 2xl:px-6 2xl:py-3 rounded text-nowrap text-white text-center text-md lg:text-lg xl:text-xl 2xl:text-2xl font-semibold"
              href="#formula_calc"
            >
              Formula Calc
            </Link>
            <button
              onClick={printNutrientPDF}
              className="flex w-fit bg-primary-600 hover:bg-primary-700 transition-all px-2 py-1 lg:px-4 lg:py-2 2xl:px-6 2xl:py-3 text-nowrap items-center rounded text-white text-center text-md lg:text-lg xl:text-xl 2xl:text-2xl font-semibold"
            >
              Print Out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default NutrientNeedsCalculator;
