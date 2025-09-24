import BottomBar from "@/components/bottombar";
import Concept from "@/components/concept";
import NavBar from "@/components/navbar";
import Quick from "@/components/quick";

const Index = () => {
  return (
    <div className="bg-background flex flex-col items-center w-full font-roboto min-h-screen">
      <NavBar />
      <Quick />
      <Concept />
      <BottomBar />
    </div>
  );
};

export default Index;
