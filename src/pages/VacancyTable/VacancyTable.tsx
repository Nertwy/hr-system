import { Transition } from "@headlessui/react";
import { useState, type FC, useEffect, Fragment } from "react";
import { toast } from "react-toastify";
import DialogBox from "~/components/DialogBox";
import NavBar from "~/components/NavBar";
import Spinner from "~/components/Spinner";
import { Vacancy } from "~/interface";
import { api } from "~/utils/api";

const VacancyTable: FC = () => {
  const [deletedRow, setDeletedRow] = useState<number | null>(null);
  const { data, isLoading, isFetched } = api.CRUD.getAllVacancies.useQuery();
  const [vacancies, setVacancies] = useState<Vacancy[] | undefined>(data);
  const deleteVacancy = api.CRUD.deleteVacancy.useMutation();
  useEffect(() => {
    setVacancies(data);
  }, [isFetched]);
  const handleDeleteQuery = (vacancyId: number) => {
    deleteVacancy.mutate(vacancyId, {
      onSuccess(data) {
        // setDeletedRow(data.id);
        // setVacancies(vacancies?.filter((vacancy) => vacancy.id !== vacancyId));
        toast.success(`Запис з Id  ${data.id} видалено!`);
      },
      onError(error) {
        toast.error("Запис не видалено!");
        console.log(error);
      },
    });
  };
  if (isLoading) {
    // setVacancies(null);
    return <Spinner />;
  }
  return (
      <div className="m-auto mt-12 w-5/6">
        <table className="w-full table-auto border-collapse">
          <thead>
            <tr>
              <th className="px-4 py-2">ID</th>
              <th className="px-4 py-2">Title</th>
              <th className="px-4 py-2">Department</th>
              <th className="px-4 py-2">Posting Date</th>
              <th className="px-4 py-2">Closing Date</th>
              <th className="px-4 py-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {vacancies?.map((vacancy) => (
              <Fragment key={vacancy.id}>
                <Transition
                  as="tr"
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
                  <td className="border px-4 py-2">{vacancy.id}</td>
                  <td className="border px-4 py-2">{vacancy.title}</td>
                  <td className="border px-4 py-2">{vacancy.department}</td>
                  <td className="border px-4 py-2">
                    {vacancy.posting_date.toDateString()}
                  </td>
                  <td className="border px-4 py-2">
                    {vacancy.closing_date.toDateString()}
                  </td>
                  <td className="border px-4 py-2">{vacancy.status}</td>
                  <td className="border px-4 py-2">
                    <a className="cursor-pointer text-blue-600 hover:underline">
                      Edit
                    </a>
                  </td>
                  <td className="border px-4 py-2">
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
