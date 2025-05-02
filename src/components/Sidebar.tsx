"use client";

import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import SideBarItem from "./SideBarItem";
import { AiFillDashboard } from "react-icons/ai";

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
    children: [
      {
        name: "ساخت فصل جدید",
        href: "/register_new_season",
      },
      {
        name: "ساخت مرحله جدید",
        href: "/register_new_stage",
      },
    ],
  },
  {
    name: "محتوای بازی بسته‌ای",
    href: "/dashboard/package_game",
    children: [
      {
        name: "ساخت بسته بازی جدید",
        href: "/register_new_package_game",
      },
      {
        name: "ساخت فصل جدید",
        href: "/register_new_season",
      },
      {
        name: "ساخت مرحله جدید",
        href: "/register_new_stage",
      },
    ],
  },
  {
    name: "مدیریت کاربران",
    href: "/dashboard/users",
    children: [
      {
        name: "لیست کاربران",
        href: "/user_list",
      },
    ],
  },
  {
    name: "مدیریت دسته بندی",
    href: "/dashboard/category",
    children: [
      {
        name: "ایجاد زبان جدید",
        href: "/manage_language",
      },
      {
        name: "ایجاد تگ جدید",
        href: "/manage_tag",
      },
    ],
  },
];
const dark = typeof window !== "undefined" && localStorage.getItem("theme");
const Sidebar = () => {
  const pathName = usePathname();
  const [path, setPath] = useState(pathName);

  useEffect(() => {
    if (pathName) {
      setPath(pathName);
    }
  }, [pathName]);

  return (
    <div
      className={`select-none w-60 transition-all duration-300 ease-in-out hidden md:fixed md:inset-y-0 md:z-[100] md:flex sm:flex-col border-l border-border dark:border-border_dark font-['iransans-light']`}
    >
      <div
        className={`flex grow flex-col gap-y-5 border-r border-border dark:border-border_dark bg-background2 dark:bg-background2_dark px-4 pb-4  overflow-y-auto ${
          dark == "dark" ? "custom-scrollbar-dark" : "custom-scrollbar"
        }`}
      >
        <div className="flex justify-center h-16 shrink-0 items-center">
          <h1
            className={`bg-gradient-to-r primaryGradient from-primary_start to-primary_end bg-clip-text text-transparent text-[2.4rem] mt-4 font-black items-center text-center font-['iransans-black']`}
          >
            MenuMelk
          </h1>
        </div>
        <nav className={`w-full flex self-center flex-1 flex-col`}>
          <ul role="list" className="flex flex-1 flex-col gap-y-7">
            <li>
              <ul role="list" className="flex flex-col gap-1 font-iransans-md">
                {navigation.map((item: any, index: number) => (
                  <SideBarItem
                    key={`${item}${index}`}
                    name={item?.name}
                    href={item?.href}
                    child={item?.children?.length > 0 ? item?.children : []}
                    active={path.includes(item?.href) ? true : false}
                    icon={item?.icon}
                  />
                ))}
              </ul>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
};
export default Sidebar;
