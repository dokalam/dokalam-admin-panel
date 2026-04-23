"use client";

import React, { useEffect, useState } from "react";
import { FaUserLarge, FaUserTie } from "react-icons/fa6";
import ImageComponent from "../ImageComponent";
import CheckBox from "../CheckBox";

const PackageSelectItem = ({
  _id,
  title,
  checked,
  deletedItem,
  selectedItem,
  numberSelect = 1,
  imageSrc,
}: {
  _id: any;
  title: any;
  checked: boolean;
  deletedItem: any;
  selectedItem: any;
  numberSelect?: number;
  imageSrc?: any
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

  return (
    <div className="py-4 select-none" onClick={selectItem}>
      <div>
        <div className="flex items-center">
          <div className="flex w-full items-center justify-between">
            <ImageComponent
              parentclasses="w-12 h-12 lg:h-18 lg:w-18 2xl:h-18 2xl:w-18 !rounded-xl"
              imageClasses="!rounded-xl"
              src={imageSrc}
            />
            <div className="flex-1 pr-3 flex flex-col justify-between">
              <div className="flex items-center">
                <h3 className="text-sm 2xl:text-base font-['iransans-md'] text-text dark:text-text_dark line-clamp-1">
                  {title}
                </h3>
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
  );
};

export default PackageSelectItem;
