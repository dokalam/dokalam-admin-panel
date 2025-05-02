import React from "react";
import { ThreeDots } from "react-loader-spinner";

const GradientButton = ({
  buttonText,
  onClickFn,
  type = "bold",
  classes,
  loading,
}: {
  buttonText: string;
  onClickFn: any;
  type?: string;
  classes?: string;
  loading?: boolean;
}) => {
  return (
    <button
      disabled={loading == true ? true : false}
      className={`${classes} w-full flex-1 rounded py-2 px-6 border-border text-xs sm:text-sm hover:opacity-80 transition text-primary_start focus:outline-none h-[38px] sm:h-[41px] font-['iransans-md']
  ${
    type == "bold"
      ? "bg-gradient-to-b from-primary_start to-primary_end text-white"
      : type == "border"
      ? "text-text dark:text-text_dark border border-border dark:border-border_dark bg-background dark:bg-background_dark hover:bg-background6 dark:hover:bg-background6_dark"
      : "bg-gradient-to-b from-primary_start to-primary_end text-white"
  }`}
      onClick={() => {
        onClickFn();
      }}
    >
      {loading ? (
        <ThreeDots
          visible={true}
          height="16"
          width="50"
          color="white"
          radius="9"
          ariaLabel="three-dots-loading"
          wrapperStyle={{}}
          wrapperClass="py-1 flex justify-center"
        />
      ) : (
        buttonText
      )}
    </button>
  );
};

export default GradientButton;
