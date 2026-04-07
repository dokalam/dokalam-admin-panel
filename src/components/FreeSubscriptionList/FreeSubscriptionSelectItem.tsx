"use client";

import React, { useEffect, useState } from "react";
import { FaCoins, FaUserLarge } from "react-icons/fa6";
import CheckBox from "../CheckBox";
import ImageComponent from "../ImageComponent";
import { IoDiamondSharp } from "react-icons/io5";

const FreeSubscriptionSelectItem = ({
  _id,
  type,
  private_users,
  admin,
  title,
  icon_image,
  duration,
  is_active,
  expiration,
  checked,
  numberSelect = 1,
  deletedItem,
  selectedItem,
}: {
  _id: string;
  type: string;
  private_users: any[];
  admin: any;
  title: string;
  icon_image?: string;
  duration: string;
  is_active: boolean;
  expiration: string;
  checked: boolean;
  numberSelect?: number;
  deletedItem: any;
  selectedItem: any;
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
        <div className="flex items-center">
          <div className="flex w-full items-center justify-between">
            {
              icon_image?
              <ImageComponent
                parentclasses="w-16 h-16 lg:h-16 lg:w-16 2xl:h-24 2xl:w-24 !rounded-xl"
                imageClasses="!rounded-xl"
                src={icon_image}
              />
              :
              <div className="flex w-16 h-16 lg:h-16 lg:w-16 2xl:h-24 2xl:w-24 !rounded-xl bg-green_color items-center justify-center">
                <IoDiamondSharp className="w-8 h-8 lg:h-12 lg:w-12 2xl:h-16 2xl:w-16"/>
              </div>
            }
            <div className="flex-1 pr-3 flex flex-col justify-between gap-y-[6px]">
                <p className="text-[14px] 2xl:text-[16px] font-['iransans-md'] text-text dark:text-text_dark line-clmp-1">
                  {title}
                </p>
                <p className="text-[10px] 2xl:text-[12px] font-['iransans-md'] text-text5 dark:text-text5_dark line-clamp-1">
                  {"نوع آیتم : "}
                  <span className="text-warning">{type == "private"?"خصوصی":type == "public"?"عمومی":""}</span>
                </p>
                <p className="text-[14px] 2xl:text-[16px] font-['iransans-md'] text-primary">
                  {`${duration} روز اشتراک`}
                  {is_active === false&& <span className="text-warning"> ( غیر فعال )</span>}
                </p>
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
        <div>
          {
            private_users?.length > 0&&
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-y-[4px] gap-x-[4px] rounded-md py-[2px] mt-4">
            {
              private_users?.map((item:any, index:number)=>(
                <div key={index.toString()} className="flex flex-col items-center gap-[2px] border border-border dark:border-border_dark rounded-md py-[5px]">
                  <FaUserLarge className="text-info"/> 
                  <div className="mt-[4px]">
                    {item?.user_name&&<p className="text-xs text-center font-['iransans-md'] text-text dark:text-text_dark w-22 sm:w-32 3xs:w-24">{item.user_name}</p>}
                    {item?.phone&&<p className="text-xs text-center font-['iransans-md'] text-text dark:text-text_dark w-22 sm:w-32 3xs:w-24">{item.phone}</p>}
                    {(item?.first_name || item?.last_name)&&<p className="text-xs text-center font-['iransans-md'] text-text dark:text-text_dark w-22 sm:w-32 3xs:w-24">{`${item?.first_name??""} ${item?.last_name??""}`}</p>}
                  </div>
                </div>
              ))
            }
            </div>
          }
          <p className="text-[12px] 2xl:text-[14px] font-['iransans-md'] text-text5 dark:text-text5_dark line-clamp-1 mt-4">
            {`تاریخ انقضا : `}
            <span className="text-info">{expiration}</span>
          </p>
          <p className="text-[12px] 2xl:text-[14px] font-['iransans-md'] text-text5 dark:text-text5_dark line-clamp-1">
            {`ادمین : ${admin?.first_name} ${admin?.last_name}`}
          </p>
        </div>
    </div>
  );
};

export default FreeSubscriptionSelectItem;
