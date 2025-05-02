import * as icons from "react-icons/gr";

const GrIcons = ({ icon }: IconComponentInterface) => {
  type iconType = keyof typeof icons;
  const myIcon = icon as iconType;

  const Icon: any = icons[myIcon];
  if (!Icon) return <></>;
  return <Icon />;
};

export default GrIcons;
