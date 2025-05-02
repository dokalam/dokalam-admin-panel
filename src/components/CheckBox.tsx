import Fa6Icons from "@/utils/Icons/Fa6Icons";
import { memo } from "react";

const CheckBox = ({
  id,
  checked,
  classes = "",
  onChange,
  disabled = false,
  inputClasses = "",
}: {
  id?: string;
  checked: boolean;
  classes?: string;
  onChange?: any;
  disabled?: boolean;
  inputClasses?: string;
}) => {
  return (
    <div className={`checkbox-wrapper ${classes} relative w-5 h-5`}>
      <input
        disabled={disabled}
        type="checkbox"
        id={id}
        className={`${checked && "checked"} ${inputClasses}`}
        onChange={onChange}
        checked={checked}
      />
      {checked && (
        <div
          className="absolute top-0 right-0 left-0 bottom-0 flex justify-center items-center text-sm text-white"
          onClick={onChange}
        >
          <Fa6Icons icon="FaCheck" />
        </div>
      )}
    </div>
  );
};

export default memo(CheckBox);
