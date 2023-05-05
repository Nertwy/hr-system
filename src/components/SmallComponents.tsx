import { Combobox, Transition } from "@headlessui/react";
import {
  useState,
  type FC,
  type HTMLInputTypeAttribute,
  useEffect,
} from "react";
import {
  PencilIcon,
  CheckIcon,
  ChevronUpDownIcon,
} from "@heroicons/react/20/solid";
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
  callback
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
        }}>
          <div className="relative mt-1">
            <div className="relative w-full cursor-default overflow-hidden rounded-lg bg-white text-left shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-red-300 sm:text-sm">
              <Combobox.Input
                onChange={(e) => setQuery(e.currentTarget.value)}
                displayValue={(value:T) => value?.name}
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
                data?.map((value: T, index) => (
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
