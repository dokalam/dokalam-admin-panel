"use client";

import axios from "axios";
import React, { useRef, useState, useEffect } from "react";
import { FaCamera, FaPlay, FaRegSquarePlus, } from "react-icons/fa6";
import { toast } from "react-toastify";
import DialogHelper from "@/components/Dialog/DialogHelper";
import { BiEditAlt, BiTrash } from "react-icons/bi";
import { secondsToTime } from "@/utils/SecondToTime";
import ImageComponent from "@/components/ImageComponent";
import ShowImageModalHelper from "@/components/ShowMediaModal/ShowImageModalHelper";
import ShowImageModal from "@/components/ShowMediaModal/ShowImageModal";
import Input from "@/components/Input";
import TextAreaInput from "@/components/TextAreaInput";
import { priceDigitSeperator } from "@/utils/PriceDigitSeparator";
import { numberToWords } from "@persian-tools/persian-tools";
import { MdDelete } from "react-icons/md";
import { IoClose } from "react-icons/io5";
import Footer from "@/components/Footer/Footer";
import Border from "@/components/Border";
import { Switch } from "@headlessui/react";
import SelectInput from "@/components/SelectInput";

const Page = () => {
  const inputImageRef: any = useRef();
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState<any>(null);
  const [title, setTitle] = useState("");
  const [code, setCode] = useState("");
  const [child, setChild] = useState(false)
  const [parent, setParent] = useState<string | null>(null)
  const [categoryList, setCategoryList] = useState([])
  const [iconName, setIconName] = useState("")
  const [iconType, setIconType] = useState("")
  const [visible, setVisible] = useState(false);
  const [active, setActive] = useState(false);

  useEffect(()=>{
      getAllLanguage()
    }, [])
  const getAllLanguage = async()=>{
    const data = {
      query: `
        query getAllPackageCategoryForAdmin($parent : ID){
          getAllPackageCategoryForAdmin(parent : $parent) {
            _id,
            name,
          }
        }
        `,
      variables: {
        parent: undefined,
      },
    };
    await axios({
      url: "/",
      method: "post",
      data: data,
    }).then(async (response) => {
      const data = response.data.data.getAllPackageCategoryForAdmin;
      if (data.length > 0) {
        const items = data.map((item: any) => ({
          label: item.name,
          value: item._id,
        }));
        items.unshift({
          label: "انتخاب دسته بندی",
          value: null,
        })
        setCategoryList(items);
      }
    })
    .catch(() => {
      setCategoryList([])
    });
  }
  
  const handleAddPhotos = (e: any) => {
    const photo = e.target.files;
    const data = {
      file: photo[0],
      preview: URL.createObjectURL(photo[0]),
    };
    setImage(data);
    inputImageRef.current.value = "";
  };

  const deleteMediaItem = () => {
    setImage(null);
  };

  const registerAndConfirm = ()=>{
    if(title.length == 0 || code.length == 0){
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
  const checkedAndRegister = async () => {
    setLoading(true);
    let data = {
      query: `
          mutation newPackageCategoryDefinitionForPackageGame(
            $title : String!,
            $code : String!,
            $child : Boolean!,
            $parent : ID,
            $image : Upload,
            $icon_name : String,
            $icon_type : String,
            $is_visible : Boolean!,
            $is_active : Boolean!
          ){
            newPackageCategoryDefinitionForPackageGame(
                title : $title,
                code : $code,
                child : $child,
                parent : $parent,
                image : $image,
                icon_name : $icon_name,
                icon_type : $icon_type,
                is_visible : $is_visible,
                is_active : $is_active,
            ) {
              status,
              message,
            }
          }
          `,
      variables: {
        title : title,
        code : code,
        child : child,
        parent : parent??undefined,
        image : null,
        icon_name : (iconName.length>2 && iconType.length>2)?iconName:undefined,
        icon_type : (iconName.length>2 && iconType.length>2)?iconType:undefined,
        is_visible : visible,
        is_active : active,
      },
    };
    await axios({
      url: "/",
      method: "post",
      data: data,
    })
      .then(async (response) => {
        setLoading(false);
        if (response.data?.data?.newPackageCategoryDefinitionForPackageGame?.status == 200) {
            toast.success(response.data?.data?.newPackageCategoryDefinitionForPackageGame?.message, {
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
            setCode("")
            setIconName("")
            setIconType("")
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
            onChange={handleAddPhotos}
          />
        </label>
      </div>

      {image && (
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-y-4 sm:gap-y-4 mt-4 border-2 border-dashed border-primary rounded-md py-2">
          <div className="w-full h-20 3xs:h-24 sm:h-28 flex justify-center items-center">
            <div
              className="relative w-20 h-20 3xs:w-24 3xs:h-24 sm:w-28 sm:h-28 cursor-pointer"
              onClick={() => {
                  ShowImageModalHelper.showModal({
                    src: image.preview,
                  });
              }}
            >
                <ImageComponent
                  src={image.preview}
                  alt={"file_photos"}
                  baseURI={false}
                  parentclasses="h-full w-full cursor-pointer"
                />
              <div className="absolute top-0 w-full flex justify-between px-1 pt-1">
                <div
                  onClick={(e: any) => {
                    e.stopPropagation();
                    deleteMediaItem();
                  }}
                  className="flex justify-center items-center rounded transition text-white bg-[#00000080] sm:hover:bg-[#33333370] text-lg w-6 h-6"
                >
                  <BiTrash />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="mt-6">
        <label
          className="font-['iransans-md'] flex-1 text-right text-text6 dark:text-text6_dark text-[.85rem] sm:text-[.95rem] cursor-pointer py-3"
          htmlFor="name"
        >
          نام دسته بندی
          <span className="text-red-500 px-1">*</span>
          <div className={`mt-1 flex gap-2 w-full items-center justify-between`}>
            <Input id="name" value={title} changeState={setTitle} classes="flex-1" inputStyles="!text-base" />
          </div>
        </label>
      </div>
      <div className="mt-6">
        <label
          className="font-['iransans-md'] flex-1 text-right text-text6 dark:text-text6_dark text-[.85rem] sm:text-[.95rem] cursor-pointer py-3"
          htmlFor="code-stage-language"
        >
          کد دسته بندی
          <span className="text-red-500 px-1">*</span>
          <div className={`mt-1 flex gap-2 w-full items-center justify-between`}>
            <Input id="code-stage-language" value={code} changeState={setCode} classes="flex-1" inputStyles="!text-base" />
          </div>
        </label>
      </div>
      <div className="mt-6">
        <label
          className="font-['iransans-md'] flex-1 text-right text-text6 dark:text-text6_dark text-[.85rem] sm:text-[.95rem] cursor-pointer py-3"
          htmlFor="name"
        >
          نام آیکون
          <div className={`mt-1 flex gap-2 w-full items-center justify-between`}>
            <Input id="name" value={iconName} changeState={setIconName} classes="flex-1" inputStyles="!text-base" />
          </div>
        </label>
      </div>
      <div className="mt-6">
        <label
          className="font-['iransans-md'] flex-1 text-right text-text6 dark:text-text6_dark text-[.85rem] sm:text-[.95rem] cursor-pointer py-3"
          htmlFor="name"
        >
          تایپ آیکون
          <div className={`mt-1 flex gap-2 w-full items-center justify-between`}>
            <Input id="name" value={iconType} changeState={setIconType} classes="flex-1" inputStyles="!text-base" />
          </div>
        </label>
      </div>
      <div className="mt-6">
        <label
          className="font-['iransans-md'] flex-1 text-right text-text6 dark:text-text6_dark text-[.85rem] sm:text-[.95rem] cursor-pointer py-3"
          htmlFor="name"
        >
          والد دسته بندی
          <div className={`mt-1 flex-1 gap-2 w-full items-center justify-between`}>
            <SelectInput
              name="stage-game-language"
              options={categoryList}
              onChange={(value) => setParent(value || null)}
            />
          </div>
        </label>
      </div>
      <div
        className="py-4 cursor-pointer sm:hover:bg-border2 dark:sm:hover:bg-border2_dark transition select-none"
        onClick={() => setChild((last) => !last)}
      >
        <div className="flex items-center justify-between w-full h-[42px] pl-2 rounded">
          <label className={`text-sm font-['iransans-md'] cursor-pointer`}>
            <h3 className="text-text dark:text-text_dark font-['iransans-md'] text-[15px]">
              زیر شاخه دارد
            </h3>
          </label>
          <Switch
            checked={child}
            onChange={() => setChild((last) => !last)}
            onClick={(e) => e.stopPropagation()}
            className={`${child ? "bg-rgba2" : "bg-border dark:bg-border_dark"}
relative h-[19px] w-[33px] shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out flex items-center`}
          >
            <span
              aria-hidden="true"
              className={`${
                child
                  ? "translate-x-2 bg-primary"
                  : "-translate-x-[16px] bg-text5 dark:bg-text5_dark"
              }
pointer-events-none inline-block h-[22px] w-[22px] transform rounded-full shadow-lg ring-0 transition duration-200 ease-in-out`}
            />
          </Switch>
        </div>
        <p className="text-justify font-['iransans-md'] text-text5 dark:text-text5_dark text-[12px] sm:text-[14px] mb-1">
          با فعال بودن این گزینه، دسته بندی دارای زیر شاخه ثبت خواهد شد.
        </p>
      </div>
      <Border />
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


      <Footer buttonFn={registerAndConfirm} buttonText="ثبت دسته بندی" loadingButton={loading} classes="md:!mr-72 !justify-end" />
      <ShowImageModal
        ref={(Ref) => {
          ShowImageModalHelper.setRef(Ref);
        }}
      />
    </div>
  );
};

export default Page;
