import { Combobox } from "@headlessui/react";
import {
  useState,
  type FC,
  type HTMLInputTypeAttribute,
  useEffect,
  type ChangeEvent,
  type Dispatch,
  type SetStateAction,
} from "react";
import {
  PencilIcon,
  CheckIcon,
  ChevronUpDownIcon,
} from "@heroicons/react/20/solid";
import {
  type Candidate,
  type Department,
  type Employee,
  type Resume,
  type Review,
  type Vacancy,
} from "@prisma/client";
import { handleFiltration } from "~/hooks/hooks";
type BackGroundprops = {
  children: JSX.Element[];
};
export const BackGround: FC<BackGroundprops> = ({ children }) => {
  return (
    <div className="flex h-screen w-screen items-center justify-center overflow-auto bg-gradient-to-b from-[#6d0214] to-[#2c1519]">
      {...children}
    </div>
  );
};
type EditButtonProps = {
  handleCancel?: () => void;
  handleSubmit?: () => void;
  setId: () => void;
};
export const EditButton: FC<EditButtonProps> = ({
  handleSubmit,
  setId,
  handleCancel,
}) => {
  const [isEdit, setIsEdit] = useState<boolean>(false);
  return (
    <>
      {isEdit ? (
        <div className="animate-fade-in flex justify-evenly">
          <button
            className="flex items-center rounded bg-green-600 px-4 py-2"
            onClick={() => {
              handleSubmit?.();
              setIsEdit(false);
              handleCancel?.();
            }}
          >
            <span className="inline-block align-middle">Зберегти</span>
            <CheckIcon className="inline-block h-4 w-4" />
          </button>
          <button
            className="rounded bg-red-600 px-4 py-2"
            onClick={() => {
              // setShow(false);
              handleCancel?.();
              setIsEdit(false);
            }}
          >
            Скасувати
          </button>
        </div>
      ) : (
        <div className="flex justify-center">
          <button
            className="flex items-center justify-between rounded bg-blue-600 px-4 py-2"
            onClick={() => {
              setId?.();
              setIsEdit(true);
            }}
          >
            <span className="pr-2">Редагувати</span>{" "}
            <PencilIcon className="h-4 w-4" />
          </button>
        </div>
        // </Transition>
      )}
    </>
  );
};

export const SubmitButton = () => {
  return (
    <button
      type="submit"
      className="float-right w-full rounded-lg bg-red-700 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-red-800 focus:outline-none focus:ring-4 focus:ring-red-300 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800 sm:w-auto"
    >
      Створити запис
    </button>
  );
};
type InputProps = {
  name: string;
  type?: HTMLInputTypeAttribute;
  text: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
};
export const CustomInput: FC<InputProps> = ({
  name,
  type = "text",
  text,
  onChange,
}) => {
  return (
    <div className="group relative z-0 mb-6 w-full">
      <input
        // onChange={first_name.onChange}
        type={type}
        name={name}
        id={name}
        className="peer block w-full appearance-none border-0 border-b-2 border-gray-300 bg-transparent px-0 py-2.5 text-base  text-gray-900 focus:border-red-600 focus:outline-none focus:ring-0 dark:border-gray-600 dark:text-white dark:focus:border-red-500"
        placeholder=" "
        required
        onChange={(e) => {
          onChange?.(e);
        }}
      />
      <label
        htmlFor={name}
        className="absolute top-3 -z-10 origin-[0] -translate-y-6 scale-75 transform font-mono text-sm text-gray-500 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:left-0 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:font-medium peer-focus:text-red-600 dark:text-gray-400 peer-focus:dark:text-red-500"
      >
        {text}
      </label>
    </div>
  );
};
type DataWithId<T> = Array<T & { id?: number; name: string }>;
type DropBoxProps<T> = {
  data: DataWithId<T>;
  names: string[];
  callback?: (data: T | null) => void;
};
export const DropBox = <
  T extends {
    id: number;
    name: string;
  }
>({
  data,
  callback,
}: DropBoxProps<T>): JSX.Element => {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<T | null>(null);
  useEffect(() => {
    setSelected(data?.[0] ?? null);
    callback?.(selected);
  }, []);
  const filter =
    query === "" || !data
      ? data
      : data.filter((value) =>
          value.name
            .toLowerCase()
            .replace(/\s+/g, "")
            .includes(query.toLowerCase().replace(/\s+/g, ""))
        );
  return (
    <div className="group relative z-0 mb-6 w-full object-center">
      <div className="max-h-40 w-1/2">
        <Combobox
          value={selected}
          onChange={(e) => {
            setSelected(e);
            callback?.(e);
          }}
        >
          <div className="relative mt-1">
            <div className="relative w-full cursor-default overflow-hidden rounded-lg bg-white text-left shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-red-300 sm:text-sm">
              <Combobox.Input
                onChange={(e) => setQuery(e.currentTarget.value)}
                displayValue={(value: T) => value?.name}
                className="border-non e  w-full py-2 pl-3 pr-10 text-sm leading-5 text-gray-900 focus:ring-0"
              />
              <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
                <ChevronUpDownIcon
                  className="h-5 w-5 text-gray-400"
                  aria-hidden="true"
                />
              </Combobox.Button>
            </div>
            <Combobox.Options
              className={`absolute mt-1 max-h-40 w-full 
                overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 
                ring-black ring-opacity-5 focus:outline-none sm:text-sm`}
            >
              {filter?.length === 0 && query !== "" ? (
                <div className="relative cursor-default select-none px-4 py-2 text-gray-700">
                  Nothing found.
                </div>
              ) : (
                data?.map((value: T) => (
                  <Combobox.Option
                    value={value}
                    key={value.id}
                    className={({ active }) =>
                      `relative cursor-default select-none py-2 pl-10 pr-4 ${
                        active ? "bg-red-600 text-white" : "text-gray-900"
                      }`
                    }
                  >
                    {({ selected, active }) => (
                      <>
                        <span
                          className={`block truncate ${
                            selected ? "font-medium" : "font-normal"
                          }`}
                        >
                          {value.name}
                        </span>
                        {selected ? (
                          <span
                            className={`absolute inset-y-0 left-0 flex items-center pl-3 ${
                              active ? "text-white" : "text-red-600"
                            }`}
                          >
                            <CheckIcon className="h-5 w-5" aria-hidden="true" />
                          </span>
                        ) : null}
                      </>
                    )}
                  </Combobox.Option>
                ))
              )}
            </Combobox.Options>
          </div>
        </Combobox>
      </div>
    </div>
  );
};
export type SortState = "ascending" | "descending" | "none";

type CustomTrProps<T> = {
  columnNames: { name: keyof T; value: string }[];
  onSort: (key: keyof T, isAscending: SortState) => void;
};

export const CustomTr = <T,>({ columnNames, onSort }: CustomTrProps<T>) => {
  const [sortStates, setSortStates] = useState<Record<keyof T, SortState>>(
    {} as Record<keyof T, SortState>
  );

  const handleSortClick = (columnName: keyof T) => {
    setSortStates((prevState) => {
      const currentSortState = prevState[columnName];
      let newSortState: SortState = "ascending";
      if (currentSortState === "ascending") {
        newSortState = "descending";
      } else if (currentSortState === "descending") {
        newSortState = "none";
      }

      return {
        ...prevState,
        [columnName]: newSortState,
      };
    });
  };

  return (
    <tr className="text-white">
      {columnNames.map((value, index) => (
        <td
          className="animate-pulse cursor-pointer border border-blue-400 px-4 py-2"
          scope="col"
          key={index}
          onClick={() => {
            handleSortClick(value.name);
            onSort(value.name, sortStates[value.name] ?? "none");
            console.log(value.name, sortStates[value.name]);
          }}
        >
          {value.value}
          {sortStates[value.name] === "ascending" && " ▲"}
          {sortStates[value.name] === "descending" && " ▼"}
        </td>
      ))}
      <td className="border border-blue-400 px-4 py-2" scope="col">
        Редагувати
      </td>
      <td className="border border-blue-400 px-4 py-2" scope="col">
        Видалити запис
      </td>
    </tr>
  );
};

type InputForTableProps = {
  defaultValue: string | number;
  type?: HTMLInputTypeAttribute;
  edit?: boolean;
  title?: string;
  onChange?: (title: string, eventValue: string) => void;
  onChangeNew?: (e: ChangeEvent<HTMLInputElement>) => void;
  name?: string;
};
type DynamicType =
  | Resume
  | Vacancy
  | Employee
  | Review
  | Department
  | Candidate;
export const InputForTable: FC<InputForTableProps> = ({
  defaultValue,
  type = "text",
  edit = false,
  onChange,
  title,
  onChangeNew,
  name,
}) => {
  return (
    <>
      {!edit ? (
        <>{defaultValue}</>
      ) : (
        <input
          name={name ?? ""}
          className="peer block w-full appearance-none border-0 border-b-2 border-gray-100 bg-transparent  py-2.5 text-sm text-gray-900 focus:border-red-600 focus:outline-none focus:ring-0 dark:border-gray-600 dark:text-white dark:focus:border-red-500"
          defaultValue={defaultValue}
          type={type}
          onChange={(event) => {
            onChange?.(title ?? "", event.currentTarget.value);
            onChangeNew?.(event);
          }}
        />
      )}
    </>
  );
};

type SearchComponentProps<
  T extends Vacancy | Resume | Candidate | Department | Employee | Review
> = {
  data: T[];
  setFilterState: Dispatch<SetStateAction<T[]>>;
  filteredData: T[];
  cycleKey?: () => keyof T | undefined;
};
export const SearchComponent = <
  T extends Vacancy | Resume | Candidate | Department | Employee | Review
>({
  data,
  // filteredData,
  setFilterState,
  cycleKey,
}: SearchComponentProps<T>) => {
  const handleKeyChange = () => {
    setDataKey(cycleKey?.());
  };
  const getFirstElem = () => {
    if (data && data.length > 0) {
      const keys = Object.keys(data[0] as T) as Array<keyof T>;
      // setDataKey(keys[0]);
      return keys[0];
    }
  };
  const [dataKey, setDataKey] = useState<keyof T | undefined>(getFirstElem());

  return (
    <div className="flex flex-col w-full">
      <label
        htmlFor="filter"
        className="animate-pulse text-white cursor-pointer"
        onClick={handleKeyChange}
      >
        Натисніть для фільтрації по{" "}
        <span className="text-green-600">{dataKey?.toLocaleString()}</span>
      </label>
      <input
        id="filter"
        className="mb-4 h-8 w-full rounded-lg bg-red-500 bg-opacity-30 text-white"
        placeholder="Фільтрація"
        onChange={(e: ChangeEvent<HTMLInputElement>) =>
          handleFiltration<T, keyof T>(
            e,
            setFilterState,
            // filteredData,
            data,
            dataKey
          )
        }
      ></input>
    </div>
  );
};
