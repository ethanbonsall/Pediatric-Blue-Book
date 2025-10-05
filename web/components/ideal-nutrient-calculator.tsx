type Nutrient = {
  name: string;
  amount: string;
};

export function getIdealNutrients(): Nutrient[] {
  return [
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
}
