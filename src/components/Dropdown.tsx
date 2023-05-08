import { type FC, Fragment } from "react";
import { Menu, Transition } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import { useRouter } from "next/router";
type DropDownProps = {
  title: string;
  items: string[];
  links: string[];
};
const DropDown: FC<DropDownProps> = ({ title, items, links }) => {
  const router = useRouter();
  return (
    <Menu as="div" className={"relative z-10 flex flex-col"}>
      <Menu.Button
        className={`
          inline-flex w-full justify-center rounded-md bg-black bg-opacity-20 px-4 py-2 text-sm font-medium text-white 
           hover:bg-opacity-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75`}
      >
        {title}
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
          {items.map((name, index) => (
            <Menu.Item as={"div"} className={"sticky"} key={index}>
              {({ active }) => (
                <a
                  className={`${
                    active ? "bg-slate-600 bg-opacity-30 text-red-600" : "text-white"
                  }  flex w-full items-center rounded-md px-2 py-2 text-sm mb-4`}
                  onClick={() => void router.push(`/${links[index] ?? ""}`)}
                >
                  {name}
                </a>
              )}
            </Menu.Item>
          ))}
        </Menu.Items>
      </Transition>
    </Menu>
  );
};

export default DropDown;
