import { type NextPage } from "next";
import ComboBoxAuto from "~/components/ComboBoxAutoComp";
import NavBar from "~/components/NavBar";
import {
  BackGround,
  CustomInput,
  SubmitButton,
} from "~/components/SmallComponents";
import { api } from "~/utils/api";
import { Fragment, useEffect, useState } from "react";
import { Employee } from "@prisma/client";
import Spinner from "~/components/Spinner";
import { Listbox, Transition } from "@headlessui/react";
import { CheckIcon } from "@heroicons/react/20/solid";
import { toast } from "react-toastify";
const ReviewPage: NextPage = () => {
  const postReview = api.CRUD.postReview.useMutation();
  const { data, isFetched } = api.CRUD.getAllEmployees.useQuery();
  const [employee, setEmployee] = useState<Employee[]>(data ?? []);
  const [reviewer, setReviewer] = useState<Employee | null>(null);
  const [rating, setRating] = useState<number>(0);
  const [notes, setNotes] = useState<string>("");
  const [employer, setEmployer] = useState<Employee | null>(null);
  useEffect(() => {
    setEmployee(data ?? []);
  }, [isFetched]);
  let names: string[] = [];
  if (isFetched) {
    names = data?.map((value) => value.last_name) ?? [];
  }
  if (!isFetched) {
    return <Spinner />;
  }
  const handleEmployeeChange = (selected: Employee | null) => {
    setEmployer(selected);
  };
  const handleReviewerCange = (selected: Employee | null) => {
    setReviewer(selected);
  };
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    postReview.mutate(
      {
        employeeId: employer?.id ?? -1,
        reviewDate: new Date(),
        reviewerId: reviewer?.id ?? -1,
        reviewNotes: notes,
        reviewRating: rating,
      },
      {
        onError(error) {
          toast.error("Сталася помилка");
          console.log(error);
        },
        onSuccess() {
          toast.success("Запис створено!");
        },
      }
    );
  };
  return (
    <BackGround>
      <NavBar />
      <form
        className="h-2/5 w-1/6 rounded-lg bg-black bg-opacity-40 p-5 py-6"
        onSubmit={handleSubmit}
      >
        <CustomInput
          onChange={(e) => {
            setRating(parseInt(e.currentTarget.value));
          }}
          name={"reviewRating"}
          text={"Рейтинг"}
          type="number"
        ></CustomInput>
        <CustomInput
          name={"reviewNotes"}
          text={"Нотатки"}
          onChange={(e) => setNotes(e.currentTarget.value)}
        />
        <label className="text-white">Оберіть працівника</label>
        <div className="relative z-10 mb-4">
          <DropBox<Employee>
            data={employee}
            onChange={handleEmployeeChange}
            selected={employer}
          />
        </div>
        <label className="text-white">Оберіть оглядача</label>
        <DropBox<Employee>
          data={employee}
          onChange={handleReviewerCange}
          selected={reviewer}
        />
        <SubmitButton />
      </form>
    </BackGround>
  );
};

export default ReviewPage;

type DropBoxProps<T> = {
  data: T[];
  selected: T | null;
  onChange: (selected: T | null) => void;
};

const DropBox = <
  T extends { id: number; first_name: string; last_name: string }
>({
  data,
  selected,
  onChange,
}: DropBoxProps<T>) => {
  return (
    <Listbox value={selected} onChange={onChange}>
      <div className="relative">
        <Listbox.Button className="w-full cursor-default rounded-md bg-white py-2 pl-3 pr-10 text-left shadow-md focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm">
          <span className="block truncate">
            {selected
              ? `${selected.first_name} ${selected.last_name}`
              : "Оберіть працівника"}
          </span>
          <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
            <CheckIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
          </span>
        </Listbox.Button>
        <Transition
          as={Fragment}
          enter="transition duration-100 ease-out"
          enterFrom="transform scale-95 opacity-0"
          enterTo="transform scale-100 opacity-100"
          leave="transition duration-75 ease-out"
          leaveFrom="transform scale-100 opacity-100"
          leaveTo="transform scale-95 opacity-0"
        >
          <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
            {data.map((employee) => (
              <Listbox.Option
                key={employee.id}
                value={employee}
                className={({ active }) =>
                  `${
                    active ? "bg-blue-100 text-blue-900" : "text-gray-900"
                  } relative cursor-default select-none py-2 pl-10 pr-4`
                }
              >
                {({ selected, active }) => (
                  <>
                    <span
                      className={`${
                        selected ? "font-medium" : "font-normal"
                      } block truncate`}
                    >
                      {`${employee.first_name} ${employee.last_name}`}
                    </span>
                    {selected && (
                      <span
                        className={`${
                          active ? "text-blue-600" : "text-blue-600"
                        } absolute inset-y-0 left-0 flex items-center pl-3`}
                      >
                        <CheckIcon className="h-5 w-5" aria-hidden="true" />
                      </span>
                    )}
                  </>
                )}
              </Listbox.Option>
            ))}
          </Listbox.Options>
        </Transition>
      </div>
    </Listbox>
  );
};
