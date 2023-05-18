import { type Vacancy } from "@prisma/client";
import { type NextPage } from "next";
import { useMemo, useEffect, useState } from "react";
import { type Column, useTable } from "react-table";
import { api } from "~/utils/api";

const VacancyReportTable: NextPage = () => {
  const { data, isFetched } = api.CRUD.getAllVacancies.useQuery();
  const [tableData, setTableData] = useState<Vacancy[]>([]);
  useEffect(() => {
    if (!data) return;
    setTableData(data);
  }, [isFetched]);

  // const memoData = useMemo(() => tableData, []);
  const filteredData = useMemo(
    () => tableData.filter((vacancy) => vacancy.status === "Відкрита"),
    [tableData]
  );
  const columns: Column<Vacancy>[] = useMemo(
    () => [
      { Header: "Ідентифікатор", accessor: "id" },
      { Header: "Заголовок", accessor: "title" },
      { Header: "Департамент", accessor: "department" },
      { Header: "Опис", accessor: "description" },
      { Header: "Вимоги", accessor: "requirements" },
      {
        Header: "Дата розміщення",
        accessor: "posting_date",
        Cell: ({ value }) => (
          <span>{new Date(value).toLocaleDateString()}</span>
        ),
      },
      {
        Header: "Дата закриття",
        accessor: "closing_date",
        Cell: ({ value }) => (
          <span>{new Date(value).toLocaleDateString()}</span>
        ),
      },
      { Header: "Статус", accessor: "status" },
    ],
    []
  );

  const tableInstance = useTable({ columns, data: filteredData });
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    tableInstance;
  return (
    <table {...getTableProps()}>
      <thead>
        {headerGroups.map((headerGroup, index) => (
          <tr {...headerGroup.getHeaderGroupProps()} key={index}>
            {headerGroup.headers.map((column, index) => (
              <th
                {...column.getHeaderProps()}
                key={index}
                className="border border-blue-400 px-4 py-2 text-black"
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
                  className="border border-blue-400 px-4 py-2 text-black"
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

export default VacancyReportTable;
