"use client";

import React from "react";
import MyDialog from "@/components/Dialog/MyDialog";
import DialogHelper from "@/components/Dialog/DialogHelper";
import Globals from "@/utils/Globals";
import axios from "axios";
import { getCookie, hasCookie, setCookie } from "cookies-next";
// import MyModalList from "@/components/ModalList/ModalList";
// import ModalListHelper from "@/components/ModalList/ModalListHelper";
// import ModalInput from "@/components/ModalInput/ModalInput";
// import ModalInputHelper from "@/components/ModalInput/ModalInputHelper";
// import CityModalHelper from "@/components/CityModal/CityModalHelper";
// import CityModal from "@/components/CityModal/CityModal";

const LayoutComponent = ({ children }: { children: React.ReactNode }) => {
  axios.defaults.baseURL = Globals.baseURL;
  axios.defaults.headers.post["Accept"] = "application/json";
  axios.defaults.headers.post["client"] = "admin";

  if (hasCookie("jwt3")) {
    const token = getCookie("jwt3");
    setCookie("jwt3", token, { expires: new Date(Date.now() + 86400000 * 30) });
    axios.defaults.headers.post["token"] = token;
  } else {
  }

  return (
    <div>
      {children}
      <MyDialog
        ref={(Ref) => {
          DialogHelper.setRef(Ref);
        }}
      />
    </div>
  );
};

export default LayoutComponent;
