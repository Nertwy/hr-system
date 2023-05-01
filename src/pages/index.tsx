import { type NextPage } from "next";
import { signIn, signOut, useSession } from "next-auth/react";
import NavBar from "~/components/NavBar";

import { api } from "~/utils/api";

const Home: NextPage = () => {
  const bgColor = "bg-gradient-to-b from-[#6d0214] to-[#2c1519]";
  return (
    <>
      <div className="bg-gradient-to-b from-[#6d0214] to-[#2c1519]">
        <NavBar backgroundColor={bgColor} />
        <main className="flex min-h-screen flex-col items-center justify-center ">
          <div className="flex flex-col items-center gap-2">
            <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-[5rem]">
              <span className="text-[hsl()]">HR </span>
              <span className="text-[hsl(0,64%,41%)]">Systems</span> App
            </h1>
            <AuthShowcase />
          </div>
        </main>
      </div>
    </>
  );
};

export default Home;

const AuthShowcase: React.FC = () => {
  const { data: sessionData } = useSession();
  const { data: secretMessage } = api.example.getSecretMessage.useQuery(
    undefined, // no input
    { enabled: sessionData?.user !== undefined }
  );

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <p className="text-center text-2xl text-white">
        {sessionData && <span>Добрий день {sessionData.user?.name}</span>}
        {secretMessage && <span> - {secretMessage}</span>}
      </p>
      <button
        className="rounded-full bg-white/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20"
        onClick={sessionData ? () => void signOut() : () => void signIn()}
      >
        {sessionData ? "Sign out" : "Sign in"}
      </button>
    </div>
  );
};
