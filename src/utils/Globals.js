import { TbAlertSquare } from "react-icons/tb";
import { IoIosCheckboxOutline } from "react-icons/io";
import { IoPowerSharp } from "react-icons/io5";
import { MdOutlineBlock } from "react-icons/md";
import { CgCloseR } from "react-icons/cg";

const url = process.env.NEXT_PUBLIC_URL;
const uri = process.env.NEXT_PUBLIC_URI

const exports = {
  app_version: "1.0.0",
  store_name: "direct_download",
  baseURL: `${url}/graphql`,
  uri: uri,
  data: {
    configs: {
      translate: "fa",
      colors: {
        primary: "#AF69EE",
        primary_start: "#AF69EE",
        primary_end: "#BD7BF9",
        red_color: "#FF2400",
        green_color: "#309334",
        red_error: "#CC0000",
        rgba0: "rgba(175,105,238,0.9)",
        rgba1: "rgba(175,105,238,0.7)",
        rgba2: "rgba(175,105,238,0.3)",
        rgba3: "rgba(175,105,238,0.1)",
        rgba4: "rgba(175,105,238,0.05)",
      },
      alert: {
        icon_type: "lottie",
        success: {
          gradient_start: "#007E33",
          gradient_end: "#00C851",
          icon: "check",
        },
        alert: {
          gradient_start: "#CC0000",
          gradient_end: "#ff4444",
          icon: "times",
        },
        info: {
          gradient_start: "#0099CC",
          gradient_end: "#33b5e5",
          icon: "info",
        },
        warn: {
          gradient_start: "#FF8800",
          gradient_end: "#ffbb33",
          icon: "exclamation",
        },
        question: {
          gradient_start: "#FF8800",
          gradient_end: "#ffbb33",
          icon: "question",
        },
      },
      file_status: {
        checking: {
          key: "checking",
          status: "در حال بررسی",
          color: "#FF8800",
          icon: <TbAlertSquare />,
        },
        disactive: {
          key: "disactive",
          status: "غیر فعال",
          color: "#444444",
          icon: <IoPowerSharp />,
        },
        verify: {
          key: "verify",
          status: "تایید شده",
          color: "#309334",
          icon: <IoIosCheckboxOutline />,
        },
        blocked: {
          key: "blocked",
          status: "مسدود و رد شده",
          color: "#CC0000",
          icon: <MdOutlineBlock />,
        },
        need_change: {
          key: "need_change",
          status: "نیاز به تغییر",
          color: "#CC0000",
          icon: <CgCloseR />,
        },
      },
    },
  },
};

export default exports;
