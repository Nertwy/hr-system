import { Transition } from "@headlessui/react";
import { type Resume } from "@prisma/client";
import { type NextPage } from "next";
import { type ChangeEvent, Fragment, useEffect, useState } from "react";
import { toast } from "react-toastify";
import DialogBox from "~/components/DialogBox";
import NavBar from "~/components/NavBar";
import {
  BackGround,
  CustomTr,
  EditButton,
  InputForTable,
  SearchComponent,
} from "~/components/SmallComponents";
import Spinner from "~/components/Spinner";
import { createKeyCycler, handleChange, handleSort } from "~/hooks/hooks";
import { api } from "~/utils/api";

const cycleKey = createKeyCycler<Resume>({
  id: -1,
  achievements: "",
  candidate_id: -1,
  education: "",
  experience: "",
  skills: "",
});
type ResumeKey = keyof Resume;
const columnNames: { name: ResumeKey; value: string }[] = [
  {
    name: "id",
    value: "Індекс",
  },
  {
    name: "achievements",
    value: "Досягнення",
  },
  {
    name: "experience",
    value: "Досвід",
  },
  {
    name: "education",
    value: "Освіта",
  },
  {
    name: "candidate_id",
    value: "Індекс кандидата",
  },
];
const ResumeTable: NextPage = () => {
  const [editIndex, setEditIndex] = useState(-1);
  const [deletedRow, setDeletedRow] = useState<number | null>(null);
  const { data, isLoading, isFetched } = api.CRUD.getAllResumes.useQuery();
  const [resumes, setResumes] = useState<Resume[]>(data ?? []);
  const [filter, setFilter] = useState<Resume[]>(data ?? []);
  const changeResume = api.CRUD.changeResume.useMutation();
  const deleteResume = api.CRUD.deleteResume.useMutation();
  useEffect(() => {
    setFilter(data ?? []);
    setResumes(data ?? []);
  }, [isFetched]);
  if (isLoading) return <Spinner />;
  function handleDeleteQuery(id: number) {
    deleteResume.mutate(id, {
      onError(error) {
        console.log(error);
        toast.error("При видаленні сталася помилка!");
      },
      onSuccess() {
        toast.success("Запис успішно видалено");
      },
    });
  }

  const handleSubmitChange = (id: number) => {
    const resume: Resume | undefined = resumes.find((val) => val.id === id);

    if (!resume) {
      throw new Error("Резюме за цим id не знайдено!");
    }

    changeResume.mutate(resume, {
      onError(error) {
        toast.error("Виникла помилка");
        console.log(error);
      },
      onSuccess() {
        toast.success("Запис створено!");
      },
    });
  };
  return (
    <BackGround>
      <NavBar></NavBar>
      <div className="flex flex-col">
        <SearchComponent
          data={resumes}
          filteredData={filter}
          setFilterState={setFilter}
          cycleKey={cycleKey}
        />
        <table>
          <thead>
            <CustomTr
              columnNames={columnNames}
              onSort={(key, isAscending) =>
                handleSort(key, isAscending, filter, setFilter)
              }
            ></CustomTr>
          </thead>
          <tbody>
            {filter?.map((res: Resume) => (
              <Fragment key={res.id}>
                <Transition
                  as="tr"
                  className="rounded-xl text-white"
                  show={deletedRow !== res.id}
                  enter="transition-opacity duration-75"
                  enterFrom="opacity-0"
                  enterTo="opacity-100"
                  leave="transition-opacity duration-150"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                  onTransitionEnd={() =>
                    setResumes(resumes?.filter((v) => v.id !== deletedRow))
                  }
                >
                  <td className="border border-blue-400 px-4 py-2">{res.id}</td>
                  <td className="border border-blue-400 px-4 py-2">
                    <InputForTable
                      onChangeNew={(e: ChangeEvent<HTMLInputElement>) =>
                        handleChange(e, setResumes, editIndex)
                      }
                      name="achievements"
                      title="achievements"
                      defaultValue={res.achievements}
                      edit={editIndex === res.id}
                    />
                  </td>
                  <td className="border border-blue-400 px-4 py-2">
                    <InputForTable
                      name="experience"
                      onChangeNew={(e: ChangeEvent<HTMLInputElement>) =>
                        handleChange(e, setResumes, editIndex)
                      }
                      title="achivements"
                      defaultValue={res.experience}
                      edit={editIndex === res.id}
                    />
                  </td>
                  <td className="border border-blue-400 px-4 py-2">
                    <InputForTable
                      onChangeNew={(e: ChangeEvent<HTMLInputElement>) =>
                        handleChange(e, setResumes, editIndex)
                      }
                      name="education"
                      title="education"
                      defaultValue={res.education}
                      edit={editIndex === res.id}
                    />
                  </td>
                  <td className="border border-blue-400 px-4 py-2">
                    <InputForTable
                      onChangeNew={(e: ChangeEvent<HTMLInputElement>) =>
                        handleChange(e, setResumes, editIndex)
                      }
                      name="candidate_id"
                      title="candidate_id"
                      defaultValue={res.candidate_id}
                      edit={editIndex === res.id}
                    />
                  </td>
                  <td className="border border-blue-400 px-4 py-2">
                    <EditButton
                      setId={() => {
                        setEditIndex(res.id ?? -1);
                      }}
                      handleCancel={() => setEditIndex(-1)}
                      handleSubmit={() => handleSubmitChange(res.id)}
                    />
                  </td>
                  <td className="border border-blue-400 px-4 py-2">
                    <DialogBox
                      buttonName="Видалити"
                      text="Резюме буде видалено!"
                      title="Видалити Резюме?"
                      onAccept={() => {
                        setDeletedRow(res.id ?? -1);
                        handleDeleteQuery(res.id ?? -1);
                      }}
                    />
                  </td>
                </Transition>
              </Fragment>
            )) ?? null}
          </tbody>
        </table>
      </div>
    </BackGround>
  );
};
export default ResumeTable;
