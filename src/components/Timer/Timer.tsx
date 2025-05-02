import React from "react";
import Countdown from "react-countdown";

const Timer = ({ date }: { date: any }) => {
  const renderer = ({
    days,
    hours,
    minutes,
    seconds,
  }: {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  }) => {
    return (
      <div className="flex gap-x-3 w-full justify-center items-center mt-2">
        <div className="flex flex-col justify-center">
          <div className="font-['iransans-black'] text-3xl text-text2 dark:text-text2_dark">
            {seconds < 10 ? `0${seconds}` : seconds}
          </div>
          <div className="font-['iransans-md'] text-primary text-sm text-center">ثانیه</div>
        </div>
        <div className="flex flex-col justify-center">
          <div className="font-['iransans-black'] text-3xl text-text2 dark:text-text2_dark">
            {minutes < 10 ? `0${minutes}` : minutes}
          </div>
          <div className="font-['iransans-md'] text-primary text-sm text-center">دقیقه</div>
        </div>
        <div className="flex flex-col justify-center">
          <div className="font-['iransans-black'] text-3xl text-text2 dark:text-text2_dark">
            {hours < 10 ? `0${hours}` : hours}
          </div>
          <div className="font-['iransans-md'] text-primary text-sm text-center">ساعت</div>
        </div>
        <div className="flex flex-col justify-center">
          <div className="font-['iransans-black'] text-3xl text-text2 dark:text-text2_dark">{days == 0 ? `0` : days}</div>
          <div className="font-['iransans-md'] text-primary text-sm text-center">روز</div>
        </div>
      </div>
    );
  };

  return (
    <div>
      <Countdown date={new Date(date).getTime()} renderer={renderer} />
    </div>
  );
};

export default Timer;
