import { type NextPage } from "next";
import VacancyTable from "./VacancyTable";
import NavBar from "~/components/NavBar";
import { BackGround } from "~/components/SmallComponents";

const VacancyAllPage: NextPage = () => {
  return (
    <BackGround>
      <NavBar />
      <VacancyTable />
    </BackGround>
  );
};
export default VacancyAllPage;
