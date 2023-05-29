import { useState, type FC, type FormEvent } from "react";
import { toast } from "react-toastify";
import ComboBoxAuto from "~/components/ComboBoxAutoComp";
import Spinner from "~/components/Spinner";
import { useOnChange } from "~/hooks/hooks";
import { api } from "~/utils/api";
import { type Candidate } from "~/interface";
const AddCandidateForm: FC = ({}) => {
  const addCandidateMutation = api.example.candidateCreate.useMutation();
  const email = useOnChange("");
  const first_name = useOnChange("");
  const last_name = useOnChange("");
  const phone = useOnChange("");
  const date = useOnChange("");
  const [vacancyId, setVacancyId] = useState<number | null>(null);
  const { data, isLoading } = api.example.getAllVacancies.useQuery();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const Candidate: Candidate = {
      email: email.value,
      first_name: first_name.value,
      application_date: new Date(date.value),
      last_name: last_name.value,
      phone: phone.value,
      vacancyId: vacancyId,
    };

    addCandidateMutation.mutate(
      {
        ...Candidate,
        status: "",
        vacancyId: vacancyId ?? undefined,
      },
      {
        onError: () => {
          toast.error("Запис не створено!", {
            position: "bottom-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
          });
        },
        onSuccess: () => {
          toast.success("Запис створено!", {
            position: "bottom-right",
            autoClose: 5000,
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
    <div className="flex flex-col items-center">
      <h1 className=" text-white text-3xl opacity-70">Додати кандидата</h1>

      <form
        className="rounded-md bg-black bg-opacity-70 p-8"
        onSubmit={handleSubmit}
      >
        <div className="group relative z-0 mb-6 w-full opacity-100">
          <input
            onChange={email.onChange}
            type="email"
            name="floating_email"
            id="floating_email"
            className="peer block w-full appearance-none border-0 border-b-2 border-gray-100 bg-transparent px-0 py-2.5 text-sm text-gray-900 focus:border-red-600 focus:outline-none focus:ring-0 dark:border-gray-600 dark:text-white dark:focus:border-red-500"
            placeholder=""
            required
          />
          <label
            htmlFor="floating_email"
            className={`peer-focus:red-red-600 absolute top-3 -z-10 
            origin-[0] -translate-y-6 scale-75 transform text-sm 
            text-gray-500 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 
            peer-focus:left-0 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:font-medium 
            dark:text-gray-400 peer-focus:dark:text-red-500`}
          >
            Пошта
          </label>
        </div>
        <div className="grid md:grid-cols-2 md:gap-6">
          <div className="group relative z-0 mb-6 w-full">
            <input
              onChange={first_name.onChange}
              type="text"
              name="floating_first_name"
              id="floating_first_name"
              className="peer block w-full appearance-none border-0 border-b-2 border-gray-300 bg-transparent px-0 py-2.5 text-sm text-gray-900 focus:border-red-600 focus:outline-none focus:ring-0 dark:border-gray-600 dark:text-white dark:focus:border-red-500"
              placeholder=" "
              required
            />
            <label
              htmlFor="floating_first_name"
              className="absolute top-3 -z-10 origin-[0] -translate-y-6 scale-75 transform text-sm text-gray-500 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:left-0 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:font-medium peer-focus:text-red-600 dark:text-gray-400 peer-focus:dark:text-red-500"
            >
              Ім&apos;я
            </label>
          </div>
          <div className="group relative z-0 mb-6 w-full">
            <input
              onChange={last_name.onChange}
              type="text"
              name="floating_last_name"
              id="floating_last_name"
              className="peer block w-full appearance-none border-0 border-b-2 border-gray-300 bg-transparent px-0 py-2.5 text-sm text-gray-900 focus:border-red-600 focus:outline-none focus:ring-0 dark:border-gray-600 dark:text-white dark:focus:border-red-500"
              placeholder=" "
              required
            />
            <label
              htmlFor="floating_last_name"
              className="absolute top-3 -z-10 origin-[0] -translate-y-6 scale-75 transform text-sm text-gray-500 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:left-0 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:font-medium peer-focus:text-red-600 dark:text-gray-400 peer-focus:dark:text-red-500"
            >
              Прізвище
            </label>
          </div>
        </div>
        <div className="grid md:grid-cols-2 md:gap-6">
          <div className="group relative z-0 mb-6 w-full">
            <input
              onChange={phone.onChange}
              type="tel"
              pattern="[+]{1}[0-9]{3}[0-9]{2}[0-9]{3}[0-9]{2}[0-9]{2}"
              name="floating_phone"
              id="floating_phone"
              className="peer block w-full appearance-none border-0 border-b-2 border-gray-300 bg-transparent px-0 py-2.5 text-sm text-gray-900 focus:border-red-600 focus:outline-none focus:ring-0 dark:border-gray-600 dark:text-white dark:focus:border-red-500"
              placeholder=" "
              required
            />
            <label
              htmlFor="floating_phone"
              className="absolute top-3 -z-10 origin-[0] -translate-y-6 scale-75 transform text-sm text-gray-500 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:left-0 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:font-medium peer-focus:text-red-600 dark:text-gray-400 peer-focus:dark:text-red-500"
            >
              Номер телефону
            </label>
          </div>
          <div className="group relative z-0 mb-6 w-full">
            <input
              onChange={date.onChange}
              type="date"
              pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"
              name="floating_phone"
              id="floating_phone"
              className="peer block w-full appearance-none border-0 border-b-2 border-gray-300 bg-transparent px-0 py-2.5 text-sm text-gray-900 focus:border-red-600 focus:outline-none focus:ring-0 dark:border-gray-600 dark:text-white dark:focus:border-red-500"
              placeholder=" "
              required
            />
            <label
              htmlFor="floating_date"
              className="absolute top-3 -z-10 origin-[0] -translate-y-6 scale-75 transform text-sm text-gray-500 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:left-0 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:font-medium peer-focus:text-red-600 dark:text-gray-400 peer-focus:dark:text-red-500"
            >
              Дата Подачі
            </label>
          </div>
        </div>
        <div className="group relative z-0 mb-6 w-full object-center">
          {isLoading ? (
            <Spinner color="fill-blue-900" />
          ) : (
            <ComboBoxAuto callback={setVacancyId} data={data ?? null} />
          )}
        </div>
        <button
          type="submit"
          className="float-right w-full rounded-lg bg-red-700 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-red-800 focus:outline-none focus:ring-4 focus:ring-red-300 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800 sm:w-auto"
        >
          Створити запис
        </button>
      </form>
    </div>
  );
};

export default AddCandidateForm;
