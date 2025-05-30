import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useEffect, useState } from "react";
import SideBarItem from "./SideBarItem";
import { usePathname } from "next/navigation";
import { AiFillDashboard } from "react-icons/ai";
import { RiApps2AiFill } from "react-icons/ri";
import { IoGameController } from "react-icons/io5";
import { TbDeviceGamepad3Filled } from "react-icons/tb";
import { FaUsers } from "react-icons/fa6";

export default function MobileSidebar({ isOpenSidebar, closeSidebarFn }: { isOpenSidebar: boolean; closeSidebarFn: any }) {
  const dark = typeof window !== "undefined" && localStorage.getItem("theme");

  const pathName = usePathname();
  const [path, setPath] = useState(pathName);

  useEffect(() => {
    if (pathName) {
      setPath(pathName);
    }
  }, [pathName]);

  const navigation: any = [
    {
      name: "داشبورد",
      href: "/dashboard/home",
      icon: (
        <div className="text-xl">
          <AiFillDashboard />
        </div>
      ),
    },
    {
      name: "محتوای بازی مرحله‌ای",
      href: "/dashboard/stage_game",
      icon: (
        <div className="text-xl">
          <IoGameController />
        </div>
      ),
      children: [
        {
          name: "ثبت فصل جدید",
          href: "/register_new_season",
        },
        {
          name: "ثبت مرحله جدید",
          href: "/register_new_stage",
        },
      ],
    },
    {
      name: "محتوای بازی بسته‌ای",
      href: "/dashboard/package_game",
      icon: (
        <div className="text-xl">
          <RiApps2AiFill />
        </div>
      ),
      children: [
        {
          name: "ثبت بسته بازی جدید",
          href: "/register_new_package_game",
        },
        {
          name: "ثبت فصل جدید",
          href: "/register_new_season",
        },
        {
          name: "ثبت مرحله جدید",
          href: "/register_new_stage",
        },
        {
          name: "افزودن کالکشن جدید",
          href: "/add_collection",
        },
      ],
    },
    {
      name: "محتوای عمومی",
      href: "/dashboard/general",
      icon: (
        <div className="text-xl">
          <TbDeviceGamepad3Filled />
        </div>
      ),
      children: [
        {
          name: "تعریف زبان",
          href: "/add_language",
        },
        {
          name: "تعریف دسته‌بندی موضوع",
          href: "/add_topic_category",
        },
      ],
    },
    {
      name: "مدیریت کاربران",
      href: "/dashboard/users",
      icon: (
        <div className="text-xl">
          <FaUsers />
        </div>
      ),
      children: [
        {
          name: "لیست کاربران",
          href: "/user_list",
        },
      ],
    },
  ];

  return (
    <>
      <Transition show={isOpenSidebar} as={Fragment}>
        <Dialog as="div" className="relative z-[1500]" onClose={closeSidebarFn}>
          <Transition.Child
            as={Fragment}
            enter="transition-opacity ease-linear duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity ease-linear duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-background6_dark bg-opacity-70 transition-opacity" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="h-full min-h-full max-w-xs w-3/4">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="translate-x-full opacity-0"
                enterTo="translate-y-0 opacity-100"
                leave="ease-in duration-200"
                leaveFrom="translate-x-0 opacity-100"
                leaveTo="translate-x-full opacity-0"
              >
                <Dialog.Panel className="h-full w-full max-w-md transform overflow-hidden text-left align-middle shadow-xl transition-all">
                  <div
                    className={`h-full flex grow flex-col gap-y-5 border-border dark:border-border_dark bg-background2 dark:bg-background2_dark px-6 pb-4 font-iransans-md overflow-y-auto
                    }`}
                  >
                    <div className="flex justify-start h-16 shrink-0 items-center">
                      <h1
                        className={`bg-gradient-to-r primaryGradient from-primary_start to-primary_end bg-clip-text text-transparent text-3xl 2xs:text-[2rem] mt-4 font-black items-center text-center font-['iransans-black'] select-none`}
                      >
                        WORD GAME
                      </h1>
                    </div>

                    <nav className="flex flex-1 flex-col">
                      <ul role="list" className="flex justify-between flex-1 flex-col gap-y-7">
                        <li>
                          <ul role="list" className="flex flex-col gap-2 select-none">
                            {navigation.map((item: any, index: number) => (
                              <SideBarItem
                                key={`${item}${index}`}
                                name={item?.name}
                                href={item?.href}
                                child={item?.children?.length > 0 ? item?.children : []}
                                active={path.includes(item?.href) ? true : false}
                                closeDrawer={closeSidebarFn}
                                icon={item?.icon}
                              />
                            ))}
                          </ul>
                        </li>
                      </ul>
                    </nav>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}
