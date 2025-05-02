import React from "react";
import { IoAlertCircleOutline } from "react-icons/io5";

const LabelItem = ({
  label,
  value,
  placeholder,
  classes,
  onClickFn,
  showRequired,
  required,
}: {
  label: string;
  value?: string;
  placeholder?: string;
  classes?: string;
  onClickFn?: any;
  showRequired?: boolean;
  required?: boolean;
}) => {
  return (
    <div className="border-b border-border dark:border-border_dark hover:bg-border2 dark:hover:bg-border2_dark select-none">
      <div
        className={`${classes} flex items-center justify-between font-['iransans-md'] py-4 
      cursor-pointer transition h-[44px] sm:h-[50px] text-text dark:text-text_dark text-sm rounded-t`}
        onClick={onClickFn}
      >
        <p className="text-text6 dark:text-text6_dark">{label}</p>
        <p
          className={`${
            value ? "text-text dark:text-text_dark" : "text-text5 dark:text-text5_dark text-xs"
          } `}
        >
          {value ? value : placeholder}
        </p>
      </div>
      {showRequired == true && required == true && value == null && (
        <div className="flex items-center gap-2 text-red_error">
          <div className="text-sm">
            <IoAlertCircleOutline />
          </div>
          <p className="text-[12px] font-['iransans-light']">تعیین این مورد الزامی است</p>
        </div>
      )}
    </div>
  );
};

export default LabelItem;
