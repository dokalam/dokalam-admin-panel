import React from "react";
import Countdown from "react-countdown";

const CardTimer = ({ date, timerParentStyle }: { date: any; timerParentStyle?: string }) => {
  const renderer = ({
    days,
    hours,
    minutes,
    seconds,
    completed,
  }: {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
    completed: boolean;
  }) => {
    return completed == true ? (
      <div className="h-full w-full flex justify-center items-center">
        <div className="rounded border border-dashed border-border dark:border-border_dark text-[10px] font-['iransans-light'] text-primary px-2 py-1">
          پایان نمایش زیر قیمت
        </div>
      </div>
    ) : (
      <div className={`${timerParentStyle} flex gap-x-2 w-full justify-center items-center`}>
        <div className="flex flex-col justify-center">
          <div className="font-['iransans-black'] text-sm text-text2 dark:text-text2_dark">
            {seconds < 10 ? `0${seconds}` : seconds}
          </div>
          <div className="font-['iransans-md'] text-primary text-[10px]">ثانیه</div>
        </div>
        <div className="flex flex-col justify-center">
          <div className="font-['iransans-black'] text-sm text-text2 dark:text-text2_dark">
            {minutes < 10 ? `0${minutes}` : minutes}
          </div>
          <div className="font-['iransans-md'] text-primary text-[10px]">دقیقه</div>
        </div>
        <div className="flex flex-col justify-center">
          <div className="font-['iransans-black'] text-sm text-text2 dark:text-text2_dark">
            {hours < 10 ? `0${hours}` : hours}
          </div>
          <div className="font-['iransans-md'] text-primary text-[10px]">ساعت</div>
        </div>
        <div className="flex flex-col justify-center">
          <div className="font-['iransans-black'] text-sm text-text2 dark:text-text2_dark">{days == 0 ? `0` : days}</div>
          <div className="font-['iransans-md'] text-primary text-[10px]">روز</div>
        </div>
      </div>
    );
  };

  return (
    <div className="h-full">
      <Countdown date={new Date(date).getTime()} renderer={renderer} />
    </div>
  );
};

export default CardTimer;
