"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";
import { IoChevronDown, IoChevronUp } from "react-icons/io5";

function classNames<ElementType>(...classes: ElementType[]) {
  return classes.filter(Boolean).join(" ");
}

const SideBarItem2 = ({ item, activeItem, setActiveItem }: { item: any; activeItem: string; setActiveItem: any }) => {
  const [showChildren, setShowChildren] = useState<boolean>(false);

  const pathName = usePathname();
  useEffect(() => {
    if (item?.children?.length > 0) {
      for (let i = 0; i < item?.children?.length; i++) {
        const element = item?.children[i];
        if (element.href == pathName) {
          setShowChildren(true);
        }
      }
    } else if (pathName == item?.href) {
      setShowChildren(true);
    }
  }, [activeItem]);

  return (
    <li
      key={item?.name}
      onClick={() => {
        if (item?.children?.length > 0) {
          setShowChildren((last) => !last);
        } else {
          setActiveItem(activeItem && item.name);
        }
      }}
    >
      <Link
        href={item?.children?.length > 0 ? "" : item?.href}
        className={classNames(
          item?.name == activeItem
            ? "dark:bg-background6_dark bg-background6 dark:text-text_dark text-black"
            : "text-text dark:text-text_dark hover:text-text dark:hover:text-text3_dark dark:hover:xs:bg-background6_dark hover:xs:bg-background6",
          "flex items-center p-2 rounded-md gap-2 justify-between"
        )}
      >
        <div className={`flex items-center ${item?.icon && "gap-2"}`}>
          <div className={`${item.name == activeItem ? "text-primary" : "text-text6 dark:text-text6_dark"}`}>
            {item.name == activeItem ? item.active_icon : item.icon}
          </div>
          <span>{item.name}</span>
        </div>

        {item?.children?.length > 0 && showChildren ? (
          <IoChevronDown className="text-lg" />
        ) : item?.children?.length > 0 ? (
          <IoChevronUp className="text-lg" />
        ) : (
          <div />
        )}
      </Link>
      {item?.children?.length > 0 && showChildren && (
        <div className="pr-8">
          {item.children.map((child: any, index: number) => (
            <Link
              href={child.href}
              className={classNames(
                child.name == activeItem
                  ? "dark:bg-background6_dark bg-background6 dark:text-text_dark text-black"
                  : "text-text4 dark:text-text4_dark hover:text-text dark:hover:text-text3_dark dark:hover:xs:bg-background6_dark hover:xs:bg-background6",
                "flex items-center p-2 rounded-md gap-2 cursor-pointer mt-2 text-sm"
              )}
              key={`${child}${index}`}
            >
              {child.name}
            </Link>
          ))}
        </div>
      )}
    </li>
  );
};

export default SideBarItem2;
