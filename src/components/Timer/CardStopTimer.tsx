import React from "react";

const CardStopTimer = ({
  dayCount,
  timerParentStyle,
  countersStyle,
  labelsStyle,
}: {
  dayCount: any;
  timerParentStyle?: string;
  countersStyle?: string;
  labelsStyle?: string;
}) => {
  return (
    dayCount != undefined && (
      <div>
        <div className={`${timerParentStyle} flex gap-x-2 w-full justify-center items-center`}>
          <div className="flex flex-col justify-center items-center">
            <div className={`${countersStyle} font-['iransans-black'] text-sm text-text5 dark:text-text5_dark`}>
              {dayCount && dayCount[3] < 10 ? `0${dayCount[3]}` : dayCount[3]}
            </div>
            <div className={`${labelsStyle} font-['iransans-md'] text-rgba1 text-[10px]`}>ثانیه</div>
          </div>
          <div className="flex flex-col justify-center items-center">
            <div className={`${countersStyle} font-['iransans-black'] text-sm text-text5 dark:text-text5_dark`}>
              {dayCount && dayCount[2] < 10 ? `0${dayCount[2]}` : dayCount[2]}
            </div>
            <div className={`${labelsStyle} font-['iransans-md'] text-rgba1 text-[10px]`}>دقیقه</div>
          </div>
          <div className="flex flex-col justify-center items-center">
            <div className={`${countersStyle} font-['iransans-black'] text-sm text-text5 dark:text-text5_dark`}>
              {dayCount && dayCount[1] < 10 ? `0${dayCount[1]}` : dayCount[1]}
            </div>
            <div className={`${labelsStyle} font-['iransans-md'] text-rgba1 text-[10px]`}>ساعت</div>
          </div>
          <div className="flex flex-col justify-center items-center">
            <div className={`${countersStyle} font-['iransans-black'] text-sm text-text5 dark:text-text5_dark`}>
              {dayCount && dayCount[0] == 0 ? `0` : dayCount[0]}
            </div>
            <div className={`${labelsStyle} font-['iransans-md'] text-rgba1 text-[10px]`}>روز</div>
          </div>
        </div>
      </div>
    )
  );
};

export default CardStopTimer;
