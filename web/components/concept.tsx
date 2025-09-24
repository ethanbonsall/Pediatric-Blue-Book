const Concept = () => {
  return (
    <div className="w-full min-h-screen bg-secondary text-text flex items-center px-4 justify-center">
      <div className="max-w-4xl w-full p-10 bg-background shadow-md rounded-lg">
        <h1 className="text-3xl font-bold text-secondary-500 mb-.5">
          Pediatric Blue Book
        </h1>
        <p className = "text-2xl italic text-secondary-500 mb-4">Enhancing nutrition care for pediatric patients</p>
        <p className="text-text text-xl leading-relaxed">
          The Pediatric Blue Book, or PBB, is a web application designed to transform how pediatric dietitians access and apply nutritional information. Currently, dietitians
          often must juggle outdated manuals, scattered online materials, and time-consuming manual calculations. PBB provides a streamlined, digital platform to help dietitians create precise and personalized nutrition 
          plans faster and easier. By reducing errors, managing inefficiencies, and supporting evidence-based decision making, the Pediatric Blue Book helps dietitians focus on giving children the best chance to grow, recover, and thrive. 
        </p>
        <br></br>
        <p className="text-text text-xl leading-relaxed">The PBB streamlines dieticians daily workflow through three main features: a nutritional need calculator, a custom formula generator, and an ingredient lookup table; it also supports an administrator interface to allow 
          administrators to manage formulas and data quality. The nutritional need calculator allows dieticians to calculate nutritional needs based on the patient age, weight, and height and view the recommended nutrient 
          intake values. With the custom formula generator, dieticians can combine multiple formulas while instantly seeing the nutrient impact of each change. Age and sex-specific dietary reference intakes help ensure accuracy. The lookup table will aid with clinical decision making. Streamlining the workflow will give dieticians the ability to refine and optimize nutrition plans, leading to improved patient outcomes while reducing documentation fatigue and manual workload. </p>
      </div>
    </div>
  );
};

export default Concept;
