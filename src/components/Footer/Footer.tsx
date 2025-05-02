import React from "react";
import GradientButton from "../GradientButton";

const Footer = ({
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
      className={`${classes} z-[1000] fixed bottom-0 right-0 left-0 bg-background2 dark:bg-background2_dark flex items-center justify-between py-2 sm:py-3 px-4`}
    >
      <GradientButton
        buttonText={buttonText}
        onClickFn={buttonFn}
        loading={loadingButton}
        classes="!text-sm !flex-none !px-8 sm:!w-[137px] !w-full"
      />
    </div>
  );
};

export default Footer;
