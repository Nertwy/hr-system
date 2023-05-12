import { Transition } from "@headlessui/react";
import { useState, type FC, useEffect, Fragment } from "react";
import { toast } from "react-toastify";
import DialogBox from "~/components/DialogBox";
import {
  CustomTr,
  EditButton,
  InputForTable,
  SearchComponent,
} from "~/components/SmallComponents";
import Spinner from "~/components/Spinner";
import { api } from "~/utils/api";
import { type Vacancy } from "@prisma/client";
import { createKeyCycler, handleSort } from "~/hooks/hooks";

const cycleKey = createKeyCycler<Vacancy>({
  closing_date: new Date(),
  department: "",
  description: "",
  id: -1,
  posting_date: new Date(),
  requirements: "",
  status: "",
  title: "",
});
const VacancyTable: FC = () => {
  const { data, isFetched, isSuccess } = api.CRUD.getAllVacancies.useQuery();
  const [editIndex, setEditIndex] = useState(-1);
  const [deletedRow, setDeletedRow] = useState<number | null>(null);
  const [vacancies, setVacancies] = useState<Vacancy[]>(data ?? []);
  const [filteredArr, setFilteredArr] = useState<Vacancy[]>(vacancies ?? []);
  const deleteVacancy = api.CRUD.deleteVacancy.useMutation();
  const changeVacancy = api.CRUD.changeVacancy.useMutation();
  const handleInputChange = (name: string, value: string) => {
    setVacancies((prevState: Vacancy[]) => {
      const updatedVacancies: Vacancy[] = prevState?.map((vacancy) => {
        if (editIndex === vacancy.id) {
          return {
            ...vacancy,
            [name]: value,
          };
        }
        return vacancy;
      });
      return updatedVacancies;
    });
  };

  useEffect(() => {
    setFilteredArr(data ?? []);
    setVacancies(data ?? []);
  }, [isFetched, isSuccess]);
  const handleSubmitChange = () => {
    const vacancy: Vacancy = vacancies.find(
      (elem) => elem.id === editIndex
    ) ?? {
      closing_date: new Date(),
      department: "",
      description: "",
      id: -1,
      posting_date: new Date(),
      requirements: "",
      status: "",
      title: "",
    };
    changeVacancy.mutate(
      {
        ...vacancy,
        id: editIndex,
        status: vacancy?.status ?? "",
        description: vacancy?.description ?? "",
        requirements: vacancy?.requirements ?? "",
        department: vacancy?.department ?? "",
        closing_date: new Date(vacancy?.closing_date ?? ""),
        posting_date: new Date(vacancy?.posting_date ?? ""),
      },
      {
        onSuccess: () => {
          toast.success("Запис змінено!");
          setVacancies([
            vacancy,
            ...(vacancies?.filter((vacancy) => vacancy.id !== editIndex) ?? []),
          ]);
          setFilteredArr([
            vacancy,
            ...(vacancies?.filter((vacancy) => vacancy.id !== editIndex) ?? []),
          ]);
          // void refetch();
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
  const columnNames: { name: keyof Vacancy; value: string }[] = [
    { name: "id", value: "ID" },
    { name: "title", value: "заголовок" },
    { name: "department", value: "департамент" },
    { name: "posting_date", value: "Дата створення" },
    { name: "closing_date", value: "Дата закриття" },
    { name: "status", value: "Статус" },
  ];
  if (!isFetched) {
    return <Spinner />;
  }

  return (
    <div className="m-auto mt-12 w-5/6 pt-28">
      <SearchComponent
        cycleKey={cycleKey}
        data={vacancies}
        filteredData={filteredArr}
        setFilterState={setFilteredArr}
      />
      <table className="w-full table-auto border-collapse">
        <thead>
          <CustomTr
            columnNames={columnNames}
            onSort={(key, isAscending) =>
              handleSort(key, isAscending, filteredArr, setFilteredArr)
            }
          />
        </thead>
        <tbody className="rounded-xl">
          {filteredArr?.map((vacancy) => (
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
                    defaultValue={
                      vacancy.posting_date instanceof Date
                        ? vacancy.posting_date.toISOString().slice(0, 10)
                        : vacancy.posting_date
                    }
                    type="date"
                    edit={editIndex === vacancy.id}
                    title="posting_date"
                    onChange={handleInputChange}
                  />
                </td>
                <td className="border border-blue-400 px-4 py-2">
                  <InputForTable
                    defaultValue={
                      vacancy.closing_date instanceof Date
                        ? vacancy.closing_date.toISOString().slice(0, 10)
                        : vacancy.closing_date
                    }
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
export default VacancyTable;
