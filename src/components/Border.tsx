import React from "react";

const Border = ({
  height,
  color,
  top,
  bottom,
  left,
  right,
  classes,
}: {
  height?: string;
  color?: string;
  top?: string;
  bottom?: string;
  left?: string;
  right?: string;
  classes?: string;
}) => {
  return (
    <div
      className={`${height ? height : "h-[1px]"} ${color ? color : "bg-border dark:bg-border_dark"} ${top ? top : ""} ${
        bottom ? bottom : ""
      } ${left ? left : ""} ${right ? right : ""} ${classes}`}
    ></div>
  );
};

export default Border;
