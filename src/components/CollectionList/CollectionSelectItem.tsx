"use client";

import React, { useEffect, useState } from "react";
import { FaUserLarge, FaUserTie } from "react-icons/fa6";
import ImageComponent from "../ImageComponent";
import CheckBox from "../CheckBox";

const CollectionSelectItem = ({
  _id,
  title,
  checked,
  deletedItem,
  selectedItem,
  numberSelect = 1,
  list,
}: {
  _id: any;
  title: any;
  checked: boolean;
  deletedItem: any;
  selectedItem: any;
  numberSelect?: number;
  list?:any;
}) => {
  const [select, setSelect] = useState(checked);

  useEffect(() => {
    setSelect(checked);
  }, [checked]);

  const selectItem = () => {
    if (select == true) {
      setSelect(false);
      const time = setTimeout(() => {
        deletedItem();
        clearTimeout(time);
      }, 150);
    } else {
      setSelect(true);
      const time = setTimeout(() => {
        if (selectedItem() == false) {
          setSelect(false);
        }
        clearTimeout(time);
      }, 150);
    }
  };

  const scrollHorizontal = (e: any) => {
    if (typeof window !== "undefined") {
      const activeFiltersWrapper = document.getElementById("selectedContacts-wrapper");
      activeFiltersWrapper?.scrollBy({
        left: e.deltaY < 0 ? 200 : -200,
        behavior: "smooth",
      });
    }
  };

  return (
    <>
      <div className="py-4 select-none" onClick={selectItem}>
        <div>
          <div className="flex items-center">
            <div className="flex w-full items-center justify-between">
              
              <div className="flex-1 pr-3 flex flex-col justify-between">
                <div className="flex items-center">
                  <h3 className="text-sm 2xl:text-base font-['iransans-md'] text-text dark:text-text_dark line-clamp-1">
                    {title}
                  </h3>
                </div>
                <div className="flex items-center w-full">
                  <p
                    className={`text-[10px] 2xl:text-xs font-['iransans-md'] text-primary`}
                  >
                    
                  </p>
                </div>
              </div>
            </div>

            {numberSelect > 1 ? (
              <CheckBox checked={select} id={_id} onChange={selectItem} />
            ) : (
              <div className="relative !w-[20px] !h-[20px] !box-border flex justify-center items-center border-2 border-primary rounded-full">
                <input
                  type="radio"
                  checked={select}
                  id={_id}
                  onChange={selectItem}
                  className={`radio-button-input focus:outline-none hidden`}
                />
                <div className="radio-button rounded-full absolute top-0 bottom-0 right-0 left-0 flex items-center justify-center z-[1000]">
                  <span className="bg-primary h-[9.5px] w-[9.5px] rounded-full"></span>
                </div>
              </div>
            )}
          </div>
        </div>
        <div />
      </div>
      {list?.length > 0 && (
        <div
          id={`collection-list-wrapper-${_id}`}
          onWheel={scrollHorizontal}
          className="z-[1000] sm:z-auto flex font-['iransans-md'] text-xs gap-3 overflow-x-auto no-scrollbar px-4 pb-2 max-w-lg 2xl:max-w-2xl"
        >
          {list.map((item: any, index: number) => (
            <div>
                <ImageComponent
                  src={item.icon_image}
                  alt={"file_photos"}
                  parentclasses="h-12 w-12 cursor-pointer"
                />
                <p>{item.title}</p>
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default CollectionSelectItem;
