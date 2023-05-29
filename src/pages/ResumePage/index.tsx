import { Combobox, Transition } from "@headlessui/react";
import { ChevronUpDownIcon, CheckIcon } from "@heroicons/react/20/solid";
import { Candidate, Resume } from "@prisma/client";
import { type NextPage } from "next";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { type FC, useEffect, useState, Fragment } from "react";
import { toast } from "react-toastify";
import NavBar from "~/components/NavBar";
import {
  BackGround,
  CustomInput,
  SubmitButton,
} from "~/components/SmallComponents";
import Spinner from "~/components/Spinner";
import { api } from "~/utils/api";
const ResumePage: NextPage = () => {
  const router = useRouter();
  const { data: sessionData, status } = useSession();

  const [resume, setResume] = useState<Resume>({
    achievements: "",
    candidate_id: -1,
    education: "",
    experience: "",
    id: -1,
    skills: "",
  });
  const { data, isLoading, isFetched } = api.CRUD.getAllCandidates.useQuery();
  const [candidates, setCandidates] = useState(data ?? []);
  const [candidateId, setCandidateId] = useState<number | null>(null);
  const insertResume = api.CRUD.postResume.useMutation();
  useEffect(() => {
    setCandidates(data ?? []);
  }, [isFetched]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!resume) return;
    if (!candidateId) return;
    insertResume.mutate(
      { ...resume, candidate_id: candidateId },
      {
        onError(error) {
          toast.error("Сталася помилка");
          console.log(error);
        },
        onSuccess() {
          toast.success("Запис створено успішно!");
        },
      }
    );
  };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.currentTarget;
    setResume((prevDepartment) => ({
      ...prevDepartment,
      [name]: value,
    }));
  };
  
  if (isLoading) {
    return <Spinner />;
  }
  if (!sessionData && status !== "loading") {
    void router.push("/api/auth/signin");
    return null;
  }
  return (
    <>
      <BackGround>
        <NavBar></NavBar>
        <form
          className="w-2/5 rounded-lg bg-black bg-opacity-60 p-8"
          onSubmit={handleSubmit}
        >
          <h1 className="pb-4 text-center text-2xl text-white">
            Створити резюме
          </h1>
          <CustomInput
            name="experience"
            text="Досвід роботи"
            onChange={(e) => handleChange(e)}
          ></CustomInput>
          <CustomInput
            name="education"
            text="Освіта"
            onChange={(e) => handleChange(e)}
          />
          <CustomInput
            name="skills"
            text="Навички"
            onChange={(e) => handleChange(e)}
          />
          <CustomInput
            name="achivements"
            text="Досягнення"
            onChange={(e) => handleChange(e)}
          />
          <label className="text-white">Оберіть ваканта</label>
          <ComboBoxAuto data={candidates} callback={setCandidateId} />
          <div className="pt-4">
            <SubmitButton />
          </div>
        </form>
      </BackGround>
    </>
  );
};

export default ResumePage;

type ComboBoxAutoType = {
  data: Candidate[] | null;
  callback: (vacancyId: number | null) => void;
};
const ComboBoxAuto: FC<ComboBoxAutoType> = ({ callback, data }) => {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<Candidate | null>(null);
  useEffect(() => {
    setSelected(data?.[0] ?? null);
    callback(selected?.id ?? data?.[0]?.id ?? null);
  }, []);
  const filteredPeople =
    query === "" || !data
      ? data
      : data.filter((candidate) =>
          candidate.last_name
            .toLowerCase()
            .replace(/\s+/g, "")
            .includes(query.toLowerCase().replace(/\s+/g, ""))
        );
  return (
    <div className="max-h-40">
      <Combobox
        value={selected}
        onChange={(e) => {
          setSelected(e);
          callback(e?.id ?? null);
        }}
      >
        <div className="relative mt-1">
          <div className="relative w-full cursor-default overflow-hidden rounded-lg bg-white text-left shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-red-300 sm:text-sm">
            <Combobox.Input
              className="w-full border-none py-2 pl-3 pr-10 text-sm leading-5 text-gray-900 focus:ring-0"
              onChange={(event) => setQuery(event.target.value)}
              displayValue={(candidate: Candidate) => candidate?.last_name}
            />
            <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
              <ChevronUpDownIcon
                className="h-5 w-5 text-gray-400"
                aria-hidden="true"
              />
            </Combobox.Button>
          </div>
          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
            afterLeave={() => setQuery("")}
          >
            <Combobox.Options className="absolute mt-1 max-h-40 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
              {filteredPeople?.length === 0 && query !== "" ? (
                <div className="relative cursor-default select-none px-4 py-2 text-gray-700">
                  Nothing found.
                </div>
              ) : (
                filteredPeople?.map((candidate: Candidate) => (
                  <Combobox.Option
                    key={candidate.id}
                    className={({ active }) =>
                      `relative cursor-default select-none py-2 pl-10 pr-4 ${
                        active ? "bg-red-600 text-white" : "text-gray-900"
                      }`
                    }
                    value={candidate}
                  >
                    {({ selected, active }) => (
                      <>
                        <span
                          className={`block truncate ${
                            selected ? "font-medium" : "font-normal"
                          }`}
                        >
                          {candidate.last_name}
                        </span>
                        {selected ? (
                          <span
                            className={`absolute inset-y-0 left-0 flex items-center pl-3 ${
                              active ? "text-white" : "text-red-600"
                            }`}
                          >
                            <CheckIcon className="h-5 w-5" aria-hidden="true" />
                          </span>
                        ) : null}
                      </>
                    )}
                  </Combobox.Option>
                ))
              )}
            </Combobox.Options>
          </Transition>
        </div>
      </Combobox>
    </div>
  );
};
