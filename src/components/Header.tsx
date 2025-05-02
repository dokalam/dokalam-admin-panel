"use client";
import React, { useEffect, useState, Fragment } from "react";
import { useTheme } from "next-themes";
import { Menu, Transition } from "@headlessui/react";
import { BsSun } from "react-icons/bs";
import { RxHamburgerMenu } from "react-icons/rx";
import { GoMoon } from "react-icons/go";
import MobileSidebar from "./MobileSidebar";
import { usePathname } from "next/navigation";

const userNavigation = [
  { name: "مشاهده پروفایل", href: "#" },
  { name: "خروج", href: "#" },
];

function classNames<ElementType>(...classes: ElementType[]) {
  return classes.filter(Boolean).join(" ");
}

export default function Header() {
  const { theme, setTheme } = useTheme();
  const [mode, setMode] = useState<any>();
  useEffect(() => {
    setMode(theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(mode === "light" ? "dark" : "light");
    setMode(mode === "light" ? "dark" : "light");
  };
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const openMobileSidebar = () => {
    setSidebarOpen(true);
  };

  const closeModalSidebar = () => {
    setSidebarOpen(false);
  };

  const pathName = usePathname();

  return (
    <div
      className={`${pathName.includes("ad") == true && "hidden sm:block"
        } sticky top-0 left-0 right-0 z-30 sm:px-6 px-4 pb-1 border-b shadow border-border dark:border-border_dark bg-background2 dark:bg-background2_dark`}
    >
      <div className="">
        <div className="flex h-14 items-center gap-x-4 sm:gap-x-6 ">
          <div
            className={`flex md:hidden text-text6 dark:text-text6_dark cursor-pointer transition hover:sm:bg-background6 dark:sm:hover:bg-background6_dark text-[22px] justify-center items-center p-2.5 rounded hover:bg-background6 dark:hover:bg-background6_dark w-11 h-11 my-2`}
            onClick={() => openMobileSidebar()}
          >
            <RxHamburgerMenu className={`h-5 w-5`} />
          </div>

          <div className="flex flex-1 justify-end">
            <div className="flex items-center">
              <div
                className="flex text-[22px] justify-center items-center p-2.5 rounded text-text6 dark:text-text6_dark cursor-pointer transition hover:bg-background6 dark:hover:bg-background6_dark w-11 h-11 my-2"
                onClick={toggleTheme}
              >
                {mode == "dark" ? <BsSun /> : <GoMoon />}
              </div>
            </div>
          </div>
        </div>
      </div>
      <MobileSidebar isOpenSidebar={sidebarOpen} closeSidebarFn={closeModalSidebar} />
    </div>
  );
}
