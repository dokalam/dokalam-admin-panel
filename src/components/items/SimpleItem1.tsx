import React from "react";
import ImageComponent from "../ImageComponent";
import { HiOutlineChevronLeft } from "react-icons/hi";
import Image from "next/image";

const SimpleItem1 = ({
  title,
  image,
  icon,
  arrow,
  onClickFn,
  classes,
  disabled,
  arrowStyle,
  titleStyle,
  parentClasses,
  value,
  imageClasses,
  iconClasses,
  valueClasses,
  localImage,
}: {
  title?: string;
  image?: string;
  icon?: any;
  arrow?: boolean;
  onClickFn?: any;
  classes?: string;
  disabled?: boolean;
  arrowStyle?: string;
  titleStyle?: string;
  parentClasses?: string;
  value?: any;
  imageClasses?: string;
  iconClasses?: string;
  valueClasses?: string;
  localImage?: string;
}) => {
  return (
    <div
      className={`${parentClasses} ${onClickFn && "hover:bg-border2 dark:hover:bg-border2_dark transition cursor-pointer"} ${
        disabled == true && "pointer-events-none"
      } border-b border-border dark:border-border_dark select-none`}
    >
      <div
        className={`${classes} flex items-center justify-between font-['iransans-md'] py-4 transition h-[44px] sm:h-[50px] text-text dark:text-text_dark text-sm rounded-t`}
        onClick={onClickFn}
      >
        <div className="flex gap-2 items-center">
          {image ? (
            <ImageComponent src={image} parentclasses={`${imageClasses} w-7 h-7`} />
          ) : icon ? (
            <div
              className={`text-xl ${iconClasses} w-7 h-7 flex items-center justify-center ${
                disabled == true ? "text-border dark:text-border_dark" : "text-text6 dark:text-text6_dark"
              }`}
            >
              {" "}
              {icon}
            </div>
          ) : localImage ? (
            <div className={`${imageClasses}`}>
              <Image src={localImage} alt="localImage" />
            </div>
          ) : null}
          <p
            className={`${titleStyle} ${
              disabled == true ? "text-border dark:text-border_dark" : "text-text6 dark:text-text6_dark"
            }`}
          >
            {title}
          </p>
        </div>
        <div className={`${disabled ? "text-border dark:text-border_dark" : "text-text dark:text-text_dark"}`}>
          {value ? (
            <p className={`${valueClasses}`}>{value}</p>
          ) : arrow ? (
            <div className={`${arrowStyle} `}>
              <HiOutlineChevronLeft />
            </div>
          ) : (
            ""
          )}
        </div>
      </div>
    </div>
  );
};

export default SimpleItem1;
