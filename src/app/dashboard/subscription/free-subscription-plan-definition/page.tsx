"use client";

import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { FaCamera, FaUserLarge } from "react-icons/fa6";
import {  BiTrash } from "react-icons/bi";
import ImageComponent from "@/components/ImageComponent";
import ShowImageModalHelper from "@/components/ShowMediaModal/ShowImageModalHelper";
import ShowImageModal from "@/components/ShowMediaModal/ShowImageModal";
import Input from "@/components/Input";
import TextAreaInput from "@/components/TextAreaInput";
import Footer from "@/components/Footer/Footer";
import Border from "@/components/Border";
import { Switch } from "@headlessui/react";
import SelectInput from "@/components/SelectInput";
import GradientButton from "@/components/GradientButton";
import UserListHelper from "@/components/UserList/UserListHelper";
import UserList from "@/components/UserList/UserList";
import { LuCalendarDays, LuClock3 } from "react-icons/lu";
import CalendarModalHelper from "@/components/CalendarModal/CalendarModalHelper";
import CalendarModal from "@/components/CalendarModal/CalendarModal";
import moment from "moment-jalaali";
moment.locale('fa');
moment.loadPersian({ usePersianDigits: false, dialect: "persian-modern" });

type SelectedOption = {
  value: any;
  label: string;
};
const FreeSubscriptionType:SelectedOption[] = [
  {value:null, label:"انتخاب نوع آیتم اشتراک رایگان"},
  {value:"private", label:"خصوصی"},
  {value:"public", label:"عمومی"},
]
type UserSelectedInfo = {
  _id: string;
  user_name: string | null | undefined | any;
  phone: string | null | undefined | any;
  name: string | null | undefined | any;
}
const Page = () => {
  const inputIconImageRef: any = useRef();
  const [freeSubscriptionType, setFreeSubscriptionType] = useState<string | null>(null)
  const [userSelected, setUserSelected] = useState<UserSelectedInfo[]>([])
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [visible, setVisible] = useState(true);
  const [active, setActive] = useState(true);
  const [loading, setLoading] = useState(false);
  const [iconImage, setIconImage] = useState<any>(null);
  const [duration, setDuration] = useState("")
  const [note, setNote] = useState("")
  const [expiration, setExpiration] = useState<any>(null)
  const [expirationHour, setExpirationHour] = useState<any>(null)
  const dark = typeof window !== "undefined" && localStorage.getItem("theme");

  const hours: any = [
    { name: `00 : 00`, value: 0 },
    { name: `01 : 00`, value: 1 },
    { name: `02 : 00`, value: 2 },
    { name: `03 : 00`, value: 3 },
    { name: `04 : 00`, value: 4 },
    { name: `05 : 00`, value: 5 },
    { name: `06 : 00`, value: 6 },
    { name: `07 : 00`, value: 7 },
    { name: `08 : 00`, value: 8 },
    { name: `09 : 00`, value: 9 },
    { name: `10 : 00`, value: 10 },
    { name: `11 : 00`, value: 11 },
    { name: `12 : 00`, value: 12 },
    { name: `13 : 00`, value: 13 },
    { name: `14 : 00`, value: 14 },
    { name: `15 : 00`, value: 15 },
    { name: `16 : 00`, value: 16 },
    { name: `17 : 00`, value: 17 },
    { name: `18 : 00`, value: 18 },
    { name: `19 : 00`, value: 19 },
    { name: `20 : 00`, value: 20 },
    { name: `21 : 00`, value: 21 },
    { name: `22 : 00`, value: 22 },
    { name: `23 : 00`, value: 23 },
  ];

  useEffect(() => {
    if (!expirationHour) {
      const now = new Date().getHours();
      let index = hours.findIndex((i: any) => i.value == now);
      setExpirationHour(hours[index].value)
    }
  }, []);

  const registerAndConfirm = ()=>{
    if(freeSubscriptionType == "private" && (!userSelected || userSelected?.length < 1)){
      toast.error("وقتی نوع آیتم را خصوصی میکنید، باید حداقل 1 کاربر برای آن انتخاب کنید.", {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: typeof window !== "undefined" && localStorage.getItem("theme") == "dark" ? "dark" : "light",
      });
    } else if(title.length == 0 || duration.length == 0 || !freeSubscriptionType ){
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
          mutation newFreeSubscriptionPlanDefinition(
            $type : String!,
            $private_users : [ID],
            $title : String!,
            $description : String,
            $icon_image : Upload,
            $duration : Int!,
            $is_visible : Boolean!,
            $is_active : Boolean!,
            $admin_note : String,
            $expiration : Date,
          ){
            newFreeSubscriptionPlanDefinition(
              type : $type,
              private_users : $private_users,
              title : $title,
              description : $description,
              icon_image : $icon_image,
              duration : $duration,
              is_visible : $is_visible,
              is_active : $is_active,
              admin_note : $admin_note,
              expiration : $expiration
            ) {
              status,
              message,
            }
          }
          `,
      variables: {
        type : freeSubscriptionType,
        private_users : freeSubscriptionType == "private"? userSelected?.map((item:any)=>item._id):undefined,
        title : title,
        description : description?.length > 2?description:undefined,
        icon_image : null,
        duration : Number(duration),
        is_visible : visible,
        is_active : active,
        admin_note : note?.length > 2?note:undefined,
        expiration : expiration?new Date(new Date(new Date(expiration).setHours(expirationHour)).setMinutes(0)):undefined
      },
    };
    const formData = new FormData();
    const map: Record<string, string[]> = {};
    let fileIndex = 0;
    const fileMap: Record<string, File> = {};
    if (iconImage?.file) {
      map[fileIndex.toString()] = ['variables.icon_image'];
      fileMap[fileIndex.toString()] = iconImage.file;
      fileIndex++;
    }
    formData.append('operations', JSON.stringify(data));
    formData.append('map', JSON.stringify(map));

    for (const index in fileMap) {
      formData.append(index, fileMap[index]);
    }
    await axios({
        url: "/",
        method: "post",
        data: formData,
        headers: {
          Accept: "*/*",
          "Content-Type": "multipart/form-data",
        },
    }).then(async (response) => {
        setLoading(false);
        if (response.data?.data?.newFreeSubscriptionPlanDefinition?.status == 200) {
            toast.success(response.data?.data?.newFreeSubscriptionPlanDefinition?.message, {
              position: "top-center",
              autoClose: 3000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: typeof window !== "undefined" && localStorage.getItem("theme") == "dark" ? "dark" : "light",
            });
            setTitle("")
            setDescription("")
            setDuration("")
            setIconImage(null)
            setUserSelected([])
            setNote("")
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
      .catch((err) => {
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
  const handleAddIconPhoto = (e: any) => {
    const photo = e.target.files;
    const data = {
      file: photo[0],
      preview: URL.createObjectURL(photo[0]),
    };
    setIconImage(data);
    inputIconImageRef.current.value = "";
  };
  const selectUser = ()=>{
    const previousSelected = userSelected?{
      _id: userSelected.map((item)=>item?._id),
      user_name: userSelected.map((item)=>item?.user_name),
      phone: userSelected.map((item)=>item?.phone),
      name: userSelected.map((item)=>item?.name),
    }:undefined;
    UserListHelper.openModal({
      previousSelected:previousSelected,
      numberSelected: 20,
      buttons: [
        {
          buttonText: "لغو",
          type: "border",
          onClickFn: () => {
            UserListHelper.closeModal();
          },
        },
        {
          buttonText: "انتخاب کاربر",
          type: "bold",
          onClickFn: ({ data }: { data: any }) => {
            let items:any = []
            for (let index = 0; index < data?._id.length; index++) {
              const element = {
                _id: data._id[index],
                user_name: data.user_name[index],
                phone: data.phone[index],
                name: data.name[index],
              }
              items.push(element)
            }
            setUserSelected(items)
            UserListHelper.closeModal();
          },
        },
      ],
    });
  }
  const deleteUserItem = (index:number)=>{
    const newData:any = [...userSelected];
    newData.splice(index, 1);
    setUserSelected(newData);
  }

  return (
    <div className="flex flex-col justify-between w-full lg:w-[600px] 2xl:w-[750px] mt-10 mb-28 px-4 sm:mx-auto">
 
      <div className="flex gap-6 justify-center font-['iransans-md'] mt-1">
        <label
          className="text-text6 dark:text-text6_dark border-2 border-dashed border-text5 dark:border-text5_dark py-6 text-lg flex-1 rounded-md cursor-pointer transition sm:hover:bg-border2 sm:dark:hover:bg-border2_dark flex flex-col justify-center items-center gap-y-2"
          htmlFor="upload_file_photo_icon"
          tabIndex={0}
        >
          <div className="text-4xl">
            <FaCamera />
          </div>
          <p className="text-xs 3xs:text-sm text-center">افزودن عکس آیکون</p>
          <input
            ref={inputIconImageRef}
            autoComplete="off"
            tabIndex={-1}
            className="hidden"
            id="upload_file_photo_icon"
            type="file"
            accept="image/*"
            onChange={handleAddIconPhoto}
          />
        </label>
      </div>

      {iconImage && (
        <div className="mt-4 border-2 border-dashed border-primary rounded-md py-4 px-2">
          <div className="flex justify-center items-center gap-4">
            {iconImage && (
              <div
                className="relative w-20 h-20 sm:w-28 sm:h-28 cursor-pointer flex-shrink-0"
                onClick={() =>
                  ShowImageModalHelper.showModal({
                    src: iconImage.preview,
                  })
                }
              >
                <ImageComponent
                  src={iconImage.preview}
                  alt="icon"
                  baseURI={false}
                  parentclasses="h-full w-full object-cover rounded-md cursor-pointer"
                />
                <div className="absolute top-0 w-full flex justify-between px-1 pt-1">
                  <div
                    onClick={(e: any) => {
                      e.stopPropagation();
                      setIconImage(null)
                    }}
                    className="flex justify-center items-center rounded transition text-white bg-[#00000080] hover:bg-[#33333370] text-lg w-6 h-6"
                  >
                    <BiTrash />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
      <div className="mt-6">
        <label
          className="font-['iransans-md'] flex-1 text-right text-text6 dark:text-text6_dark text-[.85rem] sm:text-[.95rem] cursor-pointer py-3"
          htmlFor="name"
        >
          نوع آیتم اشتراک رایگان
          <span className="text-red-500 px-1">*</span>
          <div className={`mt-1 flex-1 gap-2 w-full items-center justify-between`}>
            <SelectInput
              name="free-subscription-type"
              options={FreeSubscriptionType}
              onChange={(value) => setFreeSubscriptionType(value)}
            />
          </div>
        </label>
      </div>
      {
        freeSubscriptionType !== "public"&&
        <div className="mt-12">
          <GradientButton
            buttonText={"انتخاب کاربر هدف"}
            onClickFn={selectUser}
            loading={false}
            classes="!text-sm !flex-none !px-8 sm:!w-[300px] !w-full"
          />
        </div>
      }
      {(userSelected && userSelected.length > 0 && freeSubscriptionType !== "public")&&(
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-y-12 gap-x-2 sm:gap-y-12 sm:gap-x-2 mt-4 border-2 border-dashed border-primary dark:border-primary rounded-md p-4">
            {
              userSelected.map((item, index)=>(
                <div key={index.toString()} className="flex flex-col items-center gap-2 bg-background3 dark:bg-background3_dark border border-dashed border-info dark:border-info rounded-md py-4">
                  <div
                    className="relative w-[90%] h-22 3xs:h-24 sm:h-32 cursor-pointer"
                  >
                    
                    <FaUserLarge className="h-full w-full text-info"/> 
                    <div className="absolute top-0 w-full flex justify-between px-1 pt-1">
                      <div
                        onClick={(e: any) => {
                          e.stopPropagation();
                          deleteUserItem(index);
                        }}
                        className="flex justify-center items-center rounded transition text-white bg-[#00000099] sm:hover:bg-[#33333370] text-lg w-6 h-6"
                      >
                        <BiTrash />
                      </div>
                    </div>
                  </div>
                  <div className="mt-4">
                    {item?.user_name&&<p className="text-xs text-center font-['iransans-md'] text-text dark:text-text_dark w-22 sm:w-32 3xs:w-24 h-6">{item.user_name}</p>}
                    {item?.phone&&<p className="text-xs text-center font-['iransans-md'] text-text dark:text-text_dark w-22 sm:w-32 3xs:w-24 h-6">{item.phone}</p>}
                    {item?.name&&<p className="text-xs text-center font-['iransans-md'] text-text dark:text-text_dark w-22 sm:w-32 3xs:w-24 h-6">{item.name}</p>}
                  </div>
                </div>
              ))
            }
        </div>
      )}
      <div className="mt-6">
        <label
          className="font-['iransans-md'] flex-1 text-right text-text6 dark:text-text6_dark text-[.85rem] sm:text-[.95rem] cursor-pointer py-3"
          htmlFor="duration"
        >
          مدت زمان اشتراک (تعداد روز)
          <span className="text-red-500 px-1">*</span>
          <div className={`mt-1 flex gap-2 w-full items-center justify-between`}>
            <Input type="number" id="duration" value={duration} changeState={setDuration} classes="flex-1" inputStyles="!text-base" />
          </div>
        </label>
      </div>
      <div className="mt-6">
        <label
          className="font-['iransans-md'] flex-1 text-right text-text6 dark:text-text6_dark text-[.85rem] sm:text-[.95rem] cursor-pointer py-3"
          htmlFor="name-item"
        >
          عنوان آیتم
          <span className="text-red-500 px-1">*</span>
          <div className={`mt-1 flex gap-2 w-full items-center justify-between`}>
            <Input id="name-item" value={title} changeState={setTitle} classes="flex-1" inputStyles="!text-base" />
          </div>
        </label>
      </div>
        <div className="flex items-center gap-2 w-full pt-2 sm:pt-0 mt-6">
          <div className="flex flex-col gap-1 flex-1 sm:flex-none sm:w-[180px]">
            <div className="font-['iransans-md'] flex-1 text-right text-text6 dark:text-text6_dark text-[.85rem] sm:text-[.95rem] cursor-pointer">تاریخ انقضا</div>
            <div
              className="cursor-pointer border border-primary rounded p-2 font-iransans-md flex items-center justify-between h-[44px]"
              onClick={() => {
                CalendarModalHelper.openModal({
                  callBack: {
                    callBackCalendar: (date: any) => {
                      if (date && date instanceof Date) {
                        const new_date = date?.toISOString()
                        setExpiration(new_date)
                      }
                    },
                  },
                  selectedDate: expiration,
                  minDate: new Date(),
                });
              }}
            >
              <div className="text-primary text-base flex-1 text-center">
                {expiration ? moment(expiration).format("jYYYY-jMM-jDD") : "تاریخ انقضا"}
              </div>
              <div className="text-primary text-lg">
                <LuCalendarDays />
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-1 flex-1 sm:flex-none sm:w-[180px]">
            <div className="font-['iransans-md'] flex-1 text-right text-text6 dark:text-text6_dark text-[.85rem] sm:text-[.95rem] cursor-pointer">ساعت انقضا</div>
            <div className="border border-primary rounded p-2 pr-0 font-iransans-md flex items-center justify-between gap-2 w-full h-full cursor-pointer">
              <select
                value={expirationHour == null ? hours[0] : expirationHour}
                name=""
                id=""
                onChange={(e) => {
                  setExpirationHour(e.target.value)
                }}
                className={`setReportHour w-full text-right text-base pr-2 text-primary focus:!outline-none bg-background2 dark:bg-background2_dark cursor-pointer overflow-y-auto ${dark == "dark" ? "custom-scrollbar-dark" : "custom-scrollbar"
                  }`}
              >
                {hours.map((item: any, index: number) => (
                  <option value={item.value} className="setReportHourOption" key={`${item}${index}`}>
                    {item.name}
                  </option>
                ))}
              </select>
              <div className="text-primary text-lg">
                <LuClock3 />
              </div>
            </div>
          </div>
        </div>
      <div className="mt-6">
        <label
          className="text-right lg:w-2/3 w-5/6 xl:w-3/5 2xl:w-1/2 text-text6 dark:text-text6_dark cursor-pointer font-iransans-md text-sm"
          htmlFor="description-item"
        >
          توضیحات آیتم
          <TextAreaInput
            id={"description-item"}
            value={description}
            changeState={(e: any) => setDescription(e)}
            textAreaStyles="!text-sm mt-1"
            rows={4}
          />
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
          با فعال بودن این گزینه، آیتم قابل نمایش ثبت خواهد شد.
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
      <div className="mt-6">
        <label
          className="text-right lg:w-2/3 w-5/6 xl:w-3/5 2xl:w-1/2 text-text6 dark:text-text6_dark cursor-pointer font-iransans-md text-sm"
          htmlFor="note"
        >
          یادداشت ادمین
          <TextAreaInput
            id={"note"}
            value={note}
            changeState={(e: any) => setNote(e)}
            textAreaStyles="!text-sm mt-1"
            rows={4}
          />
        </label>
      </div>
      <Footer buttonFn={registerAndConfirm} buttonText="ثبت آیتم جدید" loadingButton={loading} classes="md:!mr-72 !justify-end" />
      <ShowImageModal
        ref={(Ref) => {
          ShowImageModalHelper.setRef(Ref);
        }}
      />
      <UserList
        ref={(Ref) => {
          UserListHelper.setRef(Ref);
        }}
      />
      <CalendarModal
        ref={(Ref) => {
          CalendarModalHelper.setRef(Ref);
        }}
      />
    </div>
  );
};

export default Page;
