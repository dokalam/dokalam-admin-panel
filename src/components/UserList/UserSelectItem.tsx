"use client";

import React, { useEffect, useState } from "react";
import { FaUserLarge } from "react-icons/fa6";
import CheckBox from "../CheckBox";

const UserSelectItem = ({
  _id,
  type,
  phone,
  user_name,
  name,
  number_coins,
  checked,
  numberSelect = 1,
  deletedItem,
  selectedItem,
}: {
  _id: any;
  type: string;
  phone?: any;
  user_name: string;
  name?: any;
  number_coins: number;
  checked: boolean;
  deletedItem: any;
  selectedItem: any;
  numberSelect?: number;
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
            <FaUserLarge className="text-info text-[35px] 2xl:text-[40px]"/>
            <div className="flex-1 pr-3 flex flex-col justify-between">
              <div className="items-center flex-col">
                <h3 className="text-[14px] 2xl:text-[16px] font-['iransans-md'] text-text dark:text-text_dark line-clmp-1">
                 {user_name?`${user_name}`:""}
                 {phone?<span className="text-warning"> | </span>:""}
                 {phone?`${phone}`:""}
                 {name?<span className="text-warning"> | </span>:""}
                 {name?`${name}`:""}
                </h3>
                <h3 className="text-[10px] 2xl:text-[12px] font-['iransans-md'] text-text5 dark:text-text5_dark line-clamp-1">
                  {type == "guest"?"کاربر میهمان":type == "registered"?"کاربر ثبت نام شده":""}
                </h3>
                <h3 className="text-[12px] 2xl:text-[14px] font-['iransans-md'] text-primary">
                  {`تعداد سکه : ${number_coins}`}
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

export default UserSelectItem;
