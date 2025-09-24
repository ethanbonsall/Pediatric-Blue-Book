import BottomBar from "@/components/bottombar";
import NavBar from "@/components/navbar";

const Specifications = () =>
{
    return (
        <>
         <NavBar />
         <div className="bg-background flex flex-col items-center text-text w-full font-roboto min-h-screen">
        <p className="text-4xl mt-[5%]"> D1. Specifications </p>
        <div className="container mx-auto px-[15%]">
          <p className="text-3xl"> User Stories </p>
          <p className="text-lg font-semibold"> As Debby Dietician... </p>
          <li>I want to quickly calculate nutritional needs based on patient age, length, and height so that I can spend more time interacting with my patients.</li>
          <li>I want to compare the nutrition amount in a recipe to the DRI so that I can easily identify missing nutrients or nutrients with values below 67%.</li>
          <li>I want to calculate expected weight and growth for a child, so that I can assess how far off they are from the target growth.</li>
          <li>I want to create accurate formula recipes, so that I can ensure children receive the right nutrition.</li>
          <li>I want to know the calorie content of a formula, so that I can evaluate whether it meets a child’s needs.</li>
          <li>I want a centralized database of formula information so I don’t have to look through multiple different sources.</li>
          <li>I want the database to stay up to date so I won’t try to use formulas that don’t exist anymore.</li>
          <li>I want to print out a formula plan without patient identifiers so the parents have clear instructions and the plan stays HIPAA compliant.</li>
          <li>I want to favorite formulas so I can quickly view the ones I use most often.</li>
          <li>I want to add multiple formulas into a single recipe so that I can create customized feeding plans.</li>
          <li>I want to view detailed formula information (name, manufacturer, protein source, key nutrients, key features), so that I can make informed clinical decisions.</li>
        <br></br>
          <p className="text-lg font-semibold"> As Adam Administrator... </p>
          <li>I want to review and validate data so I can make sure the database remains accurate and clean.</li>
          <li>I want to activate or deactivate formulas so dieticians only use formulas that are current and valid.</li>
        </div>
        </div>
        <BottomBar />
        </>
    )
}
export default Specifications;