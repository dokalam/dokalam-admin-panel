"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import TextAreaInput from "@/components/TextAreaInput";
import Footer from "@/components/Footer/Footer";
import SelectInput from "@/components/SelectInput";

const Page = () => {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [newWord, setNewWord] = useState(null)
  const [message, setMessage] = useState(null)
  const [language, setLanguage] = useState<string | null>(null)
  const [languageList, setLanguageList] = useState([])
  
  useEffect(()=>{
    getAllLanguage()
  }, [])

  const getAllLanguage = async()=>{
    const data = {
      query: `
        query getAllLanguageForAdmin($filter_visible : Boolean, $filter_active : Boolean){
          getAllLanguageForAdmin(filter_visible : $filter_visible, filter_active : $filter_active) {
            code,
            name,
          }
        }
        `,
      variables: {
        filter_visible: false,
        filter_active: false,
      },
    };
    await axios({
      url: "/",
      method: "post",
      data: data,
    }).then(async (response) => {
        const data = response.data.data.getAllLanguageForAdmin;
        if (data.length > 0) {
          const items = data.map((item: any) => ({
            label: item.name,
            value: item.code,
          }));
          items.unshift({
            label: "انتخاب زبان",
            value: null,
          })
          setLanguageList(items);
        }
      })
      .catch(() => {
        setLanguageList([])
      });
  }
  const registerAndConfirm = ()=>{
    if(!language){
      toast.error("زبان دیکشنری را انتخاب کنید.", {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: typeof window !== "undefined" && localStorage.getItem("theme") == "dark" ? "dark" : "light",
      });
    } else if(text.length == 0 ){
      toast.error("ابتدا متنی را وارد کنید", {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: typeof window !== "undefined" && localStorage.getItem("theme") == "dark" ? "dark" : "light",
      });
    } else {
      checkedAndRegister()
    }
  }
  const checkedAndRegister = async()=>{
    setLoading(true)
    setMessage(null)
    setNewWord(null)
    let data = {
      query: `
          mutation addNewWordsToDictionary(
            $text : String!,
            $language : String!,
          ){
            addNewWordsToDictionary(
              text : $text,
              language : $language,
            ) {
              status,
              message,
              number
            }
          }
          `,
      variables: {
        text : text,
        language : language
      },
    };
    await axios({
      url: "/",
      method: "post",
      data: data,
    })
      .then(async (response) => {
        const data = response.data?.data?.addNewWordsToDictionary
        setLoading(false);
        setNewWord(data?.number)
        setMessage(data?.message)
        setText("")
        if (data?.status == 200) {
            toast.success(data?.message, {
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
          toast.error((response.data?.errors[0]?.data[0]?.message || "مشکلی پیش آمد دوباره تلاش کنید"), {
            position: "top-center",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: typeof window !== "undefined" && localStorage.getItem("theme") == "dark" ? "dark" : "light",
          });
        }
      })
      .catch(() => {
        toast.error("مشکلی پیش آمد دوباره تلاش کنید", {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: typeof window !== "undefined" && localStorage.getItem("theme") == "dark" ? "dark" : "light",
        });
        setLoading(false);
      });
  }
  return (
    <div className="flex flex-col justify-between w-full lg:w-[600px] 2xl:w-[750px] mt-10 mb-28 px-4 sm:mx-auto">
      <div className="mt-6">
        <label
          className="font-['iransans-md'] flex-1 text-right text-text6 dark:text-text6_dark text-[.85rem] sm:text-[.95rem] cursor-pointer py-3"
          htmlFor="name"
        >
          زبان دیکشنری
          <span className="text-red-500 px-1">*</span>
          <div className={`mt-1 flex-1 gap-2 w-full items-center justify-between`}>
            <SelectInput
              value={language}
              name="dictionary-language"
              options={languageList}
              onChange={(value) => setLanguage(value || null)}
            />
          </div>
        </label>
      </div>
      <div className="mt-6">
        <label
          className="text-right lg:w-2/3 w-5/6 xl:w-3/5 2xl:w-1/2 text-text6 dark:text-text6_dark cursor-pointer font-iransans-md text-sm"
          htmlFor="description-stage-season"
        >
          متن حاوی کلمات جدید
          <span className="text-red-500 px-1">*</span>
          <TextAreaInput
            id={"description-stage-season"}
            value={text}
            changeState={(e: any) => setText(e)}
            textAreaStyles="!text-sm mt-1"
            rows={15}
          />
        </label>
      </div>
      {
        (typeof newWord == "number")&&
        <div className="flex flex-col mt-4 w-full items-center">
          <h1 className="text-primary text-[80px] font-['iransans-black-en']">{newWord}</h1>
          <p className="text-text6 dark:text-text6_dark text-[14px] font-['iransans-md']">{message}</p>
        </div>
      }
      <Footer buttonFn={registerAndConfirm} buttonText="ثبت داده" loadingButton={loading} classes="md:!mr-72 !justify-end" />
    </div>
  );
};

export default Page;
