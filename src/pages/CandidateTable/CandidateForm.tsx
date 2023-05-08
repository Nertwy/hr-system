import {
  type FC,
  useState,
  Fragment,
  type HTMLInputTypeAttribute,
  useEffect,
} from "react";
import { api } from "~/utils/api";
import { Transition } from "@headlessui/react";
import DialogBox from "~/components/DialogBox";
import { EditButton } from "~/components/SmallComponents";
import Spinner from "~/components/Spinner";
import { type Candidate } from "@prisma/client";
import { toast } from "react-toastify";
const CandidateTable: FC = () => {
  const [deletedRow, setDeletedRow] = useState<number | null>(null);
  const { data, isLoading, isFetched } = api.CRUD.getAllCandidates.useQuery();
  const [candidates, setCandidates] = useState<Candidate[] | undefined>(data);
  const [editIndex, setEditIndex] = useState(-1);
  const deleteCandidate = api.CRUD.deleteCandidate.useMutation();
  const updateCandidate = api.CRUD.changeCandidate.useMutation();
  const [candidateState, setCandidateState] = useState<Candidate>({
    application_date: new Date(),
    comments: "",
    email: "",
    first_name: "",
    id: -1,
    last_name: "",
    phone: "",
    status: "",
    vacancyId: null,
  });
  const handleInputChange = (name: string, value: string) => {
    setCandidateState({
      ...candidateState,
      [name]: value,
    });
    console.log(candidateState);
  };
  useEffect(() => {
    setCandidates(data ?? []);
  }, [isFetched]);
  const handleSubmitChange = () => {
    updateCandidate.mutate(candidateState, {
      onSuccess: () => {
        toast.success("Запис змінено!");
        setCandidates([
          candidateState,
          ...(candidates?.filter(
            (candidate) => candidate.id !== candidateState.id
          ) ?? []),
        ]);
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

  if (isLoading) {
    return <Spinner />;
  }
  return (
    <div className="m-auto mt-12 w-5/6 pt-28">
      <table className="w-full table-auto border-collapse">
        <thead>
          <tr className="text-white">
            <th className="border border-blue-400 px-4 py-2" scope="col">
              ID
            </th>
            <th className="border border-blue-400 px-4 py-2" scope="col">
              Вакансія
            </th>
            <th className="border border-blue-400 px-4 py-2" scope="col">
              {"Ім'я"}
            </th>
            <th className="border border-blue-400 px-4 py-2" scope="col">
              Фамілія
            </th>
            <th className="border border-blue-400 px-4 py-2" scope="col">
              Пошта
            </th>
            <th className="border border-blue-400 px-4 py-2" scope="col">
              Телефон
            </th>
            <th className="border border-blue-400 px-4 py-2" scope="col">
              Статус
            </th>
            <th className="border border-blue-400 px-4 py-2" scope="col">
              Коментарі
            </th>
            <th className="border border-blue-400 px-4 py-2" scope="col">
              Редагувати
            </th>
            <th className="border border-blue-400 px-4 py-2" scope="col">
              Видалити запис
            </th>
          </tr>
        </thead>
        <tbody className="rounded-xl">
          {candidates?.map((candidate) => (
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
                    type="number"
                    defaultValue={candidate.vacancyId ?? -1}
                    edit={editIndex === candidate.id}
                    title="vacancyId"
                    onChange={handleInputChange}
                  />
                </td>
                <td className="border border-blue-400 px-4 py-2">
                  <InputForTable
                    title="first_name"
                    defaultValue={candidate.first_name}
                    edit={editIndex === candidate.id}
                    onChange={handleInputChange}
                  />
                </td>
                <td className="border border-blue-400 px-4 py-2">
                  <InputForTable
                    defaultValue={candidate.last_name}
                    edit={editIndex === candidate.id}
                    title="last_name"
                    onChange={handleInputChange}
                  />
                </td>
                <td className="border border-blue-400 px-4 py-2">
                  <InputForTable
                    defaultValue={candidate.email}
                    type="email"
                    edit={editIndex === candidate.id}
                    title="email"
                    onChange={handleInputChange}
                  />
                </td>
                <td className="border border-blue-400 px-4 py-2">
                  <InputForTable
                    defaultValue={candidate.phone}
                    type="tel"
                    edit={editIndex === candidate.id}
                    title="phone"
                    onChange={handleInputChange}
                  />
                </td>
                <td className="border border-blue-400 px-4 py-2">
                  <InputForTable
                    defaultValue={candidate.status}
                    edit={editIndex === candidate.id}
                    title="status"
                    onChange={handleInputChange}
                  />
                </td>
                <td className="border border-blue-400 px-4 py-2">
                  <InputForTable
                    defaultValue={candidate.comments ?? ""}
                    type="text"
                    edit={editIndex === candidate.id}
                    title="comments"
                    onChange={handleInputChange}
                  />
                </td>
                <td className="border border-blue-400 px-4 py-2">
                  <EditButton
                    setId={() => {
                      setCandidateState({
                        ...candidate,
                      });
                      setEditIndex(candidate.id ?? -1);
                    }}
                    handleCancel={() => setEditIndex(-1)}
                    handleSubmit={handleSubmitChange}
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
type InputForTableProps = {
  defaultValue: string | number;
  type?: HTMLInputTypeAttribute;
  edit?: boolean;
  title?: string;
  onChange?: (title: string, eventValue: string) => void;
};
const InputForTable: FC<InputForTableProps> = ({
  defaultValue,
  type = "text",
  edit = false,
  onChange,
  title,
}) => {
  return (
    <>
      {!edit ? (
        <>{defaultValue}</>
      ) : (
        <input
          className="peer block w-full appearance-none border-0 border-b-2 border-gray-100 bg-transparent  py-2.5 text-sm text-gray-900 focus:border-red-600 focus:outline-none focus:ring-0 dark:border-gray-600 dark:text-white dark:focus:border-red-500"
          defaultValue={defaultValue}
          type={type}
          onChange={(event) => {
            onChange?.(title ?? "", event.currentTarget.value);
          }}
        />
      )}
    </>
  );
};

export default CandidateTable;
