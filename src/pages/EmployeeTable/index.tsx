import { type NextPage } from "next";
import NavBar from "~/components/NavBar";
import {
  BackGround,
  CustomTr,
  EditButton,
  InputForTable,
  SearchComponent,
} from "~/components/SmallComponents";
import Spinner from "~/components/Spinner";
import { api } from "~/utils/api";
import { handleSort } from "~/hooks/hooks";
import DialogBox from "~/components/DialogBox";
import { useState, useEffect, type ChangeEvent } from "react";
import { type Department, type Employee } from "@prisma/client";
import { toast } from "react-toastify";
import { createKeyCycler } from "~/hooks/hooks";
import { type Option } from "~/components/SmallComponents";
import { handleChange } from "~/hooks/hooks";
import { Transition } from "@headlessui/react";
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
  const departmentOptions = api.CRUD.getAllDepartment.useQuery();
  const updateEmployee = api.CRUD.changeEmployee.useMutation();
  const deleteEmployee = api.CRUD.deleteEmployee.useMutation();
  const [employees, setEmployees] = useState<Employee[]>(data ?? []);
  const [filter, setFilter] = useState<Employee[]>([]);
  const [deletedRow, setDeletedRow] = useState<number | null>(null);
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
  const handleSubmitChange = (id: number) => {
    const newEmployee: Employee | undefined = employees.find(
      (val: Employee) => val.id === id
    );
    if (!newEmployee) return;
    updateEmployee.mutate(newEmployee, {
      onSuccess() {
        toast.success("Запис змінено!");
        void refetch();
      },
      onError() {
        toast.error("Сталася помилка!");
      },
    });
  };
  const [departmentOption, setDepartmentOption] = useState<Option<string>[]>(
    []
  );
  useEffect(() => {
    setEmployees(data ?? []);
    setFilter(data ?? []);
    setDepartmentOption(
      departmentOptions.data
        ? departmentOptions?.data.map((elem: Department) => ({
            id: elem.id,
            fieldName: elem.name,
          }))
        : []
    );
  }, [isSuccess, data, departmentOptions.isFetched]);
  if (isError) {
    return <div className="text-white">Error accured!</div>;
  }
  function handleDeleteEmployee(id: number) {
    deleteEmployee.mutate(id, {
      onSuccess() {
        toast.success(`Запис з Id  ${id} видалено!`);
        // void refetch();
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
                {filter?.map((value: Employee) => (
                  <Transition
                    key={value.id}
                    as="tr"
                    className="rounded-xl text-white"
                    show={deletedRow !== value.id}
                    enter="transition-opacity duration-75"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="transition-opacity duration-150"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                    onTransitionEnd={() =>
                      setEmployees(
                        employees?.filter((v) => v.id !== deletedRow)
                      )
                    }
                  >
                    <td
                      key={value.id}
                      className="border border-blue-400 px-4 py-2"
                    >
                      {value.id}
                    </td>
                    <td className="border border-blue-400 px-4 py-2">
                      <InputForTable
                        name="first_name"
                        onChangeNew={(e) =>
                          handleChange(e, setEmployees, editIndex)
                        }
                        // onChange={handleInputChange}
                        title="first_name"
                        type="text"
                        defaultValue={value.first_name}
                        edit={editIndex === value.id}
                      />
                    </td>
                    <td className="border border-blue-400 px-4 py-2">
                      <InputForTable
                        name="last_name"
                        onChangeNew={(e) =>
                          handleChange(e, setEmployees, editIndex)
                        }
                        // onChange={handleInputChange}
                        title="last_name"
                        defaultValue={value.last_name}
                        edit={editIndex === value.id}
                      />
                    </td>
                    <td className="border border-blue-400 px-4 py-2">
                      <InputForTable
                        name="email"
                        onChangeNew={(e) =>
                          handleChange(e, setEmployees, editIndex)
                        }
                        // onChange={handleInputChange}
                        title="email"
                        type="email"
                        defaultValue={value.email}
                        edit={editIndex === value.id}
                      />
                    </td>

                    <td className="border border-blue-400 px-4 py-2">
                      <InputForTable
                        name="phone"
                        onChangeNew={(e) =>
                          handleChange(e, setEmployees, editIndex)
                        }
                        // onChange={handleInputChange}
                        title="phone"
                        type="tel"
                        defaultValue={value.phone}
                        edit={editIndex === value.id}
                      />
                    </td>
                    <td className="border border-blue-400 px-4 py-2">
                      <InputForTable
                        name="hire_date"
                        onChangeNew={(e) =>
                          handleChange(e, setEmployees, editIndex)
                        }
                        // onChange={handleInputChange}
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
                        name="salary"
                        onChangeNew={(e) =>
                          handleChange(e, setEmployees, editIndex)
                        }
                        // onChange={handleInputChange}
                        title="salary"
                        type="number"
                        defaultValue={value.salary.toString()}
                        edit={editIndex === value.id}
                      />
                    </td>
                    <td className="border border-blue-400 px-4 py-2">
                      <InputForTable
                        name="job_title"
                        onChangeNew={(e) =>
                          handleChange(e, setEmployees, editIndex)
                        }
                        // onChange={handleInputChange}
                        title="job_title"
                        defaultValue={value.job_title}
                        edit={editIndex === value.id}
                      />
                    </td>
                    <td className="border border-blue-400 px-4 py-2">
                      <InputForTable
                        dataForDropBox={departmentOption}
                        type="dropbox"
                        onChangeNew={(e: ChangeEvent<HTMLInputElement>) =>
                          handleChange(e, setEmployees, editIndex)
                        }
                        name="department_id"
                        // onChange={handleInputChange}
                        title="department_id"
                        defaultValue={value.department_id}
                        edit={editIndex === value.id}
                      />
                    </td>
                    <td className="border border-blue-400 px-4 py-2 ">
                      <EditButton
                        setId={() => setEditIndex(value.id ?? -1)}
                        handleCancel={() => setEditIndex(-1)}
                        handleSubmit={() => handleSubmitChange(value.id)}
                      />
                    </td>
                    <td className="border border-blue-400 px-4 py-2">
                      <DialogBox
                        buttonName="Видалити"
                        text="Працівника буде видалено!"
                        title="Видалити Працівника?"
                        onAccept={() => {
                          setDeletedRow(value.id ?? -1);
                          handleDeleteEmployee(value.id ?? -1);
                        }}
                      />
                    </td>
                  </Transition>
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
