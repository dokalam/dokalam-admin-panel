import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";
import { UAParser } from "ua-parser-js";
import { setCookie } from "cookies-next";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

const initialState: {
  data: any;
  loading: boolean;
  error: any;
} = {
  data: [],
  loading: false,
  error: "",
};

export const loginRequest = createAsyncThunk(
  "login",
  async ({
    userName,
    password,
    router,
    uniqueId,
  }: {
    userName: string;
    password: string;
    router: AppRouterInstance;
    uniqueId: string;
  }) => {
    let parser = new UAParser(window.navigator.userAgent);
    let parserResults = parser.getResult();
    const firebase_token = "";
    const os = parserResults.os.name;
    const os_version = parserResults.os.version;
    const device_brand = parserResults.device.vendor;
    const device_name = parserResults.device.type;
    const device_model = parserResults.device.model;
    const unique_id = uniqueId;
    const app_type = "web";

    await axios({
      url: "/",
      method: "post",
      data: {
        query: `
          mutation loginToAdminPanelDashboard(
            $user_name : String!,
            $password : String!,
            $app_type : String,
            $firebase_token : String,
            $os : String,
            $os_version : String,
            $device_brand : String,
            $device_name : String,
            $device_model : String,
            $unique_id : String,
          ){
              loginToAdminPanelDashboard(
                user_name : $user_name,
                password : $password,
                app_type : $app_type,
                firebase_token : $firebase_token,
                os : $os,
                os_version : $os_version,
                device_brand : $device_brand,
                device_name : $device_name,
                device_model : $device_model,
                unique_id : $unique_id,
              ) {
                  status,
                  message,
                  required,
                  minutes,
                  seconds,
                  token,
              }
          }
          `,
        variables: {
          user_name: userName,
          password: password,
          app_type: app_type,
          firebase_token: firebase_token,
          os: os,
          os_version: os_version,
          device_brand: device_brand,
          device_name: device_name,
          device_model: device_model,
          unique_id: unique_id,
        },
      },
    })
      .then(async (response) => {
        if (response.data?.data == null) {
          toast.error(response.data.errors[0].data[0].message, {
            position: "top-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: typeof window !== "undefined" && localStorage.getItem("theme") == "dark" ? "dark" : "light",
          });
        } else {
          const data = response.data.data?.loginToAdminPanelDashboard;
          if (data?.status == 200) {
            if (data?.required == true) {
              const minutes = data?.minutes;
              const seconds = data?.seconds;

              router.push("/auth/login/otp");
            } else {
              const token = data?.token;
              setCookie("jwt3", token, {
                expires: new Date(Date.now() + 86400000 * 30),
              });
              axios.defaults.headers.post["token"] = token;
              router.replace("/dashboard/home");
            }
          }
        }
      })
      .catch(() => {
        toast.error("مشکلی پیش آمد، دوباره امتحان کنید.", {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: typeof window !== "undefined" && localStorage.getItem("theme") == "dark" ? "dark" : "light",
        });
      });
  }
);

const loginSlice = createSlice({
  name: "login",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(loginRequest.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(loginRequest.fulfilled, (state, action) => {
      state.data = action.payload;
      state.loading = false;
    });
    builder.addCase(loginRequest.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  },
});

export default loginSlice.reducer;
