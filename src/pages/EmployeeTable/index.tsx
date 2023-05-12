import { type NextPage } from "next";
import NavBar from "~/components/NavBar";
import {
  BackGround,
  CustomTr,
  EditButton,
  InputForTable,
  SearchComponent,
  type SortState,
} from "~/components/SmallComponents";
import Spinner from "~/components/Spinner";
import { api } from "~/utils/api";
import { handleSort } from "~/hooks/hooks";
import DialogBox from "~/components/DialogBox";
import { useState, useEffect } from "react";
import { type Employee } from "@prisma/client";
import { toast } from "react-toastify";
import { createKeyCycler } from "~/hooks/hooks";
const cycleKey = createKeyCycler<Employee>({
  id: -1,
  email: "",
  department_id: -1,
  first_name: "",
  hire_date: new Date(),
  job_title: "",
  last_name: "",
  phone: "",
  salary: 0,
});
const EmployeePage: NextPage = () => {
  const { data, isFetched, isError, refetch, isSuccess } =
    api.CRUD.getAllEmployees.useQuery();
  const [editIndex, setEditIndex] = useState(-1);
  const [employer, setEmployer] = useState<Employee>({
    department_id: -1,
    email: "",
    first_name: "",
    hire_date: new Date(),
    id: -1,
    job_title: "",
    last_name: "",
    phone: "",
    salary: -1,
  });
  const updateEmployee = api.CRUD.changeEmployee.useMutation();
  const deleteEmployee = api.CRUD.deleteEmployee.useMutation();
  const [employees, setEmployees] = useState<Employee[]>(data ?? []);
  const [filter, setFilter] = useState<Employee[]>([]);
  const columnNames: { name: keyof Employee; value: string }[] = [
    { name: "id", value: "ID" },
    { name: "first_name", value: "Ім'я" },
    { name: "last_name", value: "Прізвище" },
    { name: "email", value: "Пошта" },
    { name: "phone", value: "Телефон" },
    { name: "hire_date", value: "Дата взяття на роботу" },
    { name: "salary", value: "Зарплата" },
    { name: "job_title", value: "Заголовок" },
    { name: "department_id", value: "Департамент" },
  ];
  const handleSubmit = () => {
    updateEmployee.mutate(employer, {
      onSuccess() {
        toast.success("Запис змінено!");
        void refetch();
      },
      onError() {
        toast.error("Сталася помилка!");
      },
    });
  };

  const handleInputChange = (name: string, value: string) => {
    setEmployer({
      ...employer,
      [name]:
        name === "salary"
          ? Number(value)
          : name === "hire_date"
          ? new Date(value)
          : name === "department_id"
          ? Number(value)
          : value,
    });
    // console.log(employer);
  };
  useEffect(() => {
    setFilter(data ?? []);
    setEmployees(data ?? []);
  }, [isSuccess, data]);
  if (isError) {
    return <div className="text-white">Error accured!</div>;
  }
  function handleDeleteEmployee(id: number) {
    deleteEmployee.mutate(id, {
      onSuccess() {
        toast.success(`Запис з Id  ${id} видалено!`);
        void refetch();
      },
      onError(error) {
        toast.error("Запис не видалено!");
        console.log(error);
      },
    });
  }

  return (
    <>
      <BackGround>
        <NavBar></NavBar>
        {!isFetched ? (
          <Spinner></Spinner>
        ) : (
          <div className="m-auto mt-12 w-5/6 pt-28">
            <SearchComponent
              data={employees}
              filteredData={filter}
              setFilterState={setFilter}
              cycleKey={cycleKey}
            />
            <table className="w-full table-auto border-collapse">
              <thead>
                <CustomTr
                  columnNames={columnNames}
                  onSort={(key, isAscending) =>
                    handleSort(key, isAscending, filter, setFilter)
                  }
                ></CustomTr>
              </thead>
              <tbody className="">
                {filter?.map((value) => (
                  <tr key={value.id} className="text-white">
                    <td
                      key={value.id}
                      className="border border-blue-400 px-4 py-2"
                    >
                      {value.id}
                    </td>
                    <td className="border border-blue-400 px-4 py-2">
                      <InputForTable
                        onChange={handleInputChange}
                        title="first_name"
                        defaultValue={value.first_name}
                        edit={editIndex === value.id}
                      />
                    </td>
                    <td className="border border-blue-400 px-4 py-2">
                      <InputForTable
                        onChange={handleInputChange}
                        title="last_name"
                        defaultValue={value.last_name}
                        edit={editIndex === value.id}
                      />
                    </td>
                    <td className="border border-blue-400 px-4 py-2">
                      <InputForTable
                        onChange={handleInputChange}
                        title="email"
                        type="email"
                        defaultValue={value.email}
                        edit={editIndex === value.id}
                      />
                    </td>

                    <td className="border border-blue-400 px-4 py-2">
                      <InputForTable
                        onChange={handleInputChange}
                        title="phone"
                        type="tel"
                        defaultValue={value.phone}
                        edit={editIndex === value.id}
                      />
                    </td>
                    <td className="border border-blue-400 px-4 py-2">
                      <InputForTable
                        onChange={handleInputChange}
                        title="hire_date"
                        type="date"
                        defaultValue={value.hire_date
                          .toISOString()
                          .slice(0, 10)}
                        edit={editIndex === value.id}
                      />
                    </td>
                    <td className="border border-blue-400 px-4 py-2">
                      <InputForTable
                        onChange={handleInputChange}
                        title="salary"
                        type="number"
                        defaultValue={value.salary.toString()}
                        edit={editIndex === value.id}
                      />
                    </td>
                    <td className="border border-blue-400 px-4 py-2">
                      <InputForTable
                        onChange={handleInputChange}
                        title="job_title"
                        defaultValue={value.job_title}
                        edit={editIndex === value.id}
                      />
                    </td>
                    <td className="border border-blue-400 px-4 py-2">
                      <InputForTable
                        onChange={handleInputChange}
                        title="department_id"
                        defaultValue={value.department_id.toString()}
                        edit={editIndex === value.id}
                      />
                    </td>
                    <td className="border border-blue-400 px-4 py-2 ">
                      <EditButton
                        handleSubmit={handleSubmit}
                        setId={() => {
                          setEmployer({
                            ...value,
                          });
                          setEditIndex(value.id ?? -1);
                        }}
                        handleCancel={() => setEditIndex(-1)}
                      />
                    </td>
                    <td className="border border-blue-400 px-4 py-2">
                      <DialogBox
                        buttonName="Видалити"
                        text="Працівника буде видалено!"
                        title="Видалити Працівника?"
                        onAccept={() => handleDeleteEmployee(value.id)}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </BackGround>
    </>
  );
};
export default EmployeePage;
