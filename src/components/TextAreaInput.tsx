"use client";

import React, { useEffect, useRef } from "react";

const TextAreaInput = ({
  value,
  changeState,
  id,
  rows = 2,
  textAreaStyles,
  resizeAble = false,
  maxLength,
  placeholder,
  autoFocus,
  onBlur,
}: {
  value: string;
  changeState: any;
  id?: string;
  rows?: number;
  textAreaStyles?: string;
  resizeAble?: boolean;
  maxLength?: number;
  placeholder?: string;
  autoFocus?: boolean;
  onBlur?: any;
}) => {
  let inputRef: any = useRef();

  useEffect(() => {
    if (autoFocus == true) {
      inputRef.current.focus();
    } else {
      const time = setTimeout(() => {
        inputRef.current.blur();
        clearTimeout(time);
      }, 50);
    }
  }, [autoFocus]);

  return (
    <textarea
      ref={inputRef}
      autoFocus={autoFocus}
      id={id}
      rows={rows}
      maxLength={maxLength}
      onChange={(e) => {
        changeState(e.target.value);
      }}
      onBlur={() => {
        if (onBlur) onBlur();
      }}
      value={value}
      placeholder={placeholder}
      className={`${textAreaStyles} placeholder:text-xs placeholder:text-text5 placeholder:dark:text-text5_dark font-['iransans-md'] text-sm sm:text-base border transition border-border hover:border-gray-400 hover:drop-shadow-sm rounded px-3 py-[.6rem] focus:!border-primary_start bg-background4 dark:bg-background4_dark dark:border-border_dark outline-none w-full z-10 text-text6 dark:text-text6_dark appearance-none selection:bg-border selection:dark:bg-border_dark ${!resizeAble && "resize-none"
        }`}
    />
  );
};

export default TextAreaInput;
