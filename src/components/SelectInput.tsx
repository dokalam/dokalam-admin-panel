import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

type SelectInputProps = {
  name: string;
  options?: { value: any; label: string }[];
  onChange: (value: string | null) => void;
  value?: string | null;
  classes?: string;
  disabled?: boolean | undefined;
};

const NULL_KEY = "__SELECT_NULL__";

const SelectInput: React.FC<SelectInputProps> = ({
  name,
  options = [],
  onChange,
  value,
  classes,
  disabled,
}) => {
  // local state برای حالت uncontrolled (وقتی value پاس داده نشه)
  const [internalValue, setInternalValue] = useState<string>(
    value !== undefined && value !== null ? String(value) : NULL_KEY
  );

  // وقتی value تغییر کرد (حالت کنترل‌شده)
  useEffect(() => {
    if (value !== undefined) {
      setInternalValue(value === null ? NULL_KEY : String(value));
    }
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value === NULL_KEY ? null : e.target.value;

    if (value === undefined) {
      // حالت uncontrolled: داخلی state آپدیت کن
      setInternalValue(e.target.value);
    }
    onChange(val);
  };

  if (disabled) {
    return (
      <div
        onClick={() => {
          toast.warning("امکان تغییر این آیتم وجود ندارد.", {
            position: "top-center",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: typeof window !== "undefined" && localStorage.getItem("theme") === "dark" ? "dark" : "light",
          });
        }}
        className={`${classes ?? ""} pl-10 text-xs sm:text-sm border border-border rounded px-3 h-[44px] sm:h-[41px] bg-background4 dark:bg-background4_dark dark:border-border_dark text-text6 dark:text-text6_dark flex items-center cursor-not-allowed select-none`}
      >
        {
          options.find(
            (option) =>
              (value !== null && value !== undefined ? String(option.value) : NULL_KEY) ===
              (value !== null && value !== undefined ? String(value) : NULL_KEY)
          )?.label ?? "مقدار انتخاب‌شده‌ای نیست"
        }
      </div>
    );
  }

  return (
    <div className="relative w-full">
      <div className="relative">
        <select
          disabled={disabled}
          id={name}
          name={name}
          value={internalValue}
          onChange={handleChange}
          className={`${classes ?? ""} placeholder:text-xs placeholder:text-text5 pl-10 placeholder:dark:text-text5_dark sm:text-base text-sm placeholder:text-right border transition border-border hover:border-gray-400 hover:drop-shadow-sm rounded px-3 focus:!border-primary_start bg-background4 dark:bg-background4_dark dark:border-border_dark outline-none w-full z-10 text-text6 dark:text-text6_dark h-[44px] sm:h-[41px] !appearance-none selection:bg-border selection:dark:bg-border_dark cursor-pointer`}
        >
          {options.length > 0 ? (
            options.map((option, index) => (
              <option
                key={index.toString()}
                value={option.value !== null && option.value !== undefined ? String(option.value) : NULL_KEY}
                className={
                  option.value !== null && option.value !== undefined
                    ? "text-text dark:text-text_dark"
                    : "text-text5 dark:text-text5_dark"
                }
              >
                {option.label}
              </option>
            ))
          ) : (
            <option value="" disabled>
              لیست دریافت نشد
            </option>
          )}
        </select>

        <div className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-text6 dark:text-text6_dark">
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>

      {options.length === 0 && (
        <p className={`${classes ?? ""}font-['iransans-md'] text-red-600 text-sm mt-1`}>
          لیست دریافت نشد
        </p>
      )}
    </div>
  );
};

export default SelectInput;
