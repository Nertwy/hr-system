import { type NextPage } from "next";
import CandidateTable from "./CandidateForm";
import NavBar from "~/components/NavBar";
import { BackGround } from "~/components/SmallComponents";

const CandidateTablePage: NextPage = () => {
  return (
    <>
      <BackGround>
        <NavBar />
        <CandidateTable />
      </BackGround>
    </>
  );
};
export default CandidateTablePage;
