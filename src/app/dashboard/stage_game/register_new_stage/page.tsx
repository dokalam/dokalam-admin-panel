"use client";

import React, { useRef, useState, useEffect } from "react";
import axios from "axios";
import { FaCamera, FaPlay, FaRegSquarePlus, FaVideo } from "react-icons/fa6";
import { toast } from "react-toastify";
import DialogHelper from "@/components/Dialog/DialogHelper";
import { BiEditAlt, BiTrash } from "react-icons/bi";
import { IoIosVideocam } from "react-icons/io";
import { secondsToTime } from "@/utils/SecondToTime";
import ImageComponent from "@/components/ImageComponent";
import ShowVideoModalHelper from "@/components/ShowMediaModal/ShowVideoModalHelper";
import ShowImageModalHelper from "@/components/ShowMediaModal/ShowImageModalHelper";
import ModalInputHelper from "@/components/ModalInput/ModalInputHelper";
import ShowVideoModal from "@/components/ShowMediaModal/ShowVideoModal";
import ShowImageModal from "@/components/ShowMediaModal/ShowImageModal";
import ModalInput from "@/components/ModalInput/ModalInput";
import Input from "@/components/Input";
import TextAreaInput from "@/components/TextAreaInput";
import { priceDigitSeperator } from "@/utils/PriceDigitSeparator";
import { numberToWords } from "@persian-tools/persian-tools";
import { MdDelete } from "react-icons/md";
import { IoClose } from "react-icons/io5";
import Footer from "@/components/Footer/Footer";
import GradientButton from "@/components/GradientButton";
import { Switch, Listbox, Transition } from "@headlessui/react";
import SelectInput from "@/components/SelectInput";

const Page = () => {
  const [loading, setLoading] = useState(false);
  const [language, setLanguage] = useState<string | null>(null)
  const [languageList, setLanguageList] = useState([])
  const [season, setSeason] = useState<string | null>(null)
  const [seasonList, setSeasonList] = useState([])
  const [sentence, setSentence] = useState("")
  const [words, setWords] = useState([])

  useEffect(()=>{
    getAllLanguage()
  }, [])
  const getAllLanguage = async()=>{
    const data = {
      query: `
        query getAllStageGameLanguageForAdmin($filter_visible : Boolean, $filter_active : Boolean){
          getAllStageGameLanguageForAdmin(filter_visible : $filter_visible, filter_active : $filter_active) {
            _id,
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
        const data = response.data.data.getAllStageGameLanguageForAdmin;
        if (data.length > 0) {
          const items = data.map((item: any) => ({
            label: item.name,
            value: item._id,
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
  const getAllSeason = async(value : string)=>{
    const data = {
      query: `
        query getAllStageGameSeasonForAdmin($language : ID, $filter_visible : Boolean, $filter_active : Boolean){
          getAllStageGameSeasonForAdmin(language : $language, filter_visible : $filter_visible, filter_active : $filter_active) {
            _id,
            name,
          }
        }
        `,
      variables: {
        language: value,
        filter_visible: false,
        filter_active: false,
      },
    };
    await axios({
      url: "/",
      method: "post",
      data: data,
    }).then(async (response) => {
        const data = response.data.data.getAllStageGameSeasonForAdmin;
        if (data.length > 0) {
          const items = data.map((item: any) => ({
            label: item.name,
            value: item._id,
          }));
          items.unshift({
            label: "انتخاب فصل",
            value: null,
          })
          setSeasonList(items);
        }
      })
      .catch(() => {
        setSeasonList([])
      });
  }
 

  const finalStageRegister = ()=>{

  }
  const addNewWord = ()=>{
    let data = [...words]
    const newItem = {
      word : "",
      unknown_word : false,
      letters : [],
      additional_words : []
    }
    data.push(newItem)
    setWords(data)
  }

  return (
    <div className="flex flex-col justify-between w-full lg:w-[600px] 2xl:w-[750px] mt-10 mb-28 px-4 sm:mx-auto">
      <div className="mt-6">
        <label
          className="font-['iransans-md'] flex-1 text-right text-text6 dark:text-text6_dark text-[.85rem] sm:text-[.95rem] cursor-pointer py-3"
          htmlFor="name"
        >
          زبان مرحله
          <span className="text-red-500 px-1">*</span>
          <div className={`mt-1 flex-1 gap-2 w-full items-center justify-between`}>
            <SelectInput
              name="stage-game-language"
              options={languageList}
              onChange={(value) => {
                setLanguage(value || null)
                if(value){
                  getAllSeason(value)
                }
              }}
            />
          </div>
        </label>
      </div>
      <div className="mt-6">
        <label
          className="font-['iransans-md'] flex-1 text-right text-text6 dark:text-text6_dark text-[.85rem] sm:text-[.95rem] cursor-pointer py-3"
          htmlFor="name"
        >
          فصل مرحله
          <span className="text-red-500 px-1">*</span>
          <div className={`mt-1 flex-1 gap-2 w-full items-center justify-between`}>
            <SelectInput
              name="stage-game-language"
              options={seasonList}
              onChange={(value) => {
                setSeason(value || null)
              }}
            />
          </div>
        </label>
      </div>
      <div className="mt-6">
        <label
          className="font-['iransans-md'] flex-1 text-right text-text6 dark:text-text6_dark text-[.85rem] sm:text-[.95rem] cursor-pointer py-3"
          htmlFor="name-stage-season"
        >
          جمله
          <span className="text-red-500 px-1">*</span>
          <div className={`mt-1 flex gap-2 w-full items-center justify-between`}>
            <Input id="name-stage-season" value={sentence} changeState={setSentence} classes="flex-1" inputStyles="!text-base" />
          </div>
        </label>
      </div>
      <div className="mt-6">
        <GradientButton
          buttonText={"افزودن کلمه جدید"}
          onClickFn={addNewWord}
          loading={false}
          classes="!text-sm !flex-none !px-8 sm:!w-[200px] !w-full"
        />
      </div>
      <div className="mt-6 flex flex-col gap-y-12">
        {
          words.map((item:any, index:number)=>(
              <div key={index.toString()} className="bg-background2 dark:bg-background2_dark p-4 border-2 border-dashed border-primary dark:border-primary rounded-md">

                <div className={`flex w-full items-center justify-between gap-4`}>
                  <div className="flex w-[55%] flex-row items-center font-['iransans-md'] gap-2">
                    <div
                      className="flex justify-center items-center rounded-full transition text-white bg-green_color w-10 h-10"
                    >
                      <p className="text-lg text-center">{`${index + 1}`}</p>
                    </div>
                    <Input id="name-stage-season" value={item.word} changeState={()=>{}} classes="flex-1" inputStyles="!text-base" />
                  </div>
                  <div className="flex flex-row items-center font-['iransans-md'] gap-4">
                    <p className="text-xs 3xs:text-sm text-center">کلمه نا مشخص</p>
                    <Switch
                      checked={item.unknown_word}
                      onChange={() => {}}
                      onClick={(e) => e.stopPropagation()}
                      className={`${item.unknown_word ? "bg-rgba2" : "bg-border dark:bg-border_dark"}
          relative h-[19px] w-[33px] shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out flex items-center`}
                    >
                      <span
                        aria-hidden="true"
                        className={`${
                          item.unknown_word
                            ? "translate-x-2 bg-primary"
                            : "-translate-x-[16px] bg-text5 dark:bg-text5_dark"
                        }
          pointer-events-none inline-block h-[22px] w-[22px] transform rounded-full shadow-lg ring-0 transition duration-200 ease-in-out`}
                      />
                    </Switch>
                    <div
                      onClick={(e: any) => {}}
                      className="flex justify-center items-center rounded transition text-white bg-red_error sm:hover:bg-red_color text-2xl w-10 h-10"
                    >
                      <BiTrash />
                    </div>
                  </div>
                </div>
                {
                  item.unknown_word == true&&
                  <div>
                    
                  </div>
                }
              </div>
          ))
        }
      </div>
      <Footer buttonFn={finalStageRegister} buttonText="ثبت مرحله" loadingButton={loading} classes="md:!mr-60 !justify-end" />
      <ModalInput
        ref={(Ref) => {
          ModalInputHelper.setRef(Ref);
        }}
      />
    </div>
  );
};

export default Page;
