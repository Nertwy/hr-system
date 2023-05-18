import { type NextPage } from "next";
import NavBar from "~/components/NavBar";
import VacancyForm from "./VacancyForm";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";

const VacancyPage: NextPage = () => {
  const router = useRouter();
  const { data, status } = useSession();
  if (!data && status !== "loading") {
    void router.push("/api/auth/signin");
    return null;
  }
  return (
    <div className="flex h-screen w-screen items-center justify-center overflow-auto bg-gradient-to-b from-[#6d0214] to-[#2c1519]">
      <NavBar backgroundColor="" />
      <VacancyForm />
    </div>
  );
};

export default VacancyPage;
