// import dynamic from "next/dynamic";

// const DynamicIcon = ({
//   iconFamily,
//   icon,
//   ...rest
// }: {
//   iconFamily: keyof typeof Icons;
//   icon: string;
// }) => {
//   const Icons = {
//     ci: dynamic(() => import("react-icons/ci").then((mod) => mod[icon]), {
//       ssr: false,
//     }),
//     fa: dynamic(() => import("react-icons/fa").then((mod) => mod[icon]), {
//       ssr: false,
//     }),
//     fa6: dynamic(() => import("react-icons/fa6").then((mod) => mod[icon]), {
//       ssr: false,
//     }),
//     io: dynamic(() => import("react-icons/io").then((mod) => mod[icon]), {
//       ssr: false,
//     }),
//     io5: dynamic(() => import("react-icons/io5").then((mod) => mod[icon]), {
//       ssr: false,
//     }),
//     md: dynamic(() => import("react-icons/md").then((mod) => mod[icon]), {
//       ssr: false,
//     }),
//     ti: dynamic(() => import("react-icons/ti").then((mod) => mod[icon]), {
//       ssr: false,
//     }),
//     go: dynamic(() => import("react-icons/go").then((mod) => mod[icon]), {
//       ssr: false,
//     }),
//     fi: dynamic(() => import("react-icons/fi").then((mod) => mod[icon]), {
//       ssr: false,
//     }),
//     gi: dynamic(() => import("react-icons/gi").then((mod) => mod[icon]), {
//       ssr: false,
//     }),
//     wi: dynamic(() => import("react-icons/wi").then((mod) => mod[icon]), {
//       ssr: false,
//     }),
//     di: dynamic(() => import("react-icons/di").then((mod) => mod[icon]), {
//       ssr: false,
//     }),
//     lia: dynamic(() => import("react-icons/lia").then((mod) => mod[icon]), {
//       ssr: false,
//     }),
//     ai: dynamic(() => import("react-icons/ai").then((mod) => mod[icon]), {
//       ssr: false,
//     }),
//     bs: dynamic(() => import("react-icons/bs").then((mod) => mod[icon]), {
//       ssr: false,
//     }),
//     ri: dynamic(() => import("react-icons/ri").then((mod) => mod[icon]), {
//       ssr: false,
//     }),
//     fc: dynamic(() => import("react-icons/fc").then((mod) => mod[icon]), {
//       ssr: false,
//     }),
//     gr: dynamic(() => import("react-icons/gr").then((mod) => mod[icon]), {
//       ssr: false,
//     }),
//     lu: dynamic(() => import("react-icons/lu").then((mod) => mod[icon]), {
//       ssr: false,
//     }),
//     hi: dynamic(() => import("react-icons/hi").then((mod) => mod[icon]), {
//       ssr: false,
//     }),
//     hi2: dynamic(() => import("react-icons/hi2").then((mod) => mod[icon]), {
//       ssr: false,
//     }),
//     si: dynamic(() => import("react-icons/si").then((mod) => mod[icon]), {
//       ssr: false,
//     }),
//     sl: dynamic(() => import("react-icons/sl").then((mod) => mod[icon]), {
//       ssr: false,
//     }),
//     im: dynamic(() => import("react-icons/im").then((mod) => mod[icon]), {
//       ssr: false,
//     }),
//     bi: dynamic(() => import("react-icons/bi").then((mod) => mod[icon]), {
//       ssr: false,
//     }),
//     cg: dynamic(() => import("react-icons/cg").then((mod) => mod[icon]), {
//       ssr: false,
//     }),
//     vsc: dynamic(() => import("react-icons/vsc").then((mod) => mod[icon]), {
//       ssr: false,
//     }),
//     tb: dynamic(() => import("react-icons/tb").then((mod) => mod[icon]), {
//       ssr: false,
//     }),
//     tfi: dynamic(() => import("react-icons/tfi").then((mod) => mod[icon]), {
//       ssr: false,
//     }),
//     pi: dynamic(() => import("react-icons/pi").then((mod) => mod[icon]), {
//       ssr: false,
//     }),
//   };

//   const Icon = iconFamily && icon ? Icons[iconFamily] : null;

//   if (!Icon) return <></>;

//   return (
//     <>
//       <Icon {...rest} />
//     </>
//   );
// };

// export default DynamicIcon;
