import { Transition } from "@headlessui/react";
import {
  useState,
  type FC,
  useEffect,
  Fragment,
  HTMLInputTypeAttribute,
  InputHTMLAttributes,
  ChangeEventHandler,
  ChangeEvent,
} from "react";
import { toast } from "react-toastify";
import DialogBox from "~/components/DialogBox";
import NavBar from "~/components/NavBar";
import { EditButton, MyComponent } from "~/components/SmallComponents";
import Spinner from "~/components/Spinner";
import { Vacancy } from "~/interface";
import { api } from "~/utils/api";

const VacancyTable: FC = () => {
  const [deletedRow, setDeletedRow] = useState<number | null>(null);
  const { data, isLoading, isFetched } = api.CRUD.getAllVacancies.useQuery();
  const [vacancies, setVacancies] = useState<Vacancy[] | undefined>(data);
  const deleteVacancy = api.CRUD.deleteVacancy.useMutation();
  const [editIndex, setEditIndex] = useState(-1);
  const changeVacancy = api.CRUD.changeVacancy.useMutation();
  const [vacancyState, setVacancyState] = useState<Vacancy>({
    title: "",
    closing_date: new Date(),
    department: "",
    description: "",
    posting_date: new Date(),
    status: "",
    requirements: "",
  });
  const handleInputChange = (name: string, value: string) => {
    setVacancyState({
      ...vacancyState,
      [name]: value,
    });
    console.log(vacancyState);
  };
  useEffect(() => {
    setVacancies(data);
  }, [isFetched]);
  const handleSubmitChange = () => {
    changeVacancy.mutate(
      {
        ...vacancyState,
        id: editIndex,
        closing_date: new Date(vacancyState.closing_date),
        posting_date: new Date(vacancyState.posting_date),
      },
      {
        onSuccess: () => {
          toast.success("Запис змінено!");
          setVacancies([
            vacancyState,
            ...(vacancies?.filter(
              (vacancy) => vacancy.id !== vacancyState.id
            ) ?? []),
          ]);
        },
        onError() {
          toast.error("Сталася помилка!");
        },
      }
    );
  };
  const handleDeleteQuery = (vacancyId: number) => {
    deleteVacancy.mutate(vacancyId, {
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
    // setVacancies(null);
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
              Title
            </th>
            <th className="border border-blue-400 px-4 py-2" scope="col">
              Department
            </th>
            <th className="border border-blue-400 px-4 py-2" scope="col">
              Posting Date
            </th>
            <th className="border border-blue-400 px-4 py-2" scope="col">
              Closing Date
            </th>
            <th className="border border-blue-400 px-4 py-2" scope="col">
              Status
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
          {vacancies?.map((vacancy) => (
            <Fragment key={vacancy.id}>
              <Transition
                as="tr"
                className="rounded-xl text-white"
                show={deletedRow !== vacancy.id}
                enter="transition-opacity duration-75"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="transition-opacity duration-150"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
                onTransitionEnd={() =>
                  setVacancies(vacancies?.filter((v) => v.id !== deletedRow))
                }
              >
                <td className="border border-blue-400 px-4 py-2">
                  {vacancy.id}
                </td>
                <td className="border border-blue-400 px-4 py-2">
                  <InputForTable
                    defaultValue={vacancy.title}
                    edit={editIndex === vacancy.id}
                    title="title"
                    onChange={handleInputChange}
                  />
                </td>
                <td className="border border-blue-400 px-4 py-2">
                  <InputForTable
                    title="department"
                    defaultValue={vacancy.department}
                    edit={editIndex === vacancy.id}
                    onChange={handleInputChange}
                  />
                </td>
                <td className="border border-blue-400 px-4 py-2">
                  <InputForTable
                    defaultValue={vacancy.posting_date
                      .toISOString()
                      .slice(0, 10)}
                    type="date"
                    edit={editIndex === vacancy.id}
                    title="posting_date"
                    onChange={handleInputChange}
                  />
                </td>
                <td className="border border-blue-400 px-4 py-2">
                  <InputForTable
                    defaultValue={vacancy.closing_date
                      .toISOString()
                      .slice(0, 10)}
                    type="date"
                    edit={editIndex === vacancy.id}
                    title="closing_date"
                    onChange={handleInputChange}
                  />
                </td>
                <td className="border border-blue-400 px-4 py-2">
                  <InputForTable
                    defaultValue={vacancy.status}
                    type="text"
                    edit={editIndex === vacancy.id}
                    title="status"
                    onChange={handleInputChange}
                  />
                </td>
                <td className="border border-blue-400 px-4 py-2">
                  <EditButton
                    setId={() => {
                      setVacancyState({
                        ...vacancy,
                      });
                      setEditIndex(vacancy.id ?? -1);
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
                      setDeletedRow(vacancy.id ?? -1);
                      handleDeleteQuery(vacancy.id ?? -1);
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
  defaultValue: string;
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

export default VacancyTable;
