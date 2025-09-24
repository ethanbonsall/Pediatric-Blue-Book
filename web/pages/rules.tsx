import BottomBar from "@/components/bottombar";
import NavBar from "@/components/navbar";

const TeamRules = () => {
  return (
    <>
      <NavBar />
      <div className="bg-background flex text-text items-center flex-col font-roboto min-h-screen">
        <p className=" text-4xl mt-[5%]"> Team Rules </p>
        <br></br>
        <div className="container mx-auto px-[15%]">
          <p className="text-2xl"> Team Behavior </p>
          <li>
            The primary team communication tool will be the team group chat.
          </li>
          <li>
            If a member is late or will be absent, they will notify the team
            through the agreed communication channel ASAP. Critical updates will
            be sent through the channel as well.{" "}
          </li>
          <li>
            Team members will respond to messages and emails within 24 hours on
            weekdays. If no response is received within the agreed timeframe,
            silence will be taken as agreement unless stated otherwise.
          </li>
          <li>
            {" "}
            Any communication with our client, coach, and professor will be done
            via email and all teammates will be copied on the email.
          </li>
          <li>
            {" "}
            Meetings will start at the scheduled time. All members are expected
            to join on time.
          </li>
          <li>
            All members are expected to contribute actively and respectfully.
          </li>
          <li>
            If a member anticipates falling behind, they must notify the team
            immediately to allow time for adjustments.
          </li>
          <li>
            Teams will work together to address any issues as early as possible
            and determine a resolution.{" "}
          </li>
          <li>
            For critical tasks, one member will be designated as a backup to
            step in if needed.
          </li>
          <li>
            If delays occur, the team will redistribute work to balance the
            load.
          </li>
        </div>
        <br></br>
        <div className="container mx-auto px-[15%]">
          <p className="text-2xl"> Coding Practices </p>
          <li>
            We will conform to the style guide for each language we will be
            using.
          </li>
          <li>Commit messages must follow the Convention Commit Standard.</li>
          <li>
            All work will be done in individual feature branches; no direct
            commits to main.
          </li>
          <li>Pull Requests (PRs) are required before merging into main.</li>
          <li>
            At least one other team member must review and approve a PR before
            it is merged.
          </li>
          <li>Code should not be merged if build/tests are failing.</li>
          <li>
            The team will work to actively maintain documentation: including
            comments in code, updating the project board, tool documentation
          </li>
          <li>Documentation will be updated at minimum every two weeks</li>
        </div>
      </div>
      <BottomBar />
    </>
  );
};

export default TeamRules;
