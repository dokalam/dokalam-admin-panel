import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useEffect, useState } from "react";
import SideBarItem from "./SideBarItem";
import { usePathname } from "next/navigation";
import { AiFillDashboard } from "react-icons/ai";

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
      name: "مدیریت آژانس‌ها",
      href: "/dashboard/agency_management",
      children: [
        {
          name: "درخواست‌های ثبت نام (جدید)",
          href: "/new_register_requests",
        },
        {
          name: "درخواست‌های ثبت نام (رد شده)",
          href: "/rejected_register_requests",
        },
        {
          name: "لیست آژانس‌ها",
          href: "/agency_list",
        },
      ],
    },
    {
      name: "مدیریت مشاوران",
      href: "/dashboard/agent_management",
      children: [
        {
          name: "لیست مشاوران",
          href: "/agent_list",
        },
      ],
    },
    {
      name: "مدیریت آگهی",
      href: "/dashboard/ads_management",
      children: [
        {
          name: "آگهی‌های جدید (آژانس‌ها)",
          href: "/new_agency_ads",
        },
        {
          name: "آگهی‌های جدید (کاربران)",
          href: "/new_user_ads",
        },
        {
          name: "آگهی‌های ویرایش شده (آژانس‌ها)",
          href: "/edited_agency_ads",
        },
        {
          name: "آگهی‌های ویرایش شده (کاربران)",
          href: "/edited_user_ads",
        },
        {
          name: "درخواست‌های زیر قیمت",
          href: "/below_price_requests",
        },
      ],
    },
    {
      name: "فروشگاه منوملک",
      href: "/dashboard/products",
      children: [
        {
          name: "سفارشات جدید",
          href: "/new_orders",
        },
        {
          name: "در حال آماده‌سازی",
          href: "/preparing",
        },
        {
          name: "ارسال شده‌ها",
          href: "/sent",
        },
        {
          name: "تحویل داده شده‌ها",
          href: "/delivered",
        },
        {
          name: "پرداخت‌های ناموفق",
          href: "/failed",
        },
        {
          name: "تعریف محصول جدید",
          href: "/add_new_product",
        },
      ],
    },
  ];

  return (
    <>
      <Transition show={isOpenSidebar} as={Fragment}>
        <Dialog as="div" className="relative z-[900]" onClose={closeSidebarFn}>
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
                    className={`h-full flex grow flex-col gap-y-5 border-border dark:border-border_dark bg-background2 dark:bg-background2_dark px-6 pb-4 font-iransans-md overflow-y-auto ${
                      dark == "dark" ? "custom-scrollbar-dark" : "custom-scrollbar"
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
