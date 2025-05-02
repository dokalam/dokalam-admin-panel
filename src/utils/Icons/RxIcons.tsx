import * as icons from "react-icons/rx";

const RxIcons = ({ icon }: IconComponentInterface) => {
  type iconType = keyof typeof icons;
  const myIcon = icon as iconType;

  const Icon: any = icons[myIcon];
  if (!Icon) return <></>;
  return <Icon />;
};

export default RxIcons;
