import { Transition } from "@headlessui/react";
import { useState, type FC } from "react";
import { PencilIcon,CheckIcon } from "@heroicons/react/20/solid";
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
  const [show, setShow] = useState(false);
  return (
    <>
      {isEdit ? (
        // <Transition
        //   show={show}
        //   className="font-bold"
        //   enter="transition-opacity duration-75"
        //   enterFrom="opacity-0"
        //   enterTo="opacity-100"
        //   leave="transition-opacity duration-150"
        //   leaveFrom="opacity-100"
        //   leaveTo="opacity-0"
        // >
        <div className="animate-fade-in flex justify-evenly">
          <button
            className="rounded bg-green-600 px-4 py-2 flex items-center"
            onClick={() => {
              handleSubmit?.();
              setIsEdit(false);
              handleCancel?.();
            }}
          >
            <span className="inline-block align-middle">Зберегти</span><CheckIcon className="h-4 w-4 inline-block"/>
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
        // </Transition>
        // <Transition
        //   show={!show}
        //   className="font-bold"
        //   enter="transition-opacity duration-75"
        //   enterFrom="opacity-0"
        //   enterTo="opacity-100"
        //   leave="transition-opacity duration-150"
        //   leaveFrom="opacity-100"
        //   leaveTo="opacity-0"
        // >
        <div className="flex justify-center">
          <button
            className="flex justify-between rounded bg-blue-600 px-4 py-2 items-center"
            onClick={() => {
              setShow(true);
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

export const MyComponent = () => {
  const [isShowing, setIsShowing] = useState(false);

  return (
    <>
      <button onClick={() => setIsShowing((isShowing) => !isShowing)}>
        Toggle
      </button>
      <Transition
        show={isShowing}
        as="a"
        href="/my-url"
        className="font-bold"
        enter="transition-opacity duration-75"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="transition-opacity duration-150"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        I will appear and disappear.
      </Transition>
    </>
  );
};
