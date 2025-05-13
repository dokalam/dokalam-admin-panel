"use client";

import React, { useRef, useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { FaCamera, FaPlay, FaRegSquarePlus, FaVideo } from "react-icons/fa6";
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
import Border from "@/components/Border";
import { Switch, Listbox, Transition } from "@headlessui/react";
import SelectInput from "@/components/SelectInput";

const Page = () => {
  const inputImageRef: any = useRef();
  const numberImage = 1
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [visible, setVisible] = useState(false);
  const [active, setActive] = useState(false);
  const [badg, setBadg] = useState("");
  const [language, setLanguage] = useState<string | null>(null)
  const [languageList, setLanguageList] = useState([])
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState<any>([]);
  const [seasonNumber, setSeasonNumber] = useState("")
  const [numberStage, setNumberStage] = useState("")
  

  useEffect(()=>{
    getAllLanguage()
  }, [])
  const getAllLanguage = async()=>{
    const data = {
      query: `
        query getAllStageGameLanguage($filter_visible : Boolean, $filter_active : Boolean){
          getAllStageGameLanguage(filter_visible : $filter_visible, filter_active : $filter_active) {
            _id,
            name,
            parent{_id},
            child
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
    })
      .then(async (response) => {
        if (response.data?.data == null) {
          const data = response.data.data.getAllStageGameLanguage;
          if (data.length > 0) {
            setLanguageList(data);
          }
        }
      })
      .catch(() => {
        setLanguageList([])
      });
  }
  const registerAndConfirm = ()=>{
    if(name.length == 0 ){
      toast.error("ابتدا موارد الزامی را وارد کنید", {
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
    let data = {
      query: `
          mutation newSeasonDefinitionForStageGame(
              $name : String!,
              $description : String,
              $language : ID!,
              $image : Upload,
              $badg : String,
              $season_number : Int!,
              $number_stage : Int!,
              $is_visible : Boolean!,
              $is_active : Boolean!,
          ){
            newSeasonDefinitionForStageGame(
                name : $name,
                description : $description,
                language : $language,
                image : $image,
                badg : $badg,
                season_number : $season_number,
                number_stage : $number_stage,
                is_visible : $is_visible,
                is_active : $is_active,
            ) {
              status,
              message,
            }
          }
          `,
      variables: {
        name: name,
        description: description?.length > 0?description:null,
        language: language,
        image: null,
        is_visible: visible,
        is_active: active,
        badg: badg?.length > 0?badg:null,
        season_number: seasonNumber,
        number_stage: numberStage,
      },
    };
    await axios({
      url: "/",
      method: "post",
      data: data,
    })
      .then(async (response) => {
        setLoading(false);
        if (response.data?.data?.newSeasonDefinitionForStageGame?.status == 200) {
            toast.success(response.data?.data?.newSeasonDefinitionForStageGame?.message, {
              position: "top-center",
              autoClose: 3000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: typeof window !== "undefined" && localStorage.getItem("theme") == "dark" ? "dark" : "light",
            });
            setName("")
            setDescription("")
            setBadg("")
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

  const handleAddPhotos = (e: any) => {
      const photos = e.target.files;
      if (photos.length > numberImage || image.length > numberImage-1) {
        toast.warning(`بیشتر از ${numberImage} عکس نمی‌توانید برای فصل انتخاب کنید.`, {
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
        const newData: any = [...image];
          for (let index = 0; index < photos.length; index++) {
            const data = {
              file: photos[index],
              preview: URL.createObjectURL(photos[index]),
            };
            newData.push(data);
          }
          setImage(newData);
        inputImageRef.current.value = "";
      }
  };
  const deleteImageItem = (item: any) => {
    let index = image.findIndex((i: any) => i.preview == item.preview);
    const newData = [...image];
    newData.splice(index, 1);
    setImage(newData);
  };
  return (
    <div className="flex flex-col justify-between w-full lg:w-[600px] 2xl:w-[750px] mt-10 mb-28 px-4 sm:mx-auto">
 
      <div className="flex gap-6 justify-center font-['iransans-md'] mt-1">
        <label
          className="text-text6 dark:text-text6_dark border-2 border-dashed border-text5 dark:border-text5_dark py-6 text-lg flex-1 rounded-md cursor-pointer transition sm:hover:bg-border2 sm:dark:hover:bg-border2_dark flex flex-col justify-center items-center gap-y-2"
          htmlFor="upload_file_photos"
          tabIndex={0}
        >
          <div className="text-4xl">
            <FaCamera />
          </div>
          <p className="text-xs 3xs:text-sm text-center">افزودن عکس</p>
          <input
            ref={inputImageRef}
            autoComplete="off"
            tabIndex={-1}
            className="hidden"
            id="upload_file_photos"
            type="file"
            accept="image/*"
            multiple
            onChange={handleAddPhotos}
          />
        </label>
      </div>
      {image.length > 0 && (
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-y-4 sm:gap-y-4 mt-4 border-2 border-dashed border-primary dark:border-primary rounded-md py-2">
          {image.map((item: any, index: number) => (
            <div key={`${index.toString()}`} className="w-full h-20 3xs:h-24 sm:h-28 flex justify-center items-center">
              <div
                className="relative w-20 h-20 3xs:w-24 3xs:h-24 sm:w-28 sm:h-28 cursor-pointer"
                onClick={() => {
                  if (item?.file?.type.includes("video") == true) {
                    ShowVideoModalHelper.showModal({
                      src: item.preview,
                      title: item?.title ? item.title : null,
                    });
                  } else {
                    ShowImageModalHelper.showModal({
                      src: item.preview,
                      title: item?.title ? item.title : null,
                    });
                  }
                }}
              >
                <ImageComponent
                  src={item.preview}
                  alt={"file_photos"}
                  baseURI={false}
                  parentclasses="h-full w-full cursor-pointer"
                />
                <div className="absolute top-0 w-full flex justify-between px-1 pt-1">
                  <div
                    onClick={(e: any) => {
                      e.stopPropagation();
                      deleteImageItem(item);
                    }}
                    className="flex justify-center items-center rounded transition text-white bg-[#00000080] sm:hover:bg-[#33333370] text-lg w-6 h-6"
                  >
                    <BiTrash />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-6">
        <label
          className="font-['iransans-md'] flex-1 text-right text-text6 dark:text-text6_dark text-[.85rem] sm:text-[.95rem] cursor-pointer py-3"
          htmlFor="name"
        >
          زبان فصل
          <span className="text-red-500 px-1">*</span>
          <div className={`mt-1 flex-1 gap-2 w-full items-center justify-between`}>
            <SelectInput
              name="stage-game-language"
              options={languageList}
              onChange={(value) => setLanguage(value || null)}
            />
          </div>
        </label>
      </div>
      <div className="mt-6">
        <label
          className="font-['iransans-md'] flex-1 text-right text-text6 dark:text-text6_dark text-[.85rem] sm:text-[.95rem] cursor-pointer py-3"
          htmlFor="name"
        >
          نام فصل
          <span className="text-red-500 px-1">*</span>
          <div className={`mt-1 flex gap-2 w-full items-center justify-between`}>
            <Input id="name" value={name} changeState={setName} classes="flex-1" inputStyles="!text-base" />
          </div>
        </label>
      </div>
      <div className="mt-6">
        <label
          className="font-['iransans-md'] flex-1 text-right text-text6 dark:text-text6_dark text-[.85rem] sm:text-[.95rem] cursor-pointer py-3"
          htmlFor="name"
        >
          نشان ( مثل جدید یا به‌زودی )
          <div className={`mt-1 flex gap-2 w-full items-center justify-between`}>
            <Input id="name" value={badg} changeState={setBadg} classes="flex-1" inputStyles="!text-base" />
          </div>
        </label>
      </div>
      <div className="mt-6">
        <label
          className="text-right lg:w-2/3 w-5/6 xl:w-3/5 2xl:w-1/2 text-text6 dark:text-text6_dark cursor-pointer font-iransans-md text-sm"
          htmlFor="description"
        >
          توضیحات فصل
          <TextAreaInput
            id={"description"}
            value={description}
            changeState={(e: any) => setDescription(e)}
            textAreaStyles="!text-sm mt-1"
            rows={4}
          />
        </label>
      </div>
      <div className="mt-6">
        <label
          className="font-['iransans-md'] flex-1 text-right text-text6 dark:text-text6_dark text-[.85rem] sm:text-[.95rem] cursor-pointer py-3"
          htmlFor="name"
        >
          شماره فصل
          <span className="text-red-500 px-1">*</span>
          <div className={`mt-1 flex gap-2 w-full items-center justify-between`}>
            <Input type="number" id="name" value={seasonNumber} changeState={setSeasonNumber} classes="flex-1" inputStyles="!text-base" />
          </div>
        </label>
      </div>
      <div className="mt-6">
        <label
          className="font-['iransans-md'] flex-1 text-right text-text6 dark:text-text6_dark text-[.85rem] sm:text-[.95rem] cursor-pointer py-3"
          htmlFor="name"
        >
          تعداد مراحل فصل
          <span className="text-red-500 px-1">*</span>
          <div className={`mt-1 flex gap-2 w-full items-center justify-between`}>
            <Input type="number" id="name" value={numberStage} changeState={setNumberStage} classes="flex-1" inputStyles="!text-base" />
          </div>
        </label>
      </div>
      <div
        className="py-4 cursor-pointer sm:hover:bg-border2 dark:sm:hover:bg-border2_dark transition select-none"
        onClick={() => setVisible((last) => !last)}
      >
        <div className="flex items-center justify-between w-full h-[42px] pl-2 rounded">
          <label className={`text-sm font-['iransans-md'] cursor-pointer`}>
            <h3 className="text-text dark:text-text_dark font-['iransans-md'] text-[15px]">
              قابل نمایش شود
            </h3>
          </label>
          <Switch
            checked={visible}
            onChange={() => setVisible((last) => !last)}
            onClick={(e) => e.stopPropagation()}
            className={`${visible ? "bg-rgba2" : "bg-border dark:bg-border_dark"}
relative h-[19px] w-[33px] shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out flex items-center`}
          >
            <span
              aria-hidden="true"
              className={`${
                visible
                  ? "translate-x-2 bg-primary"
                  : "-translate-x-[16px] bg-text5 dark:bg-text5_dark"
              }
pointer-events-none inline-block h-[22px] w-[22px] transform rounded-full shadow-lg ring-0 transition duration-200 ease-in-out`}
            />
          </Switch>
        </div>
        <p className="text-justify font-['iransans-md'] text-text5 dark:text-text5_dark text-[12px] sm:text-[14px] mb-1">
          با فعال بودن این گزینه، آیتم قابل نمایش برای کاربران ثبت خواهد شد.
        </p>
      </div>
      <Border />
      <div
        className="py-4 cursor-pointer sm:hover:bg-border2 dark:sm:hover:bg-border2_dark transition select-none"
        onClick={() => setActive((last) => !last)}
      >
        <div className="flex items-center justify-between w-full h-[42px] pl-2 rounded">
          <label className={`text-sm font-['iransans-md'] cursor-pointer`}>
            <h3 className="text-text dark:text-text_dark font-['iransans-md'] text-[15px]">
              فعال شود
            </h3>
          </label>
          <Switch
            checked={active}
            onChange={() => setActive((last) => !last)}
            onClick={(e) => e.stopPropagation()}
            className={`${active ? "bg-rgba2" : "bg-border dark:bg-border_dark"}
relative h-[19px] w-[33px] shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out flex items-center`}
          >
            <span
              aria-hidden="true"
              className={`${
                active
                  ? "translate-x-2 bg-primary"
                  : "-translate-x-[16px] bg-text5 dark:bg-text5_dark"
              }
pointer-events-none inline-block h-[22px] w-[22px] transform rounded-full shadow-lg ring-0 transition duration-200 ease-in-out`}
            />
          </Switch>
        </div>
        <p className="text-justify font-['iransans-md'] text-text5 dark:text-text5_dark text-[12px] sm:text-[14px] mb-1">
          با فعال بودن این گزینه، آیتم به عنوان فعال شده ثبت خواهد شد.
        </p>
      </div>
      <Border />
      <Footer buttonFn={registerAndConfirm} buttonText="ثبت فصل" loadingButton={loading} classes="md:!mr-60 !justify-end" />
     
      <ShowImageModal
        ref={(Ref) => {
          ShowImageModalHelper.setRef(Ref);
        }}
      />
    </div>
  );
};

export default Page;
