import { type Employee } from "@prisma/client";
import { type NextPage } from "next";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import React, { useState, useEffect, type FC } from "react";
import { toast } from "react-toastify";
import NavBar from "~/components/NavBar";
import {
  BackGround,
  CustomInput,
  DropBox,
  SubmitButton,
} from "~/components/SmallComponents";
import Spinner from "~/components/Spinner";
import { api } from "~/utils/api";

const EmployeForm: NextPage = () => {
  const router = useRouter();
  const { data, status } = useSession();
  if (!data && status !== "loading") {
    void router.push("/api/auth/signin");
    return null;
  }
  return (
    <>
      <BackGround>
        <NavBar />
        <MainForm></MainForm>
      </BackGround>
    </>
  );
};
type UserEmployee = Omit<Employee, "id"> & { id?: number };
const MainForm: FC = () => {
  const { data, isFetched } = api.CRUD.getAllDepartment.useQuery();
  const [selectedId, setSelectedId] = useState<{
    id: number;
    name: string;
  } | null>(null);
  const [employee, setEmployee] = useState<UserEmployee>({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    hire_date: new Date(),
    salary: -1,
    job_title: "",
    department_id: -1,
  });
  const createEmployee = api.CRUD.postEmployee.useMutation();
  useEffect(() => {
    setEmployee((prevState) => ({
      ...prevState,
      department_id: selectedId?.id ?? -2,
    }));
  }, [selectedId]);
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    createEmployee.mutate(employee, {
      onSuccess: () => {
        toast.success(
          `Працівник з фамілією ${employee.last_name} створений успішно!`,
          {
            position: "bottom-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
          }
        );
      },
      onError: () => {
        toast.error("Сталася помилка!");
      },
    });
  };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.currentTarget;
    setEmployee((prevEmployee) => ({
      ...prevEmployee,
      [name]:
        name === "salary"
          ? Number(value)
          : name === "hire_date"
          ? new Date(value)
          : name === "department_id"
          ? Number(value)
          : value,
    }));
  };
  let names: string[] = [];
  if (isFetched) {
    names = data?.map((value) => value.name) ?? [];
  }
  return (
    <>
      <div className="flex h-4/5 w-2/3 flex-col items-center justify-center rounded-3xl bg-slate-800 bg-opacity-20">
        <h1 className="top animate-pulse pb-32 align-top font-serif text-4xl text-white">
          Додати працівника
        </h1>

        <form
          className="flex w-1/3 flex-col content-evenly space-y-3"
          onSubmit={(e) => handleSubmit(e)}
        >
          <CustomInput
            name="first_name"
            text="Ім'я"
            onChange={(e) => handleChange(e)}
          />
          <CustomInput
            name="last_name"
            text="Прізвище"
            onChange={(e) => handleChange(e)}
          />
          <CustomInput
            name="email"
            text="Пошта"
            type="email"
            onChange={(e) => handleChange(e)}
          />
          <CustomInput
            name="phone"
            text="Телефон"
            type="tel"
            onChange={(e) => handleChange(e)}
          />
          <CustomInput
            name="hire_date"
            text="Дата взяття на роботу"
            type="date"
            onChange={(e) => handleChange(e)}
          />
          <CustomInput
            name="salary"
            text="Зарплат у грн"
            type="number"
            onChange={(e) => handleChange(e)}
          />
          {isFetched ? (
            <div>
              <label></label>
              <DropBox
                data={data ?? []}
                names={names}
                callback={setSelectedId}
              />
            </div>
          ) : (
            <Spinner />
          )}
          <SubmitButton></SubmitButton>
        </form>
      </div>
    </>
  );
};
export default EmployeForm;
