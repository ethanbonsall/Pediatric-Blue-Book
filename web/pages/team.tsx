import BottomBar from "@/components/bottombar";
import NavBar from "@/components/navbar";

const MeetTheTeam = () => {
  return (
    <>
      <NavBar />
      <div className="bg-background flex text-text items-center flex-col font-roboto min-h-screen">
        <p className=" text-4xl mt-[5%]"> Meet the Team </p>
        <br></br>
        <div className="flex container mx-auto px-[10%]">
            <div className="container mx-auto px-[5%]">
                <p className="text-2xl"> Lindsay Bean </p>
                <p className="text-2xl">Client Manager</p>
                <li className="inline hover:bg-secondary-400 p-2 rounded"><a href="mailto:lcbean@ad.unc.edu">lcbean@ad.unc.edu</a></li>
            </div>
            <div className="container mx-auto px-[5%]">
                <p className="text-2xl"> Ethan Bonsall </p>
                <p className="text-2xl">Tech Lead</p>
                <li className="inline hover:bg-secondary-400 p-2 rounded"><a href="mailto:ebonsall@unc.edu">ebonsall@unc.edu</a></li>
            </div>
            <div className="container mx-auto px-[5%]">
                <p className="text-2xl"> Archana Goli </p>
                <p className="text-2xl">Project Manager</p>
                <li className="inline hover:bg-secondary-400 p-2 rounded"><a href="mailto:archgoli@ad.unc.edu">archgoli@ad.unc.edu</a></li>
            </div>
            <div className="container mx-auto px-[5%]">
                <p className="text-2xl"> Aditi Pandey </p>
                <p className="text-2xl">Tech Lead</p>
                <li className="inline hover:bg-secondary-400 p-2 rounded"><a href="mailto:apandey@ad.unc.edu">apandey@ad.unc.edu</a></li>
            </div>
        </div>
      </div>
      <BottomBar />
    </>
  );
};

export default MeetTheTeam;
