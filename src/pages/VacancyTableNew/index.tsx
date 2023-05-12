import { type Vacancy } from "@prisma/client";
import { type NextPage } from "next";
import React, { useState } from "react";
import { useTable, type Column, type CellProps, type Row } from "react-table";
import Spinner from "~/components/Spinner";
import { api } from "~/utils/api";
import { BackGround, EditButton, InputForTable } from "~/components/SmallComponents";
import DialogBox from "~/components/DialogBox";
import { toast } from "react-toastify";
import NavBar from "~/components/NavBar";
type Props = {
  data: Vacancy[];
};
const VacancyTableNew: NextPage<Props> = ({ data }) => {
  const [deletedRow, setDeletedRow] = useState<number | null>(null);
  const [editIndex, setEditIndex] = useState<number>(-1);
  const deleteVacancy = api.CRUD.deleteVacancy.useMutation();
  const [vacancies, setVacancies] = useState<Vacancy[]>(data ?? []);

  const [editedValues, setEditedValues] = React.useState<
    Record<string, Partial<Vacancy>>
  >({});

  const handleInputChange = (
    name: string,
    value: string,
    row: Row<Vacancy>
  ) => {
    const id = row.original.id;
    const updatedRow = {
      ...row.original,
      [name]: value,
    };
    const updatedVacancies = vacancies.map((v) =>
      v.id === id ? updatedRow : v
    );
    setVacancies(updatedVacancies);
  };
  //   const handleInputChange = (
  //     name: string,
  //     value: string,
  //     row: Row<Vacancy>
  //   ) => {
  //     const id = row.original.id;
  //     const updatedRow = {
  //       ...row.original,
  //       [name]: value,
  //     };
  //     setEditedValues({
  //       ...editedValues,
  //       [id]: updatedRow,
  //     });
  //   };

  const handleDeleteQuery = (vacancyId: number) => {
    deleteVacancy.mutate(vacancyId, {
      onSuccess(data) {
        toast.success(`Запис з Id  ${data.id} видалено!`);
      },
      onError(error) {
        toast.error("Запис не видалено!");
        console.log(error);
      },
    });
  };
  const handleSubmitChange = () => {
    throw new Error("asd");
  };
  const columns = React.useMemo<Column<Vacancy>[]>(
    () => [
      {
        Header: "ID",
        accessor: "id",
      },
      {
        Header: "Title",
        accessor: "title",
        Cell: ({ row }) => (
          <InputForTable
            type="text"
            defaultValue={row.original.title}
            title="title"
            edit={editIndex === row.original.id}
            onChange={(name, value) => handleInputChange(name, value, row)}
          />
        ),
      },
      {
        Header: "Department",
        accessor: "department",
      },
      {
        Header: "Description",
        accessor: "description",
      },
      {
        Header: "Requirements",
        accessor: "requirements",
      },
      {
        Header: "Posting Date",
        accessor: "posting_date",
        Cell: ({ value }) => <span>{value.toISOString().slice(0, 10)}</span>,
      },
      {
        Header: "Closing Date",
        accessor: "closing_date",
        Cell: ({ value }) => <span>{value.toISOString().slice(0, 10)}</span>,
      },
      {
        Header: "Status",
        accessor: "status",
      },
      {
        Header: "Edit",
        Cell: ({ row }: CellProps<Vacancy>) => (
          <EditButton
            setId={() => {
              setEditIndex(row.original.id);
            }}
            handleCancel={() => setEditIndex(-1)}
            handleSubmit={handleSubmitChange}
          />
        ),
      },
      {
        Header: "Delete",
        Cell: ({ row }: CellProps<Vacancy>) => (
          <DialogBox
            buttonName="Видалити"
            text="Усі кандидати за цією вакансією будуть видалені!"
            title="Видалити вакансію?"
            onAccept={() => {
              setDeletedRow(row.original.id ?? -1);
              handleDeleteQuery(row.original.id ?? -1);
            }}
          />
        ),
      },
    ],
    []
  );

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({ columns, data });
  console.log("Render");

  return (
    <table {...getTableProps()}>
      <thead>
        {headerGroups.map((headerGroup, index) => (
          <tr {...headerGroup.getHeaderGroupProps()} key={index}>
            {headerGroup.headers.map((column, index) => (
              <th
                {...column.getHeaderProps()}
                key={index}
                className="border border-blue-400 px-4 py-2 text-white"
              >
                {column.render("Header")}
              </th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody {...getTableBodyProps()}>
        {rows.map((row, index) => {
          prepareRow(row);
          return (
            <tr {...row.getRowProps()} key={index}>
              {row.cells.map((cell, index) => (
                <td
                  {...cell.getCellProps()}
                  key={index}
                  className="border border-blue-400 px-4 py-2 text-white"
                >
                  {cell.render("Cell")}
                </td>
              ))}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

const Wrapper: NextPage = () => {
  const { data, isFetched } = api.CRUD.getAllVacancies.useQuery();

  if (!isFetched) {
    return <Spinner />;
  }
  return (
    <>
      <BackGround>
        <NavBar></NavBar>
        <VacancyTableNew data={data ?? []}></VacancyTableNew>
      </BackGround>
    </>
  );
};
export default Wrapper;
