import {
  type FC,
  useState,
  Fragment,
  useEffect,
  type ChangeEvent,
} from "react";
import { api } from "~/utils/api";
import { Transition } from "@headlessui/react";
import DialogBox from "~/components/DialogBox";
import {
  CustomTr,
  EditButton,
  InputForTable,
  SearchComponent,
} from "~/components/SmallComponents";
import Spinner from "~/components/Spinner";
import { type Candidate } from "@prisma/client";
import { toast } from "react-toastify";
import { createKeyCycler, handleChange, handleSort } from "~/hooks/hooks";
import { type Option } from "~/components/SmallComponents";
const cycleKey = createKeyCycler<Candidate>({
  id: -1,
  vacancyId: null,
  first_name: "",
  last_name: "",
  email: "",
  phone: "",
  application_date: new Date(),
  status: "",
  comments: null,
});
const CandidateTable: FC = () => {
  const [deletedRow, setDeletedRow] = useState<number | null>(null);
  const { data, isLoading, isFetched } = api.CRUD.getAllCandidates.useQuery();
  const [candidates, setCandidates] = useState<Candidate[]>(data ?? []);
  const [filter, setFilter] = useState<Candidate[]>(candidates ?? []);
  const [editIndex, setEditIndex] = useState(-1);
  const deleteCandidate = api.CRUD.deleteCandidate.useMutation();
  const updateCandidate = api.CRUD.changeCandidate.useMutation();
  const [vacancyOptions, setVacancyOptions] = useState<Option<string>[]>([]);
  const vacancy = api.CRUD.getAllVacancies.useQuery();
  useEffect(() => {
    setCandidates(data ?? []);
    setFilter(data ?? []);
    setVacancyOptions(
      vacancy.data
        ? vacancy?.data.map((elem) => ({
            id: elem.id,
            fieldName: elem.title,
          }))
        : []
    );
  }, [isFetched, vacancy.isFetched]);
  const handleSubmitChange = (id: number) => {
    const candidateNew: Candidate | undefined = candidates.find(
      (val) => val.id === id
    );
    if (!candidateNew) return;
    updateCandidate.mutate(candidateNew, {
      onSuccess: () => {
        toast.success("Запис змінено!");
      },
      onError() {
        toast.error("Сталася помилка!");
      },
    });
  };
  const handleDeleteQuery = (vacancyId: number) => {
    deleteCandidate.mutate(vacancyId, {
      onSuccess(data) {
        toast.success(`Запис з Id  ${data.id} видалено!`);
      },
      onError(error) {
        toast.error("Запис не видалено!");
        console.log(error);
      },
    });
  };
  const columnNames: { name: keyof Candidate; value: string }[] = [
    {
      name: "id",
      value: "ID",
    },
    {
      name: "vacancyId",
      value: "Код вакансії",
    },
    {
      name: "first_name",
      value: "Ім'я",
    },
    {
      name: "last_name",
      value: "Фамілія",
    },
    {
      name: "email",
      value: "Пошта",
    },
    {
      name: "phone",
      value: "Телефон",
    },
    {
      name: "status",
      value: "Статус",
    },
    {
      name: "comments",
      value: "Коментарі",
    },
  ];
  if (isLoading) {
    return <Spinner />;
  }
  return (
    <div className="m-auto mt-12 w-5/6 pt-28">
      <table className="w-full table-auto border-collapse">
        <thead>
          <SearchComponent
            data={candidates}
            filteredData={filter}
            setFilterState={setFilter}
            cycleKey={cycleKey}
          ></SearchComponent>
          <CustomTr
            columnNames={columnNames}
            onSort={(key, isAscending) =>
              handleSort(key, isAscending, filter, setFilter)
            }
          />
        </thead>

        <tbody className="rounded-xl">
          {filter?.map((candidate) => (
            <Fragment key={candidate.id}>
              <Transition
                as="tr"
                className="rounded-xl text-white"
                show={deletedRow !== candidate.id}
                enter="transition-opacity duration-75"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="transition-opacity duration-150"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
                onTransitionEnd={() =>
                  setCandidates(candidates?.filter((v) => v.id !== deletedRow))
                }
              >
                <td className="border border-blue-400 px-4 py-2">
                  {candidate.id}
                </td>
                <td className="border border-blue-400 px-4 py-2">
                  <InputForTable
                    dataForDropBox={vacancyOptions}
                    name="vacancyId"
                    type="dropbox"
                    defaultValue={candidate.vacancyId ?? -1}
                    edit={editIndex === candidate.id}
                    title="vacancyId"
                    onChangeNew={(e) =>
                      handleChange(e, setCandidates, editIndex)
                    }
                  />
                </td>
                <td className="border border-blue-400 px-4 py-2">
                  <InputForTable
                    name="first_name"
                    title="first_name"
                    defaultValue={candidate.first_name}
                    edit={editIndex === candidate.id}
                    onChangeNew={(e) =>
                      handleChange(e, setCandidates, editIndex)
                    }
                  />
                </td>
                <td className="border border-blue-400 px-4 py-2">
                  <InputForTable
                    name="last_name"
                    defaultValue={candidate.last_name}
                    edit={editIndex === candidate.id}
                    title="last_name"
                    onChangeNew={(e) =>
                      handleChange(e, setCandidates, editIndex)
                    }
                  />
                </td>
                <td className="border border-blue-400 px-4 py-2">
                  <InputForTable
                    name="email"
                    defaultValue={candidate.email}
                    type="email"
                    edit={editIndex === candidate.id}
                    title="email"
                    onChangeNew={(e) =>
                      handleChange(e, setCandidates, editIndex)
                    }
                  />
                </td>
                <td className="border border-blue-400 px-4 py-2">
                  <InputForTable
                    name="phone"
                    defaultValue={candidate.phone}
                    type="tel"
                    edit={editIndex === candidate.id}
                    title="phone"
                    onChangeNew={(e) =>
                      handleChange(e, setCandidates, editIndex)
                    }
                  />
                </td>
                <td className="border border-blue-400 px-4 py-2">
                  <InputForTable
                    name="status"
                    defaultValue={candidate.status}
                    edit={editIndex === candidate.id}
                    title="status"
                    onChangeNew={(e) =>
                      handleChange(e, setCandidates, editIndex)
                    }
                  />
                </td>
                <td className="border border-blue-400 px-4 py-2">
                  <InputForTable
                    name="comments"
                    defaultValue={candidate.comments ?? ""}
                    type="text"
                    edit={editIndex === candidate.id}
                    title="comments"
                    onChangeNew={(e) =>
                      handleChange(e, setCandidates, editIndex)
                    }
                  />
                </td>
                <td className="border border-blue-400 px-4 py-2">
                  <EditButton
                    setId={() => setEditIndex(candidate.id ?? -1)}
                    handleCancel={() => setEditIndex(-1)}
                    handleSubmit={() => handleSubmitChange(candidate.id)}
                  />
                </td>
                <td className="border border-blue-400 px-4 py-2">
                  <DialogBox
                    buttonName="Видалити"
                    text="Усі кандидати за цією вакансією будуть видалені!"
                    title="Видалити вакансію?"
                    onAccept={() => {
                      setDeletedRow(candidate.id ?? -1);
                      handleDeleteQuery(candidate.id ?? -1);
                    }}
                  />
                </td>
              </Transition>
            </Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CandidateTable;
