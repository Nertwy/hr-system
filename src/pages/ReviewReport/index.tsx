import { type Review } from "@prisma/client";
import { type NextPage } from "next";
import { useEffect, useMemo, useState } from "react";
import { type Column, useTable } from "react-table";
import NavBar from "~/components/NavBar";
import { BackGround } from "~/components/SmallComponents";
import { api } from "~/utils/api";
const ReviewTable: NextPage = () => {
  const { data: reviewData, isFetched: isReviewFetched } =
    api.CRUD.getAllReview.useQuery();
  const { data: employeeData, isFetched: isEmployeeFetched } =
    api.CRUD.getAllEmployees.useQuery();
  const [tableData, setTableData] = useState<Review[]>([]);

  useEffect(() => {
    if (!reviewData || !employeeData) return;

    // Join Review and Employee data based on employeeId
    const joinedData = reviewData.map((review) => {
      const employee = employeeData.find(
        (employee) => employee.id === review.employeeId
      );
      return {
        ...review,
        employeeName: employee
          ? `${employee.first_name} ${employee.last_name}`
          : "",
      };
    });

    setTableData(joinedData);
  }, [isReviewFetched, isEmployeeFetched]);

  const filteredData = useMemo(() => tableData, [tableData]);
  //   const memoData = useMemo(() => ta.bleData, []);

  //change Cell values

  const columns: Column<Review>[] = useMemo(
    () => [
      { Header: "Ідентифікатор", accessor: "id" },
      {
        Header: "Працівник",
        accessor: "employeeId",
        Cell: ({ value }) => (
          <span>
            {employeeData?.find((employee) => employee.id === value)?.last_name}
          </span>
        ),
      },
      {
        Header: "Оглядач",
        accessor: "reviewerId",
        Cell: ({ value }) => (
          <span>
            {employeeData?.find((employee) => employee.id === value)?.last_name}
          </span>
        ),
      },
      {
        Header: "Дата огляду",
        accessor: "reviewDate",
        Cell: ({ value }) => (
          <span>{new Date(value).toLocaleDateString()}</span>
        ),
      },
      { Header: "Рейтинг", accessor: "reviewRating" },
      { Header: "Нотатки", accessor: "reviewNotes" },
    ],
    [employeeData]
  );

  const tableInstance = useTable({ columns, data: filteredData });
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    tableInstance;
  return (
    <>
      <NavBar />
      <div className="flex flex-col pt-28">
        <table {...getTableProps()} className="">
          <thead>
            {headerGroups.map((headerGroup, index: number) => (
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
      </div>
    </>
  );
};

export default ReviewTable;
