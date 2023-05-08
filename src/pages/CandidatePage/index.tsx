import { type NextPage } from "next";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import AddVacancyForm from "./AddCandidateForm";
import NavBar from "~/components/NavBar";
import { BackGround } from "~/components/SmallComponents";
const VacancyPage: NextPage = () => {
  const router = useRouter();
  const { data, status } = useSession();
  if (!data && status !== "loading") {
    void router.push("/api/auth/signin");
    return null;
  }

  return (
    <>
      <BackGround>
        <NavBar />
        <AddVacancyForm />
      </BackGround>
    </>
  );
};

export default VacancyPage;
