import { type Department } from "@prisma/client";
import { type NextPage } from "next";
import { type FormEvent, useState } from "react";
import { toast } from "react-toastify";
import NavBar from "~/components/NavBar";
import {
  BackGround,
  CustomInput,
  SubmitButton,
} from "~/components/SmallComponents";
import { api } from "~/utils/api";

const DepartmentPage: NextPage = () => {
  const postDepartment = api.CRUD.postDepartment.useMutation();
  const [department, setDepartment] = useState<Department>({
    id: -1,
    name: "",
  });
  const handleSubmit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    //Send data to server
    postDepartment.mutate(department.name, {
      onSuccess: ({ name }) => {
        toast.success(`Департамент з назвою ${name} створено успішно!`, {
          position: "bottom-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      },
      onError: () => {
        toast.success(`Сталася помилка при створенні!`, {
          position: "bottom-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      },
    });
  };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.currentTarget;
    setDepartment((prevDepartment) => ({
      ...prevDepartment,
      [name]: value,
    }));
  };
  return (
    <>
      <BackGround>
        <NavBar></NavBar>
        <div className="flex h-3/5 w-1/3 flex-col items-center justify-center rounded-3xl bg-slate-800 bg-opacity-20">
          <h1 className="top animate-pulse pb-32 align-top font-serif text-6xl text-white">
            Додати департамент
          </h1>
          <form
            onSubmit={(e) => handleSubmit(e)}
            className="flex w-1/3 flex-col content-evenly space-y-3"
          >
            <CustomInput 
              name="name"
              text="Назва департаменту"
              onChange={handleChange}
            />
            <SubmitButton></SubmitButton>
          </form>
        </div>
      </BackGround>
    </>
  );
};
export default DepartmentPage;
