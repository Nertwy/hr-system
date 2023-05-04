import { Vacancy } from "@prisma/client";
import { NextPage } from "next";
import { useEffect, useState } from "react";
import Spinner from "~/components/Spinner";
import CustomTable from "~/components/Table";
import { api } from "~/utils/api";

const CustomTablePage: NextPage = () => {
  const { data, isLoading, isFetched } = api.CRUD.getAllVacancies.useQuery();
  const [vacancies, setVacancies] = useState<Vacancy[]>([]);
  const mapKeysToStringObject = (keys: string[]) => {
    const result: Record<string, string> = {};
    keys.forEach((key) => {
      result[key] = key;
    });
    console.log(result);
    
    return result;
  };

  useEffect(() => {
    setVacancies(data ?? []);
  }, [isFetched]);
  if (isLoading) {
    return <Spinner />;
  }
  console.log(data);
  const columnNames = {
    id: "Id",
    title: "title",
    department: "department",
    description: "description",
    requirements: "requirements",
    posting_date: "posting_date",
    closing_date: "closing_date",
    status: "status"
  }
  return (
    <>
      <CustomTable
        data={vacancies}
        columnNames={columnNames}
      ></CustomTable>
    </>
  );
};
export default CustomTablePage;
