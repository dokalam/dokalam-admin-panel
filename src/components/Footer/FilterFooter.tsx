import React from "react";
import GradientButton from "../GradientButton";

const FilterFooter = ({
  buttonText,
  buttonFn,
  loadingButton,
  classes,
}: {
  buttonText: string;
  buttonFn: any;
  loadingButton: boolean;
  classes?: string;
}) => {
  return (
    <div
      className={`${classes ?? ""} items-center justify-center z-[1000] bg-background2 dark:bg-background2_dark flex py-2 px-4 shadow-top dark:shadow-top-dark`}
    >
      <GradientButton
        buttonText={buttonText}
        onClickFn={buttonFn}
        loading={loadingButton}
        classes="!text-base !flex-none !px-8 !w-full"
      />
    </div>
  );
};

export default FilterFooter;
