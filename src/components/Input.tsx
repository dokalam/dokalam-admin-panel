import Globals from "@/utils/Globals";
import Io5Icons from "@/utils/Icons/Io5Icons";
import { useState, memo, useRef, useEffect } from "react";
import { FaRegEye } from "react-icons/fa6";
import { FaRegEyeSlash } from "react-icons/fa6";
import { IoSearch } from "react-icons/io5";
import { Oval } from "react-loader-spinner";

const Input = ({
  type = "text",
  id,
  value,
  classes = "",
  changeState,
  fontFamily = "iransans-md",
  fontSize = "18px",
  validateOn,
  ltr = false,
  error = false,
  inputMode,
  classComponent,
  maxLength,
  multiLine,
  placeholder,
  autoFocus,
  inputStyles,
  clearFn,
  SearchLoading = false,
  onBlur,
  searchIconStyle,
  clearSearchIconStyles,
  onKeyDownFn,
}: {
  type?: string;
  id?: string;
  value: string | number;
  classes?: string;
  changeState: any;
  fontFamily?: string;
  fontSize?: string;
  validateOn?: boolean;
  ltr?: boolean;
  error?: boolean;
  inputMode?: any;
  classComponent?: boolean;
  maxLength?: number;
  multiLine?: boolean;
  placeholder?: string;
  autoFocus?: boolean;
  inputStyles?: string;
  clearFn?: any;
  SearchLoading?: boolean;
  onBlur?: any;
  searchIconStyle?: string;
  clearSearchIconStyles?: string;
  onKeyDownFn?: any;
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [inputType, setInputType] = useState(type);

  let inputRef: any = useRef();

  const handleShowPassword = () => {
    setShowPassword((last) => !last);
    setInputType((last) => {
      if (last === "password") {
        return "text";
      } else {
        return "password";
      }
    });
  };

  useEffect(() => {
    if (autoFocus == true) {
      inputRef?.current?.focus();
    } else {
      const time = setTimeout(() => {
        inputRef?.current?.blur();
        clearTimeout(time);
      }, 50);
    }
  }, [autoFocus]);

  return (
    <div className={`relative flex items-center ${classes}`}>
      <input
        onKeyDown={(e) => {
          if (onKeyDownFn && e.key == "Enter") {
            onKeyDownFn();
            inputRef?.current?.blur();
          }
        }}
        ref={inputRef}
        autoFocus={autoFocus}
        placeholder={placeholder || ""}
        maxLength={maxLength || undefined}
        aria-multiline={multiLine || false}
        type={inputType}
        inputMode={inputMode}
        min={inputMode == "numeric" ? 0 : undefined}
        className={`${inputStyles} placeholder:text-xs placeholder:text-text5 placeholder:dark:text-text5_dark sm:text-base text-sm placeholder:text-right border transition border-border hover:border-gray-400 hover:drop-shadow-sm rounded px-3 py-[.6rem] focus:!border-primary_start bg-background4 dark:bg-background4_dark dark:border-border_dark outline-none w-full z-10 text-text6 dark:text-text6_dark h-[44px] sm:h-[41px] !appearance-none selection:bg-border selection:dark:bg-border_dark
         ${validateOn && error && "border-red_error dark:border-red_error"}`}
        id={id}
        value={value}
        onChange={
          classComponent
            ? changeState
            : validateOn != undefined
            ? (e) => {
                changeState((last: any) => {
                  return { ...last, value: e.target.value };
                });
              }
            : (e) => {
                changeState(e.target.value);
              }
        }
        onFocus={() => {
          if (validateOn) {
            changeState((last: any) => {
              return { ...last, validateOn: false };
            });
          }
        }}
        onBlur={() => {
          if (validateOn) {
            changeState((last: any) => {
              return { ...last, validateOn: true };
            });
          }
          if (onBlur) onBlur();
        }}
        style={{
          fontFamily: fontFamily,
          fontSize: fontSize,
          direction: ltr == true ? "ltr" : "rtl",
        }}
      />
      <div className="flex items-center absolute top-0 bottom-0 right-0 left-0">
        {type === "password" && (
          <div className="absolute left-4 z-20 text-text5 dark:text-text5_dark cursor-pointer" onClick={handleShowPassword}>
            {showPassword ? <FaRegEye /> : <FaRegEyeSlash />}
          </div>
        )}
        {type == "search" && (
          <div className={`${searchIconStyle} absolute right-2 text-text5 dark:text-text5_dark text-[1.35rem] z-20`}>
            <IoSearch />
          </div>
        )}
        {type == "search" && (typeof value == "string" ? value.length > 0 : value > 0) && (
          <div className={`${clearSearchIconStyles} absolute left-2 z-20 text-primary text-2xl`}>
            {SearchLoading == true && typeof value == "string" && value.length > 1 ? (
              <div className="flex justify-center items-center rounded-full p-[.1rem] ">
                <Oval
                  visible={true}
                  height="18"
                  width="18"
                  color={Globals.data.configs.colors.primary_start}
                  ariaLabel="oval-loading"
                  wrapperStyle={{}}
                  wrapperClass="flex justify-center"
                  secondaryColor={Globals.data.configs.colors.rgba1}
                  strokeWidth={4}
                />
              </div>
            ) : (
              <div
                className="flex justify-center items-center transition hover:bg-border2 p-[.1rem] dark:hover:bg-border2_dark rounded-full cursor-pointer"
                onClick={clearFn}
              >
                <Io5Icons icon={"IoClose"} />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default memo(Input);
