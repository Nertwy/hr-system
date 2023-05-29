import React, { useState, type FC, type FormEvent } from "react";
import { toast } from "react-toastify";
import { SubmitButton } from "~/components/SmallComponents";
import { type Vacancy } from "~/interface";
import { api } from "~/utils/api";

const VacancyForm: FC = () => {
  const [vacancy, setVacancy] = useState<Vacancy>({
    title: "",
    department: "",
    description: "",
    requirements: "",
    posting_date: new Date(),
    closing_date: new Date(),
    status: "",
  });
  const vacancyMutation = api.CRUD.createVacancy.useMutation();
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    vacancyMutation.mutate(
      { ...vacancy },
      {
        onSuccess: () => {
          toast.success("Вакансію створено!", {
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
      }
    );
  };
  return (
    <div className="w-1/2 flex-col items-center">
      <h1 className="mt-6 pb-4 text-center font-serif text-4xl font-bold italic text-gray-300">
        Створити вакансію
      </h1>
      <form
        className="mx-auto w-2/4 max-w-lg overflow-auto rounded-md bg-black bg-opacity-50 px-16 py-8"
        onSubmit={handleSubmit}
      >
        <div className="mb-6">
          <label htmlFor="title" className="mb-2 block font-bold text-white">
            Заголовок
          </label>
          <input
            type="text"
            name="title"
            value={vacancy.title}
            onChange={(e) => {
              setVacancy({
                ...vacancy,
                title: e.currentTarget.value,
              });
            }}
            className="focus:shadow-outline w-full appearance-none rounded border px-3 py-2 leading-tight text-black
 shadow focus:outline-none"
            required
          />
        </div>
        <div className="mb-6">
          <label
            htmlFor="department"
            className="mb-2 block font-bold text-white
"
          >
            Департамент
          </label>
          <input
            type="text"
            name="department"
            value={vacancy.department}
            onChange={(e) => {
              setVacancy({
                ...vacancy,
                department: e.currentTarget.value,
              });
            }}
            className="focus:shadow-outline w-full appearance-none rounded border px-3 py-2 leading-tight text-black
 shadow focus:outline-none"
          />
        </div>
        <div className="mb-6">
          <label
            htmlFor="description"
            className="mb-2 block font-bold text-white
"
          >
            Опис
          </label>
          <textarea
            name="description"
            value={vacancy.description}
            onChange={(e) => {
              setVacancy({
                ...vacancy,
                description: e.currentTarget.value,
              });
            }}
            className="focus:shadow-outline w-full appearance-none rounded border px-3 py-2 leading-tight text-black
 shadow focus:outline-none"
          />
        </div>
        <div className="mb-6">
          <label
            htmlFor="requirements"
            className="mb-2 block font-bold text-white
"
          >
            Вимоги
          </label>
          <textarea
            name="requirements"
            value={vacancy.requirements}
            onChange={(e) => {
              setVacancy({
                ...vacancy,
                requirements: e.currentTarget.value,
              });
            }}
            className="focus:shadow-outline w-full appearance-none rounded border px-3 py-2 leading-tight text-black
 shadow focus:outline-none"
          />
        </div>
        <div className="mb-6">
          <label
            htmlFor="posting_date"
            className="mb-2 block font-bold text-white
"
          >
            День відкриття
          </label>
          <input
            type="date"
            name="posting_date"
            value={vacancy.posting_date.toISOString().slice(0, 10)}
            onChange={(e) => {
              const date = new Date(e.currentTarget.value);
              setVacancy({
                ...vacancy,
                posting_date: date,
              });
            }}
            required
            className="focus:shadow-outline w-full appearance-none rounded border px-3 py-2 leading-tight text-black
 shadow focus:outline-none"
          />
        </div>
        <div className="mb-6">
          <label
            htmlFor="closing_date"
            className="mb-2 block font-bold text-white
"
          >
            День закриття
          </label>
          <input
            required
            type="date"
            name="closing_date"
            value={vacancy.closing_date.toISOString().slice(0, 10)}
            onChange={(e) => {
              setVacancy({
                ...vacancy,
                closing_date: new Date(e.currentTarget.value),
              });
            }}
            className="focus:shadow-outline w-full appearance-none rounded border px-3 py-2 leading-tight text-black
 shadow focus:outline-none"
          />
        </div>
        <div className="mb-6">
          <label
            htmlFor="status"
            className="mb-2 block font-bold text-white
"
          >
            Cтатус
          </label>
          <input
            required
            name="status"
            value={vacancy.status}
            onChange={(e) => {
              setVacancy({
                ...vacancy,
                status: e.currentTarget.value,
              });
            }}
            className="focus:shadow-outline w-full appearance-none rounded border px-3 py-2 leading-tight text-black
 shadow focus:outline-none"
          />
        </div>
        <SubmitButton />
      </form>
    </div>
  );
};
export default VacancyForm;
