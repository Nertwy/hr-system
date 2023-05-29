import { Transition } from "@headlessui/react";
import { type Review } from "@prisma/client";
import { type NextPage } from "next";
import { useState, useEffect, Fragment } from "react";
import { toast } from "react-toastify";
import DialogBox from "~/components/DialogBox";
import NavBar from "~/components/NavBar";
import {
  BackGround,
  CustomTr,
  EditButton,
  InputForTable,
  SearchComponent,
} from "~/components/SmallComponents";
import { createKeyCycler, handleChange, handleSort } from "~/hooks/hooks";
import { api } from "~/utils/api";
const cycleKey = createKeyCycler<Review>({
  id: -1,
  employeeId: -1,
  reviewDate: new Date(),
  reviewerId: -1,
  reviewNotes: "",
  reviewRating: -1,
});
const columnNames: { name: keyof Review; value: string }[] = [
  {
    name: "id",
    value: "ID",
  },
  {
    name: "reviewDate",
    value: "Дата огляду",
  },
  {
    name: "employeeId",
    value: "Код працівника",
  },
  {
    name: "reviewNotes",
    value: "Нотатки",
  },
  {
    name: "reviewRating",
    value: "Рейтинг",
  },
  {
    name: "reviewerId",
    value: "Код оглядача",
  },
];
const ReviewTable: NextPage = () => {
  const [editIndex, setEditIndex] = useState(-1);
  const [deletedRow, setDeletedRow] = useState<number | null>(null);
  const { data, isFetched, refetch } = api.CRUD.getAllReview.useQuery();
  const changeReview = api.CRUD.changeReview.useMutation();
  const deleteReview = api.CRUD.deleteReview.useMutation();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [filter, setFilter] = useState<Review[]>([]);
  useEffect(() => {
    setReviews(data ?? []);
    setFilter(data ?? []);
  }, [isFetched]);
  const handleSubmit = () => {
    const rev = reviews.find((val) => val.id === editIndex);
    if (!rev) return;
    console.log(rev);

    changeReview.mutate(rev, {
      onSuccess() {
        toast.success("Запис змінено!");
      },
      onError() {
        toast.error("Сталася помилка!");
      },
    });
  };
  const handleDeleteEmployee = (id: number) => {
    deleteReview.mutate(id, {
      onSuccess() {
        toast.success(`Запис з Id  ${id} видалено!`);
        void refetch();
      },
      onError(error) {
        toast.error("Запис не видалено!");
        console.log(error);
      },
    });
  };
  return (
    <>
      <BackGround>
        <NavBar></NavBar>
        <div>
          <SearchComponent
            data={reviews}
            filteredData={filter}
            setFilterState={setFilter}
            cycleKey={cycleKey}
          />

          <table>
            <thead>
              <CustomTr
                columnNames={columnNames}
                onSort={(key, isAscending) =>
                  handleSort(key, isAscending, filter, setFilter)
                }
              />
            </thead>
            <tbody>
              {filter.map((elem) => (
                <Fragment key={elem.id}>
                  <Transition
                    as="tr"
                    className="rounded-xl text-white"
                    show={deletedRow !== elem.id}
                    enter="transition-opacity duration-75"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="transition-opacity duration-150"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                    onTransitionEnd={() =>
                      setFilter(filter?.filter((v) => v.id !== deletedRow))
                    }
                  >
                    <td className="border border-blue-400 px-4 py-2">
                      {elem.id}
                    </td>
                    <td className="border border-blue-400 px-4 py-2">
                      <InputForTable
                        edit={editIndex === elem.id}
                        name="reviewDate"
                        title="reviewDate"
                        type="date"
                        defaultValue={
                          elem.reviewDate instanceof Date
                            ? elem.reviewDate.toISOString().slice(0, 10)
                            : elem.reviewDate
                        }
                        onChangeNew={(e) =>
                          handleChange(e, setReviews, editIndex)
                        }
                      />
                    </td>
                    <td className="border border-blue-400 px-4 py-2">
                      <InputForTable
                        title="employeeId"
                        edit={editIndex === elem.id}
                        name="employeeId"
                        type="number"
                        // defaultValue={data?.find(val=> val.employeeId === elem.employeeId)?.}
                        defaultValue={elem.employeeId.toString()}
                        onChangeNew={(e) =>
                          handleChange(e, setReviews, editIndex)
                        }
                      />
                    </td>
                    <td className="border border-blue-400 px-4 py-2">
                      <InputForTable
                        edit={editIndex === elem.id}
                        name="reviewNotes"
                        defaultValue={elem.reviewNotes}
                        onChangeNew={(e) =>
                          handleChange(e, setReviews, editIndex)
                        }
                      />
                    </td>
                    <td className="border border-blue-400 px-4 py-2">
                      <InputForTable
                        edit={editIndex === elem.id}
                        type="number"
                        name="reviewRating"
                        defaultValue={elem.reviewRating.toString()}
                        onChangeNew={(e) =>
                          handleChange(e, setReviews, editIndex)
                        }
                      />
                    </td>
                    <td className="border border-blue-400 px-4 py-2">
                      <InputForTable
                        edit={editIndex === elem.id}
                        type="number"
                        name="reviewerId"
                        defaultValue={elem.reviewerId.toString()}
                        onChangeNew={(e) =>
                          handleChange(e, setReviews, editIndex)
                        }
                      />
                    </td>
                    <td className="border border-blue-400 px-4 py-2 ">
                      <EditButton
                        handleSubmit={handleSubmit}
                        setId={() => setEditIndex(elem.id ?? -1)}
                        handleCancel={() => setEditIndex(-1)}
                      />
                    </td>
                    <td className="border border-blue-400 px-4 py-2">
                      <DialogBox
                        buttonName="Видалити"
                        text="Працівника буде видалено!"
                        title="Видалити Працівника?"
                        onAccept={() => handleDeleteEmployee(elem.id)}
                      />
                    </td>
                  </Transition>
                </Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </BackGround>
    </>
  );
};
export default ReviewTable;
