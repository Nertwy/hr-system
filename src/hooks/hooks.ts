import {
  type Vacancy,
  type Resume,
  type Candidate,
  type Department,
  type Employee,
  type Review,
} from "@prisma/client";
import { type ChangeEvent, type Dispatch, type SetStateAction,  useState } from "react";
import { type SortState } from "~/components/SmallComponents";

export const useOnChange = (initialValue: string) => {
  const [value, setValue] = useState(initialValue);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.currentTarget.value);
  };

  return {
    value,
    onChange: handleChange,
  };
};

export const handleChange = <T extends { id: number; [key: string]: any }>(
  e: React.ChangeEvent<HTMLInputElement>,
  setFunction: Dispatch<SetStateAction<T[]>>,
  editindex: number
) => {
  
  const { name, value } = e.currentTarget;
  setFunction((prevRes: T[]) => {
    const updatedArr = prevRes?.map((elem) => {
      if (editindex === elem.id) {
        let updatedValue: unknown;
        if (typeof elem[name] === 'number') {
          updatedValue = Number(value);
        } else if (elem[name] instanceof Date) {
          updatedValue = new Date(value);
        } else {
          updatedValue = value;
        }
        return {
          ...elem,
          [name]: updatedValue,
        };
      }
      return elem;
    });
    // console.log(updatedArr);
    
    return updatedArr;
  });
};

export const handleSort = <T>(
  key: keyof T,
  isAscending: SortState,
  data: T[],
  setState: Dispatch<SetStateAction<T[]>>
) => {
  const sortedArr = sortFunction(key, isAscending);
  const a: T[] = sortedArr(data);
  setState([...a]);
};

const sortFunction =
  <T>(key: keyof T, isAscending: SortState) =>
  (array: T[]): T[] => {
    return [...array].sort((a, b) => {
      const valueA = a[key];
      const valueB = b[key];

      if (typeof valueA === "number" && typeof valueB === "number") {
        return isAscending === "ascending" ? valueA - valueB : valueB - valueA;
      }

      if (typeof valueA === "string" && typeof valueB === "string") {
        return isAscending === "ascending"
          ? valueA.localeCompare(valueB)
          : valueB.localeCompare(valueA);
      }

      if (valueA instanceof Date && valueB instanceof Date) {
        const timeA = valueA.getTime();
        const timeB = valueB.getTime();
        return isAscending === "ascending" ? timeA - timeB : timeB - timeA;
      }
      return 0;
    });
  };

export const handleFiltration = <
  T extends Vacancy | Resume | Candidate | Department | Employee | Review,
  K extends keyof T
>(
  e: ChangeEvent<HTMLInputElement>,
  setState: Dispatch<SetStateAction<T[]>>,
  // filter_data: T[],
  default_data: T[],
  key?: K
) => {
  if (!key) {
    return;
  }
  if (e.currentTarget.value === "") {
    setState(default_data);
    return;
  }
  const result = default_data.filter((elem) =>
    String(elem[key])
      .toLowerCase()
      .includes(e.currentTarget.value.toLowerCase())
  );
  setState(result);
};

export const createKeyCycler = <T extends Record<string, unknown>>(obj: T) => {
  let currentIndex = 0;
  const keys = Object.keys(obj) as Array<keyof T>;

  return function () {
    const currentKey = keys[currentIndex];
    currentIndex = (currentIndex + 1) % keys.length;
    return currentKey;
  } as ()=> keyof T | undefined;
};


