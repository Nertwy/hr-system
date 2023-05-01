import { type NextPage } from "next";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import AddVacancyForm from "./AddCandidateForm";
import NavBar from "~/components/NavBar";
const VacancyPage: NextPage = () => {
  const router = useRouter();
  const { data, status } = useSession();
  if (!data && status !== "loading") {
    void router.push("/api/auth/signin");
    return null;
  }

  return (
    <>
      <div className="flex h-screen w-screen items-center justify-center bg-gradient-to-b from-[#6d0214] to-[#2c1519]">
        <NavBar/>
        <AddVacancyForm />
      </div>
    </>
  );
};

export default VacancyPage;
