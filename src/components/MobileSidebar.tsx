import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useEffect, useState } from "react";
import SideBarItem from "./SideBarItem";
import { usePathname } from "next/navigation";
import { AiFillDashboard } from "react-icons/ai";
import { RiApps2AddFill, RiApps2Fill } from "react-icons/ri";
import { TbDiaboloPlus, TbHexagonalPrismPlus, TbHexagonPlusFilled } from "react-icons/tb";
import { FaDiceD6, FaUsers } from "react-icons/fa6";
import { LuClipboardList } from "react-icons/lu";
import { BsCloudPlus, BsCloudPlusFill } from "react-icons/bs";

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
      head:true
    },
    {
      name: "ثبت محتوای بازی مرحله‌ای",
      href: "/dashboard/stage_game",
      icon: (
        <div className="text-xl">
          <TbHexagonPlusFilled />
        </div>
      ),
      head:true,
      children: [
        {
          name: "ثبت فصل جدید",
          href: "/register_new_season",
          icon: (
            <div className="text-xl">
              <TbHexagonalPrismPlus />
            </div>
          ),
        },
        {
          name: "ثبت مرحله جدید",
          href: "/register_new_stage",
          icon: (
            <div className="text-xl">
              <TbHexagonalPrismPlus />
            </div>
          ),
        },
      ],
    },
    {
      name: "مدیریت محتوای بازی مرحله‌ای",
      href: "/dashboard/manage_stage_game",
      icon: (
        <div className="text-xl">
          <FaDiceD6 />
        </div>
      ),
      head:true,
      children: [
        {
          name: "لیست فصل‌ها",
          href: "/season_list",
          icon: (
            <div className="text-xl">
              <LuClipboardList />
            </div>
          ),
        },
        {
          name: "لیست مراحل",
          href: "/stage_list",
          icon: (
            <div className="text-xl">
              <LuClipboardList />
            </div>
          ),
        },
      ],
    },
    {
      name: "ثبت محتوای پکیج‌های بازی",
      href: "/dashboard/package_game",
      icon: (
        <div className="text-xl">
          <RiApps2AddFill />
        </div>
      ),
      head:true,
      children: [
        {
          name: "ثبت پکیج بازی جدید",
          href: "/register_new_package_game",
          icon: (
            <div className="text-xl">
              <TbDiaboloPlus />
            </div>
          ),
        },
        {
          name: "ثبت فصل جدید",
          href: "/register_new_season",
          icon: (
            <div className="text-xl">
              <TbDiaboloPlus />
            </div>
          ),
        },
        {
          name: "ثبت مرحله جدید",
          href: "/register_new_stage",
          icon: (
            <div className="text-xl">
              <TbDiaboloPlus />
            </div>
          ),
        },
        {
          name: "افزودن کالکشن جدید",
          href: "/add_collection",
          icon: (
            <div className="text-xl">
              <TbDiaboloPlus />
            </div>
          ),
        },
      ],
    },
    {
      name: "مدیریت محتوای پکیج‌های بازی",
      href: "/dashboard/manage_package_game",
      icon: (
        <div className="text-xl">
          <RiApps2Fill />
        </div>
      ),
      head:true,
      children: [
        {
          name: "لیست پکیج‌ها",
          href: "/package_list",
          icon: (
            <div className="text-xl">
              <LuClipboardList />
            </div>
          ),
        },
        {
          name: "لیست فصل‌ها",
          href: "/season_list",
          icon: (
            <div className="text-xl">
              <LuClipboardList />
            </div>
          ),
        },
        {
          name: "لیست مراحل",
          href: "/stage_list",
          icon: (
            <div className="text-xl">
              <LuClipboardList />
            </div>
          ),
        },
        {
          name: "لیست کالکش‌ها",
          href: "/collection_list",
          icon: (
            <div className="text-xl">
              <LuClipboardList />
            </div>
          ),
        },
      ],
    },
    {
      name: "ثبت محتوای عمومی",
      href: "/dashboard/general",
      icon: (
        <div className="text-xl">
          <BsCloudPlusFill />
        </div>
      ),
      head:true,
      children: [
        {
          name: "تعریف زبان",
          href: "/add_language",
          icon: (
            <div className="text-xl">
              <BsCloudPlus />
            </div>
          ),
        },
        {
          name: "تعریف دسته‌بندی موضوع",
          href: "/add_topic_category",
          icon: (
            <div className="text-xl">
              <BsCloudPlus />
            </div>
          ),
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
      head:true,
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
                                head={item?.head == true?true:false}
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
