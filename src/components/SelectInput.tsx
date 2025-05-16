import React from 'react';



type SelectInputProps = {
  name: string;
  options?: { value: any; label: string }[];
  onChange: (value: string) => void;
};

const SelectInput: React.FC<SelectInputProps> = ({ name, options = [], onChange }) => {
  return (
    <div className="relative w-full">
        <div className="relative">
            <select
                id={name}
                name={name}
                onChange={(e) => onChange(e.target.value)}
                className="placeholder:text-xs placeholder:text-text5 pl-10 placeholder:dark:text-text5_dark sm:text-base text-sm placeholder:text-right border transition border-border hover:border-gray-400 hover:drop-shadow-sm rounded px-3 focus:!border-primary_start bg-background4 dark:bg-background4_dark dark:border-border_dark outline-none w-full z-10 text-text6 dark:text-text6_dark h-[44px] sm:h-[41px] !appearance-none selection:bg-border selection:dark:bg-border_dark"
            >
                {
                    options.length > 0?
                    options.map((option, index) => (
                        <option key={index.toString()} value={option.value}>
                            {option.label}
                        </option>
                    ))
                    :
                    <option value="" disabled>
                        لیست دریافت نشد
                    </option>
                }
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
            <p className="font-['iransans-md'] text-red-600 text-sm mt-1">لیست دریافت نشد</p>
        )}
    </div>
  );
};

export default SelectInput;