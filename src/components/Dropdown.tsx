import { type FC, Fragment } from "react";
import { Menu, Transition } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import { useRouter } from "next/router";
const DropDown: FC = () => {
  const router = useRouter();
  return (
    <Menu as="div" className={"relative flex flex-col"}>
      <Menu.Button
        className={`
          inline-flex w-full justify-center rounded-md bg-black bg-opacity-20 px-4 py-2 text-sm font-medium text-white 
           hover:bg-opacity-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75`}
      >
        Таблиці
        <ChevronDownIcon
          className="-mr-1 ml-2 h-5 w-5 text-violet-200 hover:text-violet-100"
          aria-hidden="true"
        />
      </Menu.Button>
      <Transition
        as={Fragment}
        enter="transition ease-out duration-500"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute mt-8 flex flex-col bg-transparent pb-8">
          <Menu.Item as={"div"} className={"sticky"}>
            {({ active }) => (
              <a
                className={`${
                  active ? "bg-transparent text-red-600" : "text-white"
                } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                href="#"
                onClick={()=> void router.push("/VacancyPage")}
              >
                Вакансії
              </a>
            )}
          </Menu.Item>
          <Menu.Item>
            {({ active }) => (
              <a
                className={`${
                  active ? "bg-transparent text-red-600" : "text-white"
                } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                onClick={()=> void router.push("/CandidatePage")}
              >
                Кандидати
              </a>
            )}
          </Menu.Item>
        </Menu.Items>
      </Transition>
    </Menu>
  );
};

export default DropDown;