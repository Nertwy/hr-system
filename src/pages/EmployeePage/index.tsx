import { type Employee } from "@prisma/client";
import { type NextPage } from "next";
import { useState, type FC } from "react";
import NavBar from "~/components/NavBar";
import { BackGround, CustomInput, SubmitButton } from "~/components/SmallComponents";

const EmployeForm: NextPage = () => {
  return (
    <>
      <BackGround>
        <NavBar />
        <MainForm></MainForm>
      </BackGround>
    </>
  );
};
const MainForm: FC = () => {
  const [employee, setEmployee] = useState<Employee>({
    id: -1,
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    hire_date: new Date(),
    salary: -1,
    job_title: "",
    department_id: -1,
  });
  const handleSubmit = () => {
    throw new Error("Handle submit not impl!");
  };
  const handleChange = () => {
    throw new Error("Handle change not impl!");
  };
  return (
    <>
      <div className="flex h-4/5 w-2/3 flex-col items-center justify-center rounded-3xl bg-slate-800 bg-opacity-20">
        <h1 className="top animate-pulse pb-32 align-top font-serif text-6xl text-white">
          Додати працівника
        </h1>

        <form className="flex w-1/3 flex-col content-evenly space-y-3">
          <CustomInput name="first_name" text="Ім'я" />
          <CustomInput name="last_name" text="Прізвище" />
          <CustomInput name="email" text="Пошта" type="email" />
          <CustomInput name="phone" text="Телефон" type="tel" />
          <CustomInput
            name="hire_date"
            text="Дата взяття на роботу"
            type="date"
          />
          <CustomInput name="salary" text="Зарплат у грн" type="number" />
          {/* <CustomInput name="salary" text="Зарплат у грн"  type="number"/> */}

          <SubmitButton></SubmitButton>
        </form>
      </div>
    </>
  );
};
export default EmployeForm;
