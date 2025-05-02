import React from "react";
import { FaCheck } from "react-icons/fa6";
import { HiOutlineChevronLeft } from "react-icons/hi";

const ShowFileFeature = ({
  type,
  feature,
  value,
  required,
  below_value,
  onPress,
}: {
  type: string;
  feature: string;
  value: any;
  required?: boolean;
  below_value?: number;
  onPress?: any;
}) => {
  return type == "other" ? (
    <div
      className={`${
        onPress && "hover:bg-border2 dark:hover:bg-border2_dark transition cursor-pointer select-none"
      } flex w-full items-center justify-between py-3`}
      onClick={() => {
        if (onPress) {
          onPress();
        }
      }}
    >
      <p className="font-['iransans-md'] text-text6 dark:text-text6_dark text-sm">{feature}</p>
      <div className="text-text4 dark:text-text4_dark">
        <HiOutlineChevronLeft />
      </div>
    </div>
  ) : (
    <div className="flex w-full items-center justify-between py-3">
      <p className="font-['iransans-md'] text-text6 dark:text-text6_dark text-sm">{feature}</p>
      {type == "bool" || type == "has" ? (
        required == false && value == true ? (
          <div className={`text-green_color`}>
            <FaCheck />
          </div>
        ) : (
          <p className="text-text dark:text-text_dark text-sm font-['iransans-md']">
            {value == true ? "دارد" : "ندارد"}
          </p>
        )
      ) : below_value == null ? (
        <p className="text-text dark:text-text_dark text-sm font-['iransans-md']">{value}</p>
      ) : (
        <div className="flex flex-col text-end">
          <p className="text-primary font-['iransans-md'] text-sm">{below_value}</p>
          <p className="line-through text-red_color font-['iransans-md'] text-xs">{value}</p>
        </div>
      )}
    </div>
  );
};

export default ShowFileFeature;
