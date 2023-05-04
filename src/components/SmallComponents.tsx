import { Transition } from "@headlessui/react";
import { useState, type FC, HTMLInputTypeAttribute } from "react";
import { PencilIcon, CheckIcon } from "@heroicons/react/20/solid";
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
};
export const CustomInput: FC<InputProps> = ({ name, type = "text", text }) => {
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
