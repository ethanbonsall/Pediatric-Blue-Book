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
import { pdf } from "@react-pdf/renderer";
import MyDocument from "./nutrient-needs-summary";

type Nutrient = {
  name: string;
  amount: string;
};

interface NutrientNeedsCalculatorProps {
  onNutrientsCalculated?: (nutrients: Nutrient[]) => void;
}

const NutrientNeedsCalculator = ({ onNutrientsCalculated }: NutrientNeedsCalculatorProps) => {
  // Variables for user to use calculator
  let age_input_placeholder = "Years 0-17";
  let max_input_age = 17;
  let height_unit = "m";
  let weight_unit = "kg";

  // Variables needed for nutrient calculation
  let age_in_years = 0;
  let weight_in_kg = 0;
  let height_in_meters = 0;
  let age_in_months = 0;
  let calorie_needs = 0;
  let catchup_calories = 0;
  let holliday_segar_fluid = 0;
  let dri = 0;
  let ideal_weight_50 = 0;
  let ideal_weight_25 = 0;
  let infant = true;
  let fat_cutoff = 0;
  let fat_lower_percentage = 0;
  let fat_upper_percentage = 0;
  let carb_cutoff = 0;
  let carb_lower_percentage = 0;
  let carb_upper_percentage = 0;
  let protein_per_kg = 0;

  // Variables needed to get have calculator be functional

  // Age
  const [age, setAge] = useState<number>(0);
  const [ageUnit, setAgeUnit] = useState("Years");

  // Height
  const [height, setHeight] = useState<number>(0);
  const [heightUnit, setHeightUnit] = useState("Metric");
  const [heightInches, setHeightInches] = useState<number>(0);

  // Sex
  const [sex, setSex] = useState("");

  // Activity Level
  const [activityLevel, setActivityLevel] = useState("");

  // Needs Type
  const [needsType, setNeedsType] = useState("Standard");

  // Weight
  const [weight, setWeight] = useState<number>(0);
  const [weightUnit, setWeightUnit] = useState("Metric");

  // Ideal Weight
  const [idealWeight25, setidealWeight25] = useState<number>(0);
  const [idealWeight50, setIdealWeight50] = useState<number>(0);

  // Nutrients
  const [calories, setCalories] = useState<number>(0);
  const [caloriesPerKG, setCaloriesPerKG] = useState<number>(0);
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
  const [carbohydrates, setCarbohydrates] = useState("");
  const [fat, setFat] = useState("");
  const [fiber, setFiber] = useState("");
  const [protein, setProtein] = useState<number>(0);
  const [highProtein, setHighProtein] = useState<number>(0);
  const [segarFluid, setSegarFluid] = useState<number>(0);
  const [driFluid, setDriFluid] = useState<number>(0);
  const [catchUpEnergy, setCatchUpEnergy] = useState<number>(0);
  const [proteinPerKg, setProteinPerKg] = useState<number>(0);

  // Sets up nutrient needs object
  const nutrientsObj: Record<string, string> = {};

  //Handling inputs into calculator and ensuring they are only valid characters
  const handleAgeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
  const handleHeightChangeInches = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    const numericString = inputValue.replace(/[^0-9]/g, "");
    const numericValue = numericString ? parseFloat(numericString) : 0;
    setHeightInches(numericValue);
  };

  // Tracks if nutrients summary PDF is being generated
  const [isGenerating, setIsGenerating] = useState(false);

  // Tracks if calculate button has been hit
  const [hasCalculated, setHasCalculated] = useState(false);

  // Print nutrient PDF function for print button
  const printNutrientPDF = async (
    data: Nutrient[],
    idealWeight50: number,
    idealWeight25: number,
    catchUp: number
  ) => {
    setIsGenerating(true);

    try {
      const blob = await pdf(
        <MyDocument
          nutrients={data}
          ideal50={idealWeight50}
          ideal25={idealWeight25}
          catchUp={catchUp}
        />
      ).toBlob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "nutrition_needs_summary.pdf"; // PLACEHOLDER
      link.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error generating PDF: ", error);
    } finally {
      setIsGenerating(false);
    }
  };

  // Changes the values of the input functions upon unit change
  if (ageUnit === "Years") {
    age_input_placeholder = "Years (0-17)";
    max_input_age = 17;
  } else if (ageUnit === "Months") {
    age_input_placeholder = "Months (0-36))";
    max_input_age = 36;
  }

  if (heightUnit === "Imperial") {
    height_unit = "ft";
  } else if (heightUnit === "Metric") {
    height_unit = "m";
  }

  if (weightUnit === "Imperial") {
    weight_unit = "lbs";
  } else if (weightUnit === "Metric") {
    weight_unit = "kg";
  }

  const heightBool = heightUnit === "Imperial" ? true : false;

  const calculate = async () => {
    //Setting Up Variables Needed For Calculation

    if (ageUnit === "Months") {
      age_in_years = age / 12;
    } else {
      age_in_years = age;
    }

    if (ageUnit === "Months") {
      age_in_months = age;
    } else {
      age_in_months = age * 12;
    }

    age_in_months = Math.round(age_in_months * 2) / 2;

    if (weightUnit === "Imperial") {
      weight_in_kg = weight * 0.453592;
    } else {
      weight_in_kg = weight;
    }

    if (heightUnit === "Imperial") {
      height_in_meters = (height * 12 + heightInches) * 0.0254;
    } else {
      height_in_meters = height;
    }


// ECG — Energy Cost of Growth
let ECG = 20;
if (sex === "Male") {
  if (age_in_years < 0.25) ECG = 200;
  else if (age_in_years < 0.5) ECG = 50;
  else if (age_in_years < 4) ECG = 20;
  else if (age_in_years < 9) ECG = 15;
  else if (age_in_years < 14) ECG = 25;
  else ECG = 20;
} else {
  if (age_in_years < 0.25) ECG = 180;
  else if (age_in_years < 0.5) ECG = 60;
  else if (age_in_years < 1) ECG = 20;
  else if (age_in_years < 9) ECG = 15;
  else if (age_in_years < 14) ECG = 30;
  else ECG = 20;
}


// Convert height to cm if needed
const height_cm = height_in_meters * 100;


// Ages 0–2.99
if (sex === "Male" && age_in_years < 3) {
  calorie_needs =
    -716.45 -
    age_in_years +
    17.82 * height_cm +
    15.06 * weight_in_kg +
    ECG;
}

if (sex === "Female" && age_in_years < 3) {
  calorie_needs =
    -69.15 +
    80 * age_in_years +
    2.65 * height_cm +
    54.15 * weight_in_kg +
    ECG;
}

// Ages 3–18.99
if (age_in_years >= 3 && age_in_years < 19) {
  if (sex === "Male") {
    switch (activityLevel) {
      case "Inactive":
        calorie_needs =
          -447.51 +
          3.68 * age_in_years +
          13.01 * height_cm +
          13.15 * weight_in_kg +
          ECG;
        break;

      case "Low Active":
        calorie_needs =
          19.12 +
          3.68 * age_in_years +
          8.62 * height_cm +
          20.28 * weight_in_kg +
          ECG;
        break;

      case "Active":
        calorie_needs =
          -388.19 +
          3.68 * age_in_years +
          12.66 * height_cm +
          20.46 * weight_in_kg +
          ECG;
        break;

      case "Very Active":
        calorie_needs =
          -671.75 +
          3.68 * age_in_years +
          15.38 * height_cm +
          23.25 * weight_in_kg +
          ECG;
        break;
    }
  }

  if (sex === "Female") {
    switch (activityLevel) {
      case "Inactive":
        calorie_needs =
          55.59 -
          22.25 * age_in_years +
          8.43 * height_cm +
          17.07 * weight_in_kg +
          ECG;
        break;

      case "Low Active":
        calorie_needs =
          -297.54 -
          22.25 * age_in_years +
          12.77 * height_cm +
          14.73 * weight_in_kg +
          ECG;
        break;

      case "Active":
        calorie_needs =
          -189.55 -
          22.25 * age_in_years +
          11.74 * height_cm +
          18.34 * weight_in_kg +
          ECG;
        break;

      case "Very Active":
        calorie_needs =
          -709.59 -
          22.25 * age_in_years +
          18.22 * height_cm +
          14.25 * weight_in_kg +
          ECG;
        break;
    }
  }
}

// Store results
setCalories(Math.round(calorie_needs));
setCaloriesPerKG(Math.round((calorie_needs / weight_in_kg) * 10) / 10);


    // Getting 25th and 50th percentile BMI's from supabase for 2-18 and ideal weight directly for 0-2
    try {
      const { data, error } = await supabase
        .from("weight")
        .select("p25, p50")
        .eq("sex", sex.toLowerCase())
        .lte("age", age_in_months)
        .order("age", { ascending: false })
        .limit(1);

      if (error) throw error;
      if (!data || data.length === 0) throw new Error("No weight data found");

      const weightPercentile = data[0];

      //Calculating Ideal Weight
      if (age_in_years < 2) {
        setidealWeight25(Math.round(weightPercentile.p25 * 10) / 10);
        setIdealWeight50(Math.round(weightPercentile.p50 * 10) / 10);
        ideal_weight_25 = weightPercentile.p25;
        ideal_weight_50 = weightPercentile.p50;
      } else {
        ideal_weight_25 =
          height_in_meters * height_in_meters * weightPercentile.p25;
        ideal_weight_50 =
          height_in_meters * height_in_meters * weightPercentile.p50;

        setidealWeight25(Math.round(ideal_weight_25 * 10) / 10);
        setIdealWeight50(Math.round(ideal_weight_50 * 10) / 10);
      }
    } catch (err) {
      console.error("Error fetching weight data:", err);
    }

    // Calculate fluid intake using the Holliday Segar Method
    if (weight_in_kg <= 10) {
      holliday_segar_fluid = 100 * weight_in_kg;
    } else if (weight_in_kg <= 20) {
      holliday_segar_fluid = 1000 + 50 * (weight_in_kg - 10);
    } else {
      holliday_segar_fluid = 1500 + 20 * (weight_in_kg - 20);
    }

    setSegarFluid(Math.round(holliday_segar_fluid));

    // Calculate fluid intake using the Dietary Reference Intake Method
    if (age_in_years < 0.5) {
      dri = 0.7;
    } else if (age_in_years < 1) {
      dri = 0.8;
    } else if (age_in_years < 4) {
      dri = 1.3;
    } else if (age_in_years < 9) {
      dri = 1.7;
    } else if (age_in_years < 14) {
      dri = sex === "Male" ? 2.4 : 2.1;
    } else if (age_in_years < 19) {
      dri = sex === "Male" ? 3.3 : 2.3;
    } else {
      dri = calorie_needs / 1000;
    }

    setDriFluid(Math.round(dri * 10) / 10);

    // Calculate Protein Needs
    if (age_in_years < 0.5) {
      protein_per_kg = 1.5;
      setProteinPerKg(1.5);
    } else if (age_in_years < 1) {
      protein_per_kg = 1.2;
      setProteinPerKg(1.2);
    } else if (age_in_years < 2) {
      protein_per_kg = 1.05;
      setProteinPerKg(1.05);
    } else if (age_in_years < 14) {
      protein_per_kg = 0.95;
      setProteinPerKg(0.95);
    } else if (age_in_years < 19) {
      protein_per_kg = 0.85;
      setProteinPerKg(0.85);
    } else {
      protein_per_kg = 0.8;
      setProteinPerKg(0.8);
    }
      
    // Calculate raw protein needs
    const protein_needs = protein_per_kg * weight_in_kg;
    const high_protein_needs = protein_needs * 1.5;

    //Calculate rounded protein needs
    setProtein(Math.round(protein_needs * 10) / 10);
    setHighProtein(Math.round(high_protein_needs * 10) / 10);

    if (age_in_years >= 1) {
      infant = false;
    }

    // Calculate fats and carbohydrate needs
    if (age_in_years < 0.5) {
      fat_cutoff = 31;
      carb_cutoff = 60;
    } else if (age_in_years < 1) {
      fat_cutoff = 30;
      carb_cutoff = 95;
    } else if (age_in_years < 4) {
      fat_lower_percentage = Math.round(calorie_needs * 0.3 / 9 * 10) / 10;
      fat_upper_percentage = Math.round(calorie_needs * 0.4 / 9 * 10) / 10;
      carb_lower_percentage = Math.round(calorie_needs * 0.45 / 4 * 10) / 10;
      carb_upper_percentage = Math.round(calorie_needs * 0.65 / 4 * 10) / 10;
    } else {
      fat_lower_percentage = Math.round(calorie_needs * 0.25 / 9 * 10) / 10;
      fat_upper_percentage = Math.round(calorie_needs * 0.35 / 9 * 10) / 10;
      carb_lower_percentage = Math.round(calorie_needs * 0.45 / 4 * 10) / 10;
      carb_upper_percentage = Math.round(calorie_needs * 0.65 / 4 * 10) / 10;
    }

    if (infant) {
      setCarbohydrates(`${carb_cutoff} g`);
      setFat(`${fat_cutoff} g`);
    } else {
      setCarbohydrates(
        `${carb_lower_percentage} - ${carb_upper_percentage} g`
      );
      setFat(`${fat_lower_percentage} - ${fat_upper_percentage} g`);
    }

    // Getting Nutrient Needs from database based on age and sex
    try {
      const { data, error } = await supabase
        .from("nutrient_needs")
        .select("nutrient, amount, measurement_type")
        .eq("sex", sex)
        .lte("age_bottom", age_in_years)
        .gt("age_top", age_in_years);

      if (error) throw error;
      if (!data || data.length === 0)
        throw new Error("No nutrient needs found");

      data.forEach((row) => {
        nutrientsObj[row.nutrient] = `${row.amount} ${row.measurement_type}`;
      });

      // Setting null if no data is sent
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
      setFiber(nutrientsObj["Fiber"] || "");
    } catch (err) {
      console.error("Error fetching nutrient needs:", err);
    }

    // Catchup calories calculations
    catchup_calories = calorie_needs * (ideal_weight_50 / weight_in_kg);
    const roundedCatchUp = Math.round(catchup_calories * 10) / 10;
    setCatchUpEnergy(roundedCatchUp);

    setHasCalculated(true);

    // Build nutrients array and call callback using the calculated values
    if (onNutrientsCalculated) {
      const caloriesDisplay = Math.round(calorie_needs * 10) / 10;
      const caloriesPerKGDisplay = Math.round((calorie_needs / weight_in_kg) * 10) / 10;
      const proteinDisplay = Math.round(protein_needs * 10) / 10;
      const highProteinDisplay = Math.round(high_protein_needs * 10) / 10;
      
      const calculatedNutrients: Nutrient[] = [
        {
          name: "Calories",
          amount: `${
            caloriesDisplay ? caloriesDisplay + " cal (" + caloriesPerKGDisplay + " cal/kg)" : ""
          }`,
        },
        {
          name: "Holliday-Segar",
          amount: `${holliday_segar_fluid ? Math.round(holliday_segar_fluid) + " mL" : ""}`,
        },
        { name: "DRI Fluid", amount: `${dri ? Math.round(dri * 10) / 10 + " L" : ""}` },
        { name: "Protein", amount: `${proteinDisplay ? "≥ " + proteinDisplay + " g " + "(" + protein_per_kg + " g/kg" + ")": ""}` },
        {
          name: `${needsType == "Increased" ? "High Protein" : ""}`,
          amount: `${
            needsType == "Increased" && highProteinDisplay ? "≥ " + highProteinDisplay + " g" : ""
          }`,
        },
        {
          name: "Carbohydrates",
          amount: infant 
            ? `${carb_cutoff ? carb_cutoff + " g" : ""}`
            : `${carb_lower_percentage ? carb_lower_percentage + " - " + carb_upper_percentage + " g" : ""}`,
        },
        { 
          name: "Fats", 
          amount: infant
            ? `${fat_cutoff ? fat_cutoff + " g" : ""}`
            : `${fat_lower_percentage ? fat_lower_percentage + " - " + fat_upper_percentage + " g" : ""}`,
        },
        { name: "Calcium", amount: nutrientsObj["Calcium"] || "" },
        { name: "Iron", amount: nutrientsObj["Iron"] || "" },
        { name: "Vitamin D", amount: nutrientsObj["Vitamin D"] || "" },
        { name: "Potassium", amount: nutrientsObj["Potassium"] || "" },
        { name: "Magnesium", amount: nutrientsObj["Magnesium"] || "" },
        { name: "Zinc", amount: nutrientsObj["Zinc"] || "" },
        { name: "Vitamin A", amount: nutrientsObj["Vitamin A"] || "" },
        { name: "Vitamin E", amount: nutrientsObj["Vitamin E"] || "" },
        { name: "Vitamin C", amount: nutrientsObj["Vitamin C"] || "" },
        { name: "Vitamin K", amount: nutrientsObj["Vitamin K"] || "" },
        { name: "Thiamin", amount: nutrientsObj["Thiamin"] || "" },
        { name: "Riboflavin", amount: nutrientsObj["Riboflavin"] || "" },
        { name: "Niacin", amount: nutrientsObj["Niacin"] || "" },
        { name: "Vitamin B6", amount: nutrientsObj["Vitamin B6"] || "" },
        { name: "Folate", amount: nutrientsObj["Folate"] || "" },
        { name: "Vitamin B12", amount: nutrientsObj["Vitamin B12"] || "" },
        { name: "Pantothenic Acid", amount: nutrientsObj["Pantothenic Acid"] || "" },
        { name: "Biotin", amount: nutrientsObj["Biotin"] || "" },
        { name: "Choline", amount: nutrientsObj["Choline"] || "" },
        { name: "Chromium", amount: nutrientsObj["Chromium"] || "" },
        { name: "Copper", amount: nutrientsObj["Copper"] || "" },
        { name: "Fluoride", amount: nutrientsObj["Fluoride"] || "" },
        { name: "Iodine", amount: nutrientsObj["Iodine"] || "" },
        { name: "Manganese", amount: nutrientsObj["Manganese"] || "" },
        { name: "Phosphorus", amount: nutrientsObj["Phosphorus"] || "" },
        { name: "Selenium", amount: nutrientsObj["Selenium"] || "" },
        { name: "Sodium", amount: nutrientsObj["Sodium"] || "" },
        { name: "Chloride", amount: nutrientsObj["Chloride"] || "" },
        { name: "Fiber (DGA)", amount: nutrientsObj["Fiber"] || "" },
      ];
      // Use setTimeout to ensure state updates are processed first
      setTimeout(() => {
        onNutrientsCalculated(calculatedNutrients);
      }, 0);
    }
  };

  // Setting nutrients into an array to be used in the table
  const nutrients = [
    {
      name: "Calories",
      amount: `${
        calories ? calories + " cal (" + caloriesPerKG + " cal/kg)" : ""
      }`,
    },
    {
      name: "Holliday-Segar",
      amount: `${segarFluid ? segarFluid + " mL" : ""}`,
    },
    { name: "DRI Fluid", amount: `${driFluid ? driFluid + " L" : ""}` },
    { name: "Protein", amount: `${protein ? "≥ " + protein + " g " + "(" + proteinPerKg + " g/kg" + ")": ""}` },
    {
      name: `${needsType == "Increased" ? "High Protein" : ""}`,
      amount: `${
        needsType == "Increased" && highProtein ? "≥ " + highProtein + " g" : ""
      }`,
    },
    {
      name: "Carbohydrates",
      amount: `${carbohydrates ? carbohydrates : ""}`,
    },
    { name: "Fats", amount: `${fat ? fat : ""}` },
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
    { name: "Fiber (DGA)", amount: `${fiber || ""}` },
  ]; 

  return (
    <div
      className="flex flex-col bg-gradient-to-tl from-primary-200 to-primary-300 w-full min-h-screen rounded-b-[20px] pb-8"
      id="nutrient"
    >
      <p className="text-3xl lg:text-5xl 2xl:text-6xl font-semibold w-fit rounded-[20px] p-2 mt-4 mb-2 ml-4">
        Nutrient Needs Calculator
      </p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-y-4 gap-x-6 px-2 md:px-6 items-start justify-center">
        <div className="flex flex-col gap-y-[2dvh] 2xl:gap-y-[3dvh] h-full bg-white rounded-[20px] shadow-2xl p-[2dvw]">
          <div className="flex flex-col gap-y-1">
            <p className="text-2xl xl:text-3xl 2xl:text-4xl font-medium">Age</p>
            <div className="flex flex-row gap-x-1 lg:gap-x-2 w-full">
              <input
                className="border rounded focus:outline-none xl:text-lg 2xl:text-xl p-1 lg:p-2 w-[60%]"
                inputMode="decimal"
                type="number"
                min="0"
                max={max_input_age}
                onInput={handleAgeChange}
                placeholder={age_input_placeholder}
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
                inputMode="decimal"
                min="0"
                onInput={handleHeightChange}
                placeholder="Height"
              ></input>
              <p className="text-md font-medium self-center">{height_unit}</p>
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
              Weight
            </p>
            <div className="flex flex-row gap-x-1 lg:gap-x-2 w-full">
              <input
                className="border rounded focus:outline-none xl:text-lg 2xl:text-xl p-1 lg:p-2 w-[55%]"
                inputMode="decimal"
                onInput={handleWeightChange}
                placeholder="Weight"
              ></input>
              <p className="text-md font-medium self-center">{weight_unit}</p>
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
            className="rounded text-white bg-primary-600 px-4 py-2 w-fit text-md xl:text-lg hover:bg-primary-700 transition-all duration-300 self-end mt-4"
            onClick={calculate}
          >
            Calculate
          </button>
        </div>
        <div className="flex flex-col bg-white rounded-[20px] shadow-2xl h-full p-4 gap-y-2">
          <>
            <p className="text-lg xl:text-xl 2xl:text-2xl font-bold">
              Daily Estimated Nutritional Needs
            </p>
            <p className="text-lg xl:text-xl 2xl:text-2xl ">
              Needs are based on the selected needs type
            </p>
          </>
          <div className="flex flex-col w-full border rounded-[20px] max-h-[70vh] overflow-y-auto no-scrollbar relative">
            <div className="sticky top-0">
              <div className="flex flex-row text-xl lg:text-2xl pl-[1dvw] py-[1dvh] font-semibold bg-white">
                <p className="w-[50%] ">Nutrient</p>
                <p className="w-[40%] ">Amount</p>
              </div>
              <hr className="w-full" />
            </div>

            {nutrients
             .filter(n => n.name !== "")
             .map((nutrient, index) => (
              <div key={index}>
                <div className="flex flex-row text-xl lg:text-2xl pl-[1dvw] py-[1dvh]">
                  <p className="w-[50%]">{nutrient.name}</p>
                  <p className="w-[40%] text-lg lg:text-xl text-nowrap">{nutrient.amount}</p>
                </div>
                <hr className="w-full" />
              </div>
          ))}
          </div>
        </div>
        <div className="flex flex-col items-center md:justify-start">
          <div className="flex flex-col w-full bg-white rounded-[20px] shadow-2xl p-4 md:p-3 gap-y-4">
            <p className="text-lg xl:text-xl 2xl:text-2xl font-bold">
              Ideal Body Weight
            </p>
            <div className="flex flex-row text-md lg:text-lg 2xl:text-3xl ">
              <p className="font-[550]">
                BMI (50th Percentile for age):&nbsp;
              </p>
              <p>
                {idealWeight50} kg (
                {Math.round((idealWeight50 * 2.205 * 10) / 10)} lb)
              </p>
            </div>
            <div className="flex flex-row text-md lg:text-lg 2xl:text-3xl ">
              <p className="font-[550]">
                BMI (25th Percentile for age):&nbsp;
              </p>
              <p>
                {idealWeight25} kg (
                {Math.round((idealWeight25 * 2.205 * 10) / 10)} lb)
              </p>
            </div>
            <div className="flex flex-row text-md lg:text-lg 2xl:text-3xl">
              { needsType == "Increased" ? (
                <>
                  <p className="font-[550]">Catch Up Needs:&nbsp;</p>
                  <p>{catchUpEnergy} cal</p>
                </>
              ) : null}
            </div>
          </div>
          <div className="flex flex-row justify-center gap-x-8 md:gap-x-4 md:w-fit mt-4 mb-2 h-fit self-center">
            <Link
              className="flex uppercase w-fit bg-primary-600 hover:bg-primary-700 transition-all px-2 py-1 lg:px-4 lg:py-2 2xl:px-6 2xl:py-3 rounded text-nowrap text-white text-center text-md lg:text-lg xl:text-xl 2xl:text-2xl font-semibold"
              href="#formula_calc"
            >
              Formula Calc
            </Link>
            <button
              onClick={() =>
                printNutrientPDF(
                  nutrients,
                  idealWeight50,
                  idealWeight25,
                  catchUpEnergy
                )
              }
              disabled={isGenerating || !hasCalculated}
              className="flex w-fit disabled:opacity-50 bg-primary-600 hover:bg-primary-700 transition-all px-2 py-1 lg:px-4 lg:py-2 2xl:px-6 2xl:py-3 text-nowrap items-center rounded text-white text-center text-md lg:text-lg xl:text-xl 2xl:text-2xl font-semibold"
            >
              {isGenerating ? "Generating..." : "Print Out"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default NutrientNeedsCalculator;
