import { ThreeDots } from "react-loader-spinner";
import Globals from "@/utils/Globals";

const ScreenLoading = ({ getError, notItem, tryAgain }: { getError: boolean; notItem: boolean; tryAgain: () => any }) => {
  return (
    <div className="flex flex-col justify-center items-center">
      {getError ? (
        <div className="text-center">
          <h2 className="font-['iransans-md'] text-xl text-text dark:text-text_dark">ارتباط برقرار نشد</h2>
          <p className="font-['iransans-light'] my-4 text-sm text-text dark:text-text_dark">
            متأسفانه مشکلی پیش آمد. لطفا دوباره تلاش کنید.
          </p>
          <button
            className="font-['iransans-md'] bg-gradient-to-b from-primary_start to-primary_end rounded text-white py-[.6rem] px-14 mt-3 hover:opacity-80 transition"
            onClick={tryAgain}
          >
            تلاش مجدد
          </button>
        </div>
      ) : notItem ? (
        <div className="text-center">
          <h2 className="font-['iransans-md'] text-xl text-text dark:text-text_dark">موردی یافت نشد</h2>
          <p className="font-['iransans-light'] my-4 text-sm text-text dark:text-text_dark">موردی برای نمایش یافت نشد</p>
          <button
            className="font-['iransans-md'] bg-gradient-to-b from-primary_start to-primary_end rounded text-white py-[.6rem] px-14 mt-3 hover:opacity-80 transition"
            onClick={tryAgain}
          >
            تلاش مجدد
          </button>
        </div>
      ) : (
        <div className="">
          <ThreeDots
            visible={true}
            height="30"
            width="70"
            color={Globals.data.configs.colors.primary_start}
            radius="9"
            ariaLabel="three-dots-loading"
            wrapperStyle={{}}
            wrapperClass="py-1 flex justify-center"
          />
        </div>
      )}
    </div>
  );
};

export default ScreenLoading;
