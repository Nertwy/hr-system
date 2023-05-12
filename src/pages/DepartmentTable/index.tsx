import { Transition } from "@headlessui/react";
import { type Department } from "@prisma/client";
import { type NextPage } from "next";
import { useState, type FC, useEffect, Fragment } from "react";
import { toast } from "react-toastify";
import DialogBox from "~/components/DialogBox";
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
import { createKeyCycler } from "~/hooks/hooks";
import { api } from "~/utils/api";
const cycleKey = createKeyCycler<Department>({
  id: -1,
  name: "",
});

const DepartmentPage: NextPage = () => {
  return (
    <BackGround>
      <NavBar></NavBar>
      <DepartmentTable />
    </BackGround>
  );
};
export default DepartmentPage;

type DepartmentKey = keyof Department;

const DepartmentTable: FC = () => {
  const DepartmentNames: { name: keyof Department; value: string }[] = [
    { name: "id", value: "Ідентифікатор" },
    { name: "name", value: "Назва департаменту" },
  ];
  const [editIndex, setEditIndex] = useState(-1);
  const { data, isLoading } = api.CRUD.getAllDepartment.useQuery();
  const [departments, setDepartments] = useState<Department[]>(data ?? []);
  const [filter, setFilter] = useState<Department[]>([]);
  const [deletedRow, setDeletedRow] = useState<number | null>(null);
  const deleteDepartment = api.CRUD.deleteDepartmnet.useMutation();
  const changeDepartment = api.CRUD.changeDepartment.useMutation();
  const handleDeleteQuery = (id: number) => {
    deleteDepartment.mutate(id, {
      onError(error) {
        toast.error("Сталася помилка!");
        console.log(error);
      },
      onSuccess() {
        toast.success(`Запис з id ${id} видалено успішно!`);
      },
    });
  };
  useEffect(() => {
    setFilter(data ?? []);
    setDepartments(data ?? []);
  }, [isLoading]);
  const handleSort = (key: DepartmentKey, isAscending: SortState) => {
    const sortedArr = sortFunction(key, isAscending);
    const a = sortedArr(departments);
    setDepartments([...a]);
  };
  const handleSubmitChange = () => {
    const department: Department = departments.find(
      (val) => val.id === editIndex
    ) ?? {
      id: -1,
      name: "",
    };
    changeDepartment.mutate(department, {
      onError(error) {
        toast.error("Виникла помилка" + error.message);
        console.log(error);
      },
      onSuccess() {
        toast.success("Запис змінено успішно!");
      },
    });
  };
  const handleInputChange = (name: string, value: string) => {
    setDepartments((prevState) => {
      const updatedVacancies: Department[] = prevState?.map((department) => {
        if (editIndex === department.id) {
          return {
            ...department,
            [name]: value,
          };
        }
        return department;
      });
      return updatedVacancies;
    });
  };
  const sortFunction =
    <T extends keyof Department>(key: T, isAscending: SortState) =>
    (array: Department[]): Department[] => {
      return [...array].sort((a, b) => {
        const valueA = a[key];
        const valueB = b[key];

        if (typeof valueA === "number" && typeof valueB === "number") {
          return isAscending === "ascending"
            ? valueA - valueB
            : valueB - valueA;
        }

        if (typeof valueA === "string" && typeof valueB === "string") {
          return isAscending === "ascending"
            ? valueA.localeCompare(valueB)
            : valueB.localeCompare(valueA);
        }

        if (valueA instanceof Date && valueB instanceof Date) {
          const timeA = valueA.getTime();
          const timeB = valueB.getTime();
          return isAscending === "ascending" ? timeA - timeB : timeB - timeA;
        }
        return 0;
      });
    };
  if (isLoading) {
    return <Spinner />;
  }
  return (
    <div className="m-auto mt-12 w-1/5 pt-28">
      <SearchComponent
        data={departments}
        filteredData={filter}
        setFilterState={setFilter}
        cycleKey={cycleKey}
      />
      <table>
        <thead>
          <CustomTr columnNames={DepartmentNames} onSort={handleSort} />
        </thead>
        <tbody className="rounded-xl">
          {filter.map((department) => (
            <Fragment key={department.id}>
              <Transition
                as="tr"
                className="rounded-xl text-white"
                show={deletedRow !== department.id}
                enter="transition-opacity duration-75"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="transition-opacity duration-150"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
                onTransitionEnd={() =>
                  setDepartments(
                    departments?.filter((v) => v.id !== deletedRow)
                  )
                }
              >
                <td className="border border-blue-400 px-4 py-2">
                  {department.id}
                </td>
                <td className="border border-blue-400 px-4 py-2">
                  <InputForTable
                    onChange={handleInputChange}
                    title="name"
                    defaultValue={department.name}
                    edit={editIndex === department.id}
                  />
                </td>
                <td className="border border-blue-400 px-4 py-2">
                  <EditButton
                    setId={() => {
                      setEditIndex(department.id ?? -1);
                    }}
                    handleCancel={() => setEditIndex(-1)}
                    handleSubmit={handleSubmitChange}
                  />
                </td>
                <td className="border border-blue-400 px-4 py-2">
                  <DialogBox
                    buttonName="Видалити"
                    text="Усі Працівники цього департаменту будуть видалені!"
                    title="Видалити Департамент?"
                    onAccept={() => {
                      setDeletedRow(department.id ?? -1);
                      handleDeleteQuery(department.id ?? -1);
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
