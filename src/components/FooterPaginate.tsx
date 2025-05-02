import Globals from "@/utils/Globals";
import React from "react";
import { ThreeDots } from "react-loader-spinner";

const FooterPaginate = ({
  loading,
  footerTry,
  tryOperation,
}: {
  loading: boolean;
  footerTry: boolean;
  tryOperation: any;
}) => {
  return (
    <div className="py-10 mb-8 flex justify-center">
      {footerTry ? (
        <button
          className="border border-primary px-10 py-2 rounded text-primary_start font-['iransans-md'] hover:bg-primary_start
        hover:text-white transition"
          onClick={tryOperation}
        >
          تلاش دوباره
        </button>
      ) : loading ? (
        <ThreeDots
          visible={true}
          height="30"
          width="70"
          color={Globals.data.configs.colors.primary}
          radius="9"
          ariaLabel="three-dots-loading"
          wrapperStyle={{}}
          wrapperClass="py-1 flex justify-center"
        />
      ) : (
        ""
      )}
    </div>
  );
};

export default FooterPaginate;
