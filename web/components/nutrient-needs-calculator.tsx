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
import { supabase } from "@/lib/supabase";

const NutrientNeedsCalculator = () => {
  let agePlaceholder = "Years 0-17";
  let max = 17;
  let measurment = "m";
  let measurmentLength = "m";
  let measurmentWeight = "kg";
  let ageCalc = 0;
  let weightCalc = 0;
  let heightCalc = 0;
  let monthCalc = 0;
  let energyNeedsCalc = 0;
  let catchUpEnergyNeeds = 0;
  let hollidaySegar = 0;
  let dri = 0;
  let bmi50Calc = 0;
  let bmi25Calc = 0;

  const [age, setAge] = useState<number>(0);
  const [ageUnit, setAgeUnit] = useState("Years");
  const [height, setHeight] = useState<number>(0);
  const [heightUnit, setHeightUnit] = useState("Metric");
  const [heightInches, setHeightInches] = useState<number>(0);
  const [, setLength] = useState<number>(0);
  const [lengthUnit, setLengthUnit] = useState("Metric");
  const [, setLengthInches] = useState<number>(0);
  const [sex, setSex] = useState("");
  const [activityLevel, setActivityLevel] = useState("");
  const [, setNeedsType] = useState("");
  const [weight, setWeight] = useState<number>(0);
  const [weightUnit, setWeightUnit] = useState("Metric");
  const [BMI25, setBMI25] = useState<number>(0);
  const [BMI50, setBMI50] = useState<number>(0);
  const [energyNeeds, setEnergyNeeds] = useState<number>(0);

  const [vitaminA, setVitaminA] = useState("");
  const [vitaminC, setVitaminC] = useState("");
  const [vitaminD, setVitaminD] = useState("");
  const [vitaminE, setVitaminE] = useState("");
  const [vitaminK, setVitaminK] = useState("");
  const [thiamin, setThiamin] = useState("");
  const [riboflavin, setRiboflavin] = useState("");
  const [niacin, setNiacin] = useState("");
  const [vitaminB6, setVitaminB6] = useState("");
  const [folate, setFolate] = useState("");
  const [vitaminB12, setVitaminB12] = useState("");
  const [pantothenicAcid, setPantothenicAcid] = useState("");
  const [biotin, setBiotin] = useState("");
  const [choline, setCholine] = useState("");
  const [calcium, setCalcium] = useState("");
  const [chromium, setChromium] = useState("");
  const [copper, setCopper] = useState("");
  const [fluoride, setFluoride] = useState("");
  const [iodine, setIodine] = useState("");
  const [iron, setIron] = useState("");
  const [magnesium, setMagnesium] = useState("");
  const [manganese, setManganese] = useState("");
  const [phosphorus, setPhosphorus] = useState("");
  const [selenium, setSelenium] = useState("");
  const [zinc, setZinc] = useState("");
  const [potassium, setPotassium] = useState("");
  const [sodium, setSodium] = useState("");
  const [chloride, setChloride] = useState("");
  const [carbohydrates] = useState("");
  const [fat] = useState("");
  const [fiber] = useState("");

  const [protein, setProtein] = useState<number>(0);
  const [highProtein, setHighProtein] = useState<number>(0);
  const [segarFluid, setSegarFluid] = useState<number>(0);
  const [DRIFluid, setDRIFluid] = useState<number>(0);
  const [catchUpEnergy, setCatchUpEnergy] = useState<number>(0);
  const nutrientsObj: Record<string, string> = {};

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    const numericString = inputValue
      .replace(/[^0-9.]/g, "")
      .replace(/(\..*?)\..*/g, "$1");
    const numericValue = numericString ? parseFloat(numericString) : 0;

    setAge(numericValue);
  };

  const handleWeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    const numericString = inputValue
      .replace(/[^0-9.]/g, "")
      .replace(/(\..*?)\..*/g, "$1");
    const numericValue = numericString ? parseFloat(numericString) : 0;
    setWeight(numericValue);
  };
  const handleHeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    const numericString = inputValue
      .replace(/[^0-9.]/g, "")
      .replace(/(\..*?)\..*/g, "$1");
    const numericValue = numericString ? parseFloat(numericString) : 0;
    setHeight(numericValue);
  };
  const handleLengthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    const numericString = inputValue
      .replace(/[^0-9.]/g, "")
      .replace(/(\..*?)\..*/g, "$1");
    const numericValue = numericString ? parseFloat(numericString) : 0;
    setLength(numericValue);
  };
  const handleHeightChangeInches = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    const numericString = inputValue.replace(/[^0-9]/g, "");
    const numericValue = numericString ? parseFloat(numericString) : 0;
    setHeightInches(numericValue);
  };
  const handleLengthChangeInches = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    const numericString = inputValue.replace(/[^0-9]/g, "");
    const numericValue = numericString ? parseFloat(numericString) : 0;
    setLengthInches(numericValue);
  };

  const calculate = async () => {
    if (ageUnit === "Months") {
      ageCalc = age / 12;
    } else {
      ageCalc = age;
    }

    if (ageUnit === "Months") {
      monthCalc = age;
    } else {
      monthCalc = age * 12;
    }

    monthCalc = Math.round(monthCalc * 2) / 2;

    if (weightUnit === "Imperial") {
      weightCalc = weight * 0.453592;
    } else {
      weightCalc = weight;
    }

    if (heightUnit === "Imperial") {
      heightCalc = (height * 12 + heightInches) * 0.0254;
    } else {
      heightCalc = height;
    }

    let PA = 1;
    if (sex === "Male") {
      switch (activityLevel) {
        case "Not Applicable":
          PA = 1;
          break;
        case "Inactive":
          PA = 1;
          break;
        case "Low Active":
          PA = 1.13;
          break;
        case "Active":
          PA = 1.26;
          break;
        case "Very Active":
          PA = 1.42;
          break;
      }
    } else {
      switch (activityLevel) {
        case "Not Applicable":
          PA = 1;
          break;
        case "Inactive":
          PA = 1;
          break;
        case "Low Active":
          PA = 1.16;
          break;
        case "Active":
          PA = 1.31;
          break;
        case "Very Active":
          PA = 1.56;
          break;
      }
    }

    if (ageCalc < 0.25) {
      energyNeedsCalc = 89 * weightCalc - 100 + 175;
    } else if (ageCalc < 0.5) {
      energyNeedsCalc = 89 * weightCalc - 100 + 56;
    } else if (ageCalc < 1) {
      energyNeedsCalc = 89 * weightCalc - 100 + 22;
    } else if (ageCalc < 3) {
      energyNeedsCalc = 89 * weightCalc - 100 + 20;
    } else if (sex === "Male") {
      if (ageCalc >= 3 && ageCalc <= 8) {
        energyNeedsCalc =
          88.5 -
          61.9 * ageCalc +
          PA * (26.7 * weightCalc + 903 * heightCalc) +
          20;
      } else if (ageCalc > 8 && ageCalc <= 18) {
        energyNeedsCalc =
          88.5 -
          61.9 * ageCalc +
          PA * (26.7 * weightCalc + 903 * heightCalc) +
          25;
      }
    } else if (sex === "Female") {
      if (ageCalc >= 3 && ageCalc <= 8) {
        energyNeedsCalc =
          135.3 -
          30.8 * ageCalc +
          PA * (10 * weightCalc + 934 * heightCalc) +
          20;
      } else if (ageCalc > 8 && ageCalc <= 18) {
        energyNeedsCalc =
          135.3 -
          30.8 * ageCalc +
          PA * (10 * weightCalc + 934 * heightCalc) +
          20;
      }
    }
    try {
      const { data, error } = await supabase
        .from("weight")
        .select("p25, p50")
        .eq("sex", sex.toLowerCase())
        .lte("age", monthCalc)
        .order("age", { ascending: false })
        .limit(1);

      if (error) throw error;
      if (!data || data.length === 0) throw new Error("No weight data found");

      const weightPercentile = data[0];

      if (ageCalc < 2) {
        setBMI25(Math.round(weightPercentile.p25 * 10) / 10);
        setBMI50(Math.round(weightPercentile.p50 * 10) / 10);
        bmi25Calc = weightPercentile.p25;
        bmi50Calc = weightPercentile.p50;
      } else {
        bmi25Calc = heightCalc * heightCalc * weightPercentile.p25;
        bmi50Calc = heightCalc * heightCalc * weightPercentile.p50;

        setBMI25(Math.round(bmi25Calc * 10) / 10);
        setBMI50(Math.round(bmi50Calc * 10) / 10);
      }
    } catch (err) {
      console.error("Error fetching weight data:", err);
    }
    setEnergyNeeds(Math.round(energyNeedsCalc * 10) / 10);

    if (weightCalc <= 10) {
      hollidaySegar = 100 * weightCalc;
    } else if (weightCalc <= 20) {
      hollidaySegar = 1000 + 50 * (weightCalc - 10);
    } else {
      hollidaySegar = 1500 + 20 * (weightCalc - 20);
    }

    if (ageCalc < 0.5) {
      dri = 0.7;
    } else if (ageCalc < 1) {
      dri = 0.8;
    } else if (ageCalc < 4) {
      dri = 1.3;
    } else if (ageCalc < 9) {
      dri = 1.7;
    } else if (ageCalc < 14) {
      dri = sex === "Male" ? 2.4 : 2.1;
    } else if (ageCalc < 19) {
      dri = sex === "Male" ? 3.3 : 2.3;
    } else {
      dri = energyNeedsCalc / 1000;
    }

    let proteinPerKg = 0;

    if (ageCalc < 0.5) {
      proteinPerKg = 1.2;
    } else if (ageCalc < 1) {
      proteinPerKg = 1.2;
    } else if (ageCalc < 2) {
      proteinPerKg = 1.05;
    } else if (ageCalc < 14) {
      proteinPerKg = 0.95;
    } else if (ageCalc < 19) {
      proteinPerKg = 0.85;
    } else {
      proteinPerKg = 0.8;
    }

    const proteinNeeds = proteinPerKg * weightCalc;
    const highProteinNeeds = weightCalc * 1.5;

    setProtein(Math.round(proteinNeeds * 10) / 10);
    setHighProtein(Math.round(highProteinNeeds * 10) / 10);

    setSegarFluid(Math.round(hollidaySegar));
    setDRIFluid(Math.round(dri * 10) / 10);

    try {
      const { data, error } = await supabase
        .from("nutrient_needs")
        .select("nutrient, amount, measurement_type")
        .eq("sex", sex)
        .lte("age_bottom", ageCalc)
        .gte("age_top", ageCalc);

      if (error) throw error;
      if (!data || data.length === 0)
        throw new Error("No nutrient needs found");

      data.forEach((row) => {
        nutrientsObj[row.nutrient] = `${row.amount}${row.measurement_type}`;
      });

      setVitaminA(nutrientsObj["Vitamin A"] || "");
      setVitaminC(nutrientsObj["Vitamin C"] || "");
      setVitaminD(nutrientsObj["Vitamin D"] || "");
      setVitaminE(nutrientsObj["Vitamin E"] || "");
      setVitaminK(nutrientsObj["Vitamin K"] || "");
      setThiamin(nutrientsObj["Thiamin"] || "");
      setRiboflavin(nutrientsObj["Riboflavin"] || "");
      setNiacin(nutrientsObj["Niacin"] || "");
      setVitaminB6(nutrientsObj["Vitamin B6"] || "");
      setFolate(nutrientsObj["Folate"] || "");
      setVitaminB12(nutrientsObj["Vitamin B12"] || "");
      setPantothenicAcid(nutrientsObj["Pantothenic Acid"] || "");
      setBiotin(nutrientsObj["Biotin"] || "");
      setCholine(nutrientsObj["Choline"] || "");
      setCalcium(nutrientsObj["Calcium"] || "");
      setChromium(nutrientsObj["Chromium"] || "");
      setCopper(nutrientsObj["Copper"] || "");
      setFluoride(nutrientsObj["Fluoride"] || "");
      setIodine(nutrientsObj["Iodine"] || "");
      setIron(nutrientsObj["Iron"] || "");
      setMagnesium(nutrientsObj["Magnesium"] || "");
      setManganese(nutrientsObj["Manganese"] || "");
      setPhosphorus(nutrientsObj["Phosphorus"] || "");
      setSelenium(nutrientsObj["Selenium"] || "");
      setZinc(nutrientsObj["Zinc"] || "");
      setPotassium(nutrientsObj["Potassium"] || "");
      setSodium(nutrientsObj["Sodium"] || "");
      setChloride(nutrientsObj["Chloride"] || "");
    } catch (err) {
      console.error("Error fetching nutrient needs:", err);
    }
    catchUpEnergyNeeds = energyNeedsCalc * (bmi50Calc / weightCalc);
    setCatchUpEnergy(Math.round(catchUpEnergyNeeds * 10) / 10);
  };

  const nutrients = [
    {
      name: "Energy Needs",
      amount: `${energyNeeds ? energyNeeds + " cal" : ""}`,
    },
    {
      name: "Holliday Fluid",
      amount: `${segarFluid ? segarFluid + " mL" : ""}`,
    },
    { name: "DRI Fluid", amount: `${DRIFluid ? DRIFluid + " L" : ""}` },
    { name: "Protein", amount: `${protein ? protein + " g" : ""}` },
    {
      name: "High Protein",
      amount: `${highProtein ? highProtein + " g" : ""}`,
    },
    { name: "Calcium", amount: `${calcium || ""}` },
    { name: "Iron", amount: `${iron || ""}` },
    { name: "Vitamin D", amount: `${vitaminD || ""}` },
    { name: "Potassium", amount: `${potassium || ""}` },
    { name: "Magnesium", amount: `${magnesium || ""}` },
    { name: "Zinc", amount: `${zinc || ""}` },
    { name: "Vitamin A", amount: `${vitaminA || ""}` },
    { name: "Vitamin E", amount: `${vitaminE || ""}` },
    { name: "Vitamin C", amount: `${vitaminC || ""}` },
    { name: "Vitamin K", amount: `${vitaminK || ""}` },
    { name: "Thiamin", amount: `${thiamin || ""}` },
    { name: "Riboflavin", amount: `${riboflavin || ""}` },
    { name: "Niacin", amount: `${niacin || ""}` },
    { name: "Vitamin B6", amount: `${vitaminB6 || ""}` },
    { name: "Folate", amount: `${folate || ""}` },
    { name: "Vitamin B12", amount: `${vitaminB12 || ""}` },
    { name: "Pantothenic Acid", amount: `${pantothenicAcid || ""}` },
    { name: "Biotin", amount: `${biotin || ""}` },
    { name: "Choline", amount: `${choline || ""}` },
    { name: "Chromium", amount: `${chromium || ""}` },
    { name: "Copper", amount: `${copper || ""}` },
    { name: "Fluoride", amount: `${fluoride || ""}` },
    { name: "Iodine", amount: `${iodine || ""}` },
    { name: "Manganese", amount: `${manganese || ""}` },
    { name: "Phosphorus", amount: `${phosphorus || ""}` },
    { name: "Selenium", amount: `${selenium || ""}` },
    { name: "Sodium", amount: `${sodium || ""}` },
    { name: "Chloride", amount: `${chloride || ""}` },
    { name: "Carbohydrates", amount: `${carbohydrates || ""}` },
    { name: "Fats", amount: `${fat || ""}` },
    { name: "Fiber", amount: `${fiber || ""}` },
  ];

  const printNutrientPDF = () => {
    return null;
  };

  if (ageUnit === "Years") {
    agePlaceholder = "Years (0-17)";
    max = 17;
  } else if (ageUnit === "Months") {
    agePlaceholder = "Months (0-36))";
    max = 12;
  }

  if (heightUnit === "Imperial") {
    measurment = "ft";
  } else if (heightUnit === "Metric") {
    measurment = "m";
  }

  if (lengthUnit === "Imperial") {
    measurmentLength = "ft";
  } else if (lengthUnit === "Metric") {
    measurmentLength = "m";
  }

  if (weightUnit === "Imperial") {
    measurmentWeight = "lbs";
  } else if (weightUnit === "Metric") {
    measurmentWeight = "kg";
  }

  const heightBool = heightUnit === "Imperial" ? true : false;
  const lengthBool = lengthUnit === "Imperial" ? true : false;

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
                type="number"
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
            <p className="text-2xl xl:text-3xl 2xl:text-4xl font-medium">
              Weight
            </p>
            <div className="flex flex-row gap-x-1 lg:gap-x-2 w-full">
              <input
                className="border rounded focus:outline-none xl:text-lg 2xl:text-xl p-1 lg:p-2 w-[55%]"
                inputMode="numeric"
                onInput={handleWeightChange}
                placeholder="Weight"
              ></input>
              <p className="text-md font-medium self-center">
                {measurmentWeight}
              </p>
              <Select
                onValueChange={(value) => {
                  switch (value) {
                    case "Metric":
                      setWeightUnit("Metric");
                      break;
                    case "Imperial":
                      setWeightUnit("Imperial");
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
              <p>{BMI50} kg</p>
            </div>
            <div className="flex flex-row text-lg lg:text-xl 2xl:text-3xl ">
              <p className="font-semibold">
                BMI (25th Percentile for age):&nbsp;
              </p>
              <p>{BMI25} kg</p>
            </div>
            <div className="flex flex-row text-lg lg:text-xl 2xl:text-3xl">
              <p className="font-semibold">Catch up Growth:&nbsp;</p>
              <p>{catchUpEnergy} cal</p>
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
