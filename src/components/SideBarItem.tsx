import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";
import { IoChevronDown, IoChevronUp } from "react-icons/io5";

function classNames<ElementType>(...classes: ElementType[]) {
  return classes.filter(Boolean).join(" ");
}

const SideBarItem = ({
  name,
  href,
  child,
  active,
  closeDrawer,
  icon,
  head,
}: {
  name: string;
  href: string;
  child: [];
  active: boolean;
  closeDrawer?: any;
  icon?: any;
  head?:boolean
}) => {
  const pathName = usePathname();
  const [open, setOpen] = useState(child?.length > 0 && active == true ? true : false);
  const [activeItem, setActiveItem] = useState(active);
  const [path, setPath] = useState(pathName);

  useEffect(() => {
    setActiveItem(active);
  }, [active]);

  useEffect(() => {
    setPath(pathName);
  }, [pathName]);

  const handleItemClick = () => {
    setOpen((last) => !last);
  };

  return (
    <div className="w-full flex flex-col items-end">
      <li className="w-full">
        {child?.length > 0 ? (
          <div
            className={classNames(
              activeItem
                ? "!text-primary"
                : "text-text dark:text-text_dark hover:text-text dark:hover:text-text3_dark dark:hover:xs:bg-background6_dark hover:xs:bg-background6",
              "",
              "flex items-center p-2 h-[45px] rounded-md gap-2 justify-between text-xs cursor-pointer mb-1"
            )}
            onClick={handleItemClick}
          >
            <div className={`flex items-center gap-1`}>
              {icon && <div className={`ml-2 ${active ? "text-primary" : "text-text6 dark:text-text6_dark"}`}>{icon}</div>}
              <span>{name}</span>
            </div>

            {open ? <IoChevronDown className="text-lg" /> : <IoChevronUp className="text-lg" />}
          </div>
        ) : (
          <Link
            href={href}
            onClick={() => {
              setActiveItem(true);
              if (closeDrawer) closeDrawer();
            }}
            className={classNames(
              activeItem
                ? "dark:bg-background6_dark bg-background6 dark:text-text_dark !text-primary"
                :head == true?"text-text dark:text-text_dark hover:text-text dark:hover:text-text3_dark dark:hover:xs:bg-background6_dark hover:xs:bg-background6":
                "text-text4 dark:text-text4_dark hover:text-text dark:hover:text-text3_dark dark:hover:xs:bg-background6_dark hover:xs:bg-background6",
              "flex items-center p-2 h-[45px] rounded-md gap-2 justify-between text-xs"
            )}
          >
            <div className={`flex items-center gap-1`}>
              {icon && <div className={`ml-2 ${active ? "text-primary" : "text-text6 dark:text-text6_dark"}`}>{icon}</div>}
              <span>{name}</span>
            </div>
          </Link>
        )}
      </li>
      {child?.length > 0 && open == true && (
        <div className="w-11/12 flex items-end flex-col text-xs gap-1">
          {child.map((item: any, index: number) => (
            <div className="w-full h-[45px]" key={`${item}${index}`}>
              <SideBarItem
                name={item?.name}
                href={`${href}${item?.href}`}
                active={path.includes(`${href}${item?.href}`) ? true : false}
                child={item?.children?.length > 0 ? item?.children : []}
                closeDrawer={closeDrawer}
                icon={item?.icon}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SideBarItem;
