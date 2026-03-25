import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import ImageComponent from "@/components/ImageComponent";
import { HiDotsVertical, HiEyeOff, HiEye, HiOutlineEyeOff, HiOutlineTrash } from "react-icons/hi";
import { IoNotificationsOff, IoNotifications, IoDiamondSharp } from "react-icons/io5";
import { FaUserLarge, FaCoins} from "react-icons/fa6";
import axios from "axios";
import { toast } from "react-toastify";
import DialogHelper from "@/components/Dialog/DialogHelper";
import GradientButton from "@/components/GradientButton";
import { priceDigitSeperator } from "@/utils/PriceDigitSeparator";

const UserItem = ({
  _id,
  type,
  phone,
  user_name,
  first_name,
  last_name,
  number_coins,
}: {
  _id: string;
  type: string;
  phone?: string;
  user_name: string;
  first_name?: string;
  last_name?: string;
  number_coins: number;
}) => {
    const router = useRouter();
    const userId = _id




    return (
        <div 
        className={`relative w-full p-4 rounded-2xl shadow-bottom dark:shadow-bottom-dark m-1 bg-background5 dark:bg-background5_dark flex flex-col gap-4 border-[1px] border-border dark:border-border_dark`}
        >
            <div className="flex flex-row items-center gap-4">
                <FaUserLarge className="text-info text-[35px] 2xl:text-[40px]"/>
                <div>
                    <h3 className="text-[14px] 2xl:text-[16px] font-['iransans-md-en'] text-text dark:text-text_dark line-clmp-1">
                        {`${user_name}`}
                    </h3>
                    <p className="text-[10px] 2xl:text-[12px] font-['iransans-md'] text-info line-clamp-1">
                    {type == "guest"?"کاربر میهمان":type == "registered"?"کاربر ثبت نام شده":""}
                    </p>
                </div>
            </div>
            <p className="text-[12px] 2xl:text-[14px] font-['iransans-md'] text-text dark:text-text_dark line-clmp-1">
                <span className="text-text5 dark:text-text5_dark">شماره موبایل : </span>
                {phone??""}
            </p>
            <div className="flex flex-row items-center gap-4">
                <p className="text-[12px] 2xl:text-[14px] font-['iransans-md'] text-text dark:text-text_dark line-clmp-1 w-[40%]">
                    <span className="text-text5 dark:text-text5_dark">نام : </span>
                    {first_name??""}
                </p>
                <p className="text-[12px] 2xl:text-[14px] font-['iransans-md'] text-text dark:text-text_dark line-clmp-1 w-[60%]">
                    <span className="text-text5 dark:text-text5_dark">نام خانوادگی : </span>
                    {last_name??""}
                </p>
            </div>
            <p className="text-[12px] 2xl:text-[14px] font-['iransans-md'] text-warning line-clmp-1">
                <span className="text-text5 dark:text-text5_dark">تعداد سکه : </span>
                {number_coins?priceDigitSeperator(number_coins):""}
            </p>
            <div className="flex flex-row w-full items-center justify-center">
                <GradientButton
                    buttonText={"مدیریت حساب"}
                    onClickFn={()=>{router.push(`/dashboard/users/user-list/user-account/${userId}`)}}
                    loading={false}
                    type="border"
                    classes="!text-base !px-8 !w-full"
                />
            </div>
        </div>
    );
};

export default UserItem;