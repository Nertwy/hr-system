import React, { useState } from "react";
import { InputForTable } from "~/pages/VacancyTable/VacancyTable";
import DialogBox from "../DialogBox";
import { EditButton } from "../SmallComponents";

interface Props<
  T extends Record<string, any>,
  U extends Record<string, string>
> {
  data: T[];
  columnNames: U;
}

function CustomTable<
  T extends Record<string, any>,
  U extends Record<string, string>
>({ data, columnNames }: Props<T, U>) {
  const columnKeys = Object.keys(columnNames);
  const [editIndex, setEditIndex] = useState(-1);
  const [vacancyState, setVacancyState] = useState<T>();

  const handleSubmitChange = () => {
    console.log("handleSubmit");
  };
  const handleInputChange = (name: keyof T, value: string) => {
    setVacancyState((prevState) => ({
      ...(prevState as T),
      [name]: value,
    }));
  };
  function setDeletedRow(arg0: any) {
    throw new Error("Function not implemented.");
  }

  function handleDeleteQuery(arg0: any) {
    throw new Error("Function not implemented.");
  }

  return (
    <table>
      <thead>
        <tr>
          {columnKeys.map((columnKey) => (
            <th key={columnKey} className="border border-blue-400 px-4 py-2">
              {columnNames[columnKey]}{" "}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row, index) => (
          <tr key={index}>
            {columnKeys.map((columnKey) => (
              <td key={columnKey} className="border border-blue-400 px-4 py-2">
                {/* { row[columnKey] instanceof Date ? <p>{(row[columnKey] as Date).toISOString().slice(0,10)}</p> : <>{row[columnKey]}</>} */}
                {row[columnKey] instanceof Date ? (
                  <InputForTable
                    defaultValue={(row[columnKey] as Date)
                      .toISOString()
                      .slice(0, 10)}
                    edit={editIndex === row["id"]}
                    title={columnKey}
                    onChange={handleInputChange}
                    type="date"
                  />
                ) : (
                  <InputForTable
                    defaultValue={(row[columnKey] as string) ?? ""}
                    edit={editIndex === row["id"]}
                    title={columnKey}
                    onChange={handleInputChange}
                  />
                )}
              </td>
            ))}
            <td className="border border-blue-400 px-4 py-2">
              <EditButton
                setId={() => {
                  setVacancyState({
                    ...row,
                  });
                  setEditIndex((row["id"] as number) ?? -1);
                }}
                handleCancel={() => setEditIndex(-1)}
                handleSubmit={handleSubmitChange}
              />
            </td>
            <td className="border border-blue-400 px-4 py-2">
              <DialogBox
                buttonName="Видалити"
                text="Усі кандидати за цією вакансією будуть видалені!"
                title="Видалити вакансію?"
                onAccept={() => {
                  setDeletedRow(row["id"] ?? -1);
                  handleDeleteQuery(row["id"] ?? -1);
                }}
              />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default CustomTable;
