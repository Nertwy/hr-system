import { type NextPage } from "next";
import NavBar from "~/components/NavBar";
import VacancyForm from "./VacancyForm";

const VacancyPage: NextPage = () => {
  return (
    <div className="flex h-screen w-screen items-center justify-center bg-gradient-to-b from-[#6d0214] to-[#2c1519] overflow-auto">
      <NavBar backgroundColor="" />
      <VacancyForm />
    </div>
  );
};

export default VacancyPage;
