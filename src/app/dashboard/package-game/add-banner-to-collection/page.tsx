"use client";

import React, { useRef, useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { FaCamera, FaMusic, FaPlay, FaRegSquarePlus, FaVideo } from "react-icons/fa6";
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
import GradientButton from "@/components/GradientButton";
import PackageListHelper from "@/components/PackageList/PackageListHelper";
import PackageList from "@/components/PackageList/PackageList";


type SelectedOption = {
  value: any;
  label: string;
};
const ClickTypeList:SelectedOption[] = [
  {value:null, label:"انتخاب نوع کلیک"},
  {value:"enternal-navigate", label:"رفتن به یک صفحه درون اپلیکیشن"},
  {value:"play-video", label:"پخش ویدیو"},
  {value:"show-image", label:"نمایش عکس"},
  {value:"web-view", label:"بازکردن لینک در وب ویو"},
  {value:"external-link", label:"باز کردن لینک در مرورگر"},
]
const NavigateList:SelectedOption[] = [
  {value:null, label:"انتخاب صفحه‌ی اپلیکیشن برای کلیک"},
  {value:"Package", label:"پکیج بازی"},
  {value:"PackageStage", label:"مرحله از پکیج"},
]
type PackageSelectedInfo = {
  _id: string;
  title: string;
  image: string;
}
const Page = () => {
  const inputImageRef: any = useRef();
  const inputVideoRef: any = useRef();
  const [clickTyoe, setClickType] = useState<string | null>(null)
  const [link, setLink] = useState("")
  const [navigate, setNavigate] = useState<string | null>(null)
  const [navigateParams, setNavigateParams] = useState("")
  const [visible, setVisible] = useState(false);
  const [active, setActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState("")
  const [page, setPage] = useState("")
  const [banner, setBanner] = useState<any>(null)
  const [packageSelected, setPackageSelected] = useState<PackageSelectedInfo | null>(null)
  
  const registerAndConfirm = ()=>{
    if(!banner){
      toast.error("برای ایجاد بنر انتخاب تصویر یا ویدیو الزامی است.", {
        position: "top-center",
        autoClose: 4000,
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
          mutation newBannerDefinitionForPackageGameCollection(
              $banner : FileInput!,
              $package : ID,
              $click_type : String!,
              $link : String,
              $navigate : String,
              $navigate_params : String,
              $order : Int!,
              $page : Int!,
              $is_visible : Boolean!,
              $is_active : Boolean!,
          ){
            newBannerDefinitionForPackageGameCollection(
                banner : $banner,
                package : $package,
                click_type : $click_type,
                link : $link,
                navigate : $navigate,
                navigate_params : $navigate_params,
                order : $order,
                page : $page,
                is_visible : $is_visible,
                is_active : $is_active,
            ) {
              status,
              message,
            }
          }
          `,
      variables: {
        banner: (banner?.file) ? { file: null, duration: banner?.duration??undefined } : undefined,
        package:packageSelected?._id?packageSelected._id:undefined,
        click_type: clickTyoe,
        link: link?.length > 7?link:undefined,
        navigate: navigate,
        navigate_params: navigateParams?.length>0?navigateParams:undefined,
        order: Number(order),
        page: Number(page),
        is_visible: visible,
        is_active: active,
      },
    };
    let map: any = {};
    let fileIndex = 0;
    if (banner?.file) {
      map[fileIndex] = [`variables.banner.file`];
    }
    let formD = new FormData();
    formD.append("operations", JSON.stringify(data));
    formD.append("map", JSON.stringify(map));
    if (banner?.file) {
      formD.append(`${fileIndex}`, banner.file);
    }
    await axios({
      url: "/",
      method: "post",
      data: formD,
      headers: {
        Accept: "*/*",
        "Content-Type": "multipart/form-data",
      },
    })
      .then(async (response) => {
        console.log(response)
        setLoading(false);
        if (response.data?.data?.newBannerDefinitionForPackageGameCollection?.status == 200) {
            toast.success(response.data?.data?.newBannerDefinitionForPackageGameCollection?.message, {
              position: "top-center",
              autoClose: 6000,
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
            autoClose: 6000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: typeof window !== "undefined" && localStorage.getItem("theme") == "dark" ? "dark" : "light",
          });
        }
      })
      .catch((e) => {
        console.log(e)
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
    const photo = e.target.files;
    const data = {
      file: photo[0],
      preview: URL.createObjectURL(photo[0]),
    };
    setBanner(data);
    inputImageRef.current.value = "";
  };

  const handleAddVideos = (e: any) => {
    const uri = URL.createObjectURL(e.target.files[0]);
    var videoElement = document.createElement("video");
    videoElement.preload = "metadata";
    videoElement.src = URL.createObjectURL(e.target.files[0]);
    videoElement.onloadedmetadata = function () {
      const videos = e.target.files;
      window.URL.revokeObjectURL(videoElement.src);
      const duration = videoElement.duration;
      if (duration < 30) {
        toast.warning("ویدیوی انتخابی نمیتواند کمتر از 30 ثانیه باشد.", {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: typeof window !== "undefined" && localStorage.getItem("theme") == "dark" ? "dark" : "light",
        });
      } else if (duration > 120) {
        toast.warning("ویدیوی انتخابی نمیتواند بیشتر از 120 ثانیه باشد.", {
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
        const data = {
          file: videos[0],
          preview: uri,
          duration: duration.toFixed(0).toString(),
        };
        setBanner(data);
        inputVideoRef.current.value = "";
      }
    };
  };
  
  const deleteBanner = ()=>{
    setBanner(null)
  }

  const selectPackages = ()=>{
    const previousSelected = packageSelected?{
      _id: [packageSelected?._id],
      title: [packageSelected?.title],
      image: [packageSelected?.image],
    }:undefined;
    PackageListHelper.openModal({
      previousSelected:previousSelected,
      numberSelected: 1,
      buttons: [
        {
          buttonText: "لغو",
          type: "border",
          onClickFn: () => {
            PackageListHelper.closeModal();
          },
        },
        {
          buttonText: "انتخاب بسته‌ها",
          type: "bold",
          onClickFn: ({ data }: { data: any }) => {
            setPackageSelected({
              _id: data._id[0],
              title: data.title[0],
              image: data.image[0],
            })
            PackageListHelper.closeModal();
          },
        },
      ],
    });
  }
  const deletePackageItem = () => {
    setPackageSelected(null);
  };

  return (
    <div className="flex flex-col justify-between w-full lg:w-[600px] 2xl:w-[750px] mt-10 mb-28 px-4 sm:mx-auto">
      
      <div className="flex gap-6 justify-center font-['iransans-md'] mt-1">
        <label
          className="text-text6 dark:text-text6_dark border-2 border-dashed border-text5 dark:border-text5_dark py-6 text-lg flex-1 rounded-md cursor-pointer transition sm:hover:bg-border2 sm:dark:hover:bg-border2_dark flex flex-col justify-center items-center gap-y-2"
          htmlFor="collection_photo_banner"
          tabIndex={0}
        >
          <div className="text-4xl">
            <FaCamera />
          </div>
          <p className="text-xs 3xs:text-sm text-center">افزودن عکس برای بنر</p>
          <input
            ref={inputImageRef}
            className="hidden"
            id="collection_photo_banner"
            type="file"
            accept="image/*"
            onChange={handleAddPhotos}
          />
        </label>
        <label
          className="text-text6 dark:text-text6_dark border-2 border-dashed border-text5 dark:border-text5_dark py-6 text-lg flex-1 rounded-md cursor-pointer transition sm:hover:bg-border2 sm:dark:hover:bg-border2_dark flex flex-col justify-center items-center gap-y-2"
          htmlFor="collection_video_banner"
        >
          <div className="text-4xl">
            <FaVideo />
          </div>
          <p className="text-xs 3xs:text-sm text-center">افزودن ویدیو برای بنر</p>
          <input
            ref={inputVideoRef}
            className="hidden"
            id="collection_video_banner"
            type="file"
            accept="video/*"
            onChange={handleAddVideos}
          />
        </label>
      </div>




        {banner && (
        <div className="mt-4 border-2 border-dashed border-primary rounded-md py-4 px-2">
          <div className="flex justify-center items-center gap-4">
            <div
              className="relative w-40 h-20 sm:w-60 sm:h-28 cursor-pointer"
              onClick={() =>{
                if (banner?.file?.type.includes("video") == true) {
                    ShowVideoModalHelper.showModal({
                      src: banner?.preview,
                    });
                  } else {
                    ShowImageModalHelper.showModal({
                      src: banner?.preview,
                    })
                  }
              }}
            >
              {banner.file.type.includes("video") == true ? (
                <div className="relative h-full w-full">
                  <video src={banner.preview} className="inset-0 h-full w-full rounded-md object-cover" />
                  <div className="absolute top-[26%] right-[26%] text-xl sm:text-2xl text-primary bg-background6 bg-opacity-30 rounded-full p-3">
                    <FaPlay />
                  </div>
                  <div className="absolute bottom-1 left-1 flex items-center gap-2 bg-[#00000099] rounded px-1">
                    <p className="text-xs font-['iransans-light'] text-white">{secondsToTime(banner.duration)}</p>
                    <div className="text-sm text-white">
                      <IoIosVideocam />
                    </div>
                  </div>
                </div>
              ) : (
                <ImageComponent
                  src={banner?.preview}
                  alt="banner"
                  baseURI={false}
                  parentclasses="h-full w-full object-cover rounded-md cursor-pointer"
                />
              )}
              <div className="absolute top-0 w-full flex justify-between px-1 pt-1">
                <div
                  onClick={(e: any) => {
                    e.stopPropagation();
                    deleteBanner();
                  }}
                  className="flex justify-center items-center rounded transition text-white bg-[#00000080] hover:bg-[#33333370] text-lg w-6 h-6"
                >
                  <BiTrash />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      <div className="mt-12">
        <GradientButton
          buttonText={"انتخاب بسته و پکیج بنر"}
          onClickFn={selectPackages}
          loading={false}
          classes="!text-sm !flex-none !px-8 sm:!w-[300px] !w-full"
        />
      </div>
      {packageSelected && (
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-y-12 gap-x-2 sm:gap-y-12 sm:gap-x-2 mt-4 border-2 border-dashed border-primary dark:border-primary rounded-md p-4">

            <div className="flex flex-col items-center gap-2 bg-background3 dark:bg-background3_dark border border-dashed border-info dark:border-info rounded-md py-4">
              <div
                className="relative w-[90%] h-22 3xs:h-24 sm:h-32 cursor-pointer"
              >

                  <ImageComponent
                    src={packageSelected.image}
                    alt={"file_photos"}
                    parentclasses="h-full w-full cursor-pointer"
                  />
                <div className="absolute top-0 w-full flex justify-between px-1 pt-1">
                  <div
                    onClick={(e: any) => {
                      e.stopPropagation();
                      deletePackageItem();
                    }}
                    className="flex justify-center items-center rounded transition text-white bg-[#00000099] sm:hover:bg-[#33333370] text-lg w-6 h-6"
                  >
                    <BiTrash />
                  </div>
                </div>
              </div>
              <p className="text-xs text-center font-['iransans-md'] text-text dark:text-text_dark w-22 sm:w-32 3xs:w-24 h-8">{packageSelected.title}</p>
            </div>

        </div>
      )}
      <div className="mt-6">
        <label
          className="font-['iransans-md'] flex-1 text-right text-text6 dark:text-text6_dark text-[.85rem] sm:text-[.95rem] cursor-pointer py-3"
          htmlFor="collection-banner-order"
        >
          ترتیب نمایش بنر
          <span className="text-red-500 px-1">*</span>
          <div className={`mt-1 flex gap-2 w-full items-center justify-between`}>
            <Input type="number" id="collection-banner-order" value={order} changeState={setOrder} classes="flex-1" inputStyles="!text-base" />
          </div>
        </label>
      </div>
      <div className="mt-6">
        <label
          className="font-['iransans-md'] flex-1 text-right text-text6 dark:text-text6_dark text-[.85rem] sm:text-[.95rem] cursor-pointer py-3"
          htmlFor="collection-banner-page"
        >
          صفحه نمایش بنر
          <span className="text-red-500 px-1">*</span>
          <div className={`mt-1 flex gap-2 w-full items-center justify-between`}>
            <Input type="number" id="collection-banner-page" value={page} changeState={setPage} classes="flex-1" inputStyles="!text-base" />
          </div>
        </label>
      </div>
      <div className="mt-6">
        <label
          className="font-['iransans-md'] flex-1 text-right text-text6 dark:text-text6_dark text-[.85rem] sm:text-[.95rem] cursor-pointer py-3"
          htmlFor="collection-banner-click-type"
        >
          نوع کلیک
          <span className="text-red-500 px-1">*</span>
          <div className={`mt-1 flex-1 gap-2 w-full items-center justify-between`}>
            <SelectInput
              name="collection-banner-click-type"
              options={ClickTypeList}
              onChange={(value) => setClickType(value)}
            />
          </div>
        </label>
      </div>
      
      <div className="mt-6">
        <label
          className="font-['iransans-md'] flex-1 text-right text-text6 dark:text-text6_dark text-[.85rem] sm:text-[.95rem] cursor-pointer py-3"
          htmlFor="collection-banner-link"
        >
          آدرس لینک
          <div className={`mt-1 flex gap-2 w-full items-center justify-between`}>
            <Input id="collection-banner-link" value={link} changeState={setLink} classes="flex-1" inputStyles="!text-base" />
          </div>
        </label>
      </div>

      <div className="mt-6">
        <label
          className="font-['iransans-md'] flex-1 text-right text-text6 dark:text-text6_dark text-[.85rem] sm:text-[.95rem] cursor-pointer py-3"
          htmlFor="ollection-banner-other-params"
        >
          پارامترهای ارسالی
          <div className={`mt-1 flex gap-2 w-full items-center justify-between`}>
            <Input id="ollection-banner-other-params" value={navigateParams} changeState={setNavigateParams} classes="flex-1" inputStyles="!text-base" />
          </div>
        </label>
      </div>
      <div className="mt-6">
        <label
          className="font-['iransans-md'] flex-1 text-right text-text6 dark:text-text6_dark text-[.85rem] sm:text-[.95rem] cursor-pointer py-3"
          htmlFor="name"
        >
          صفحه‌ی اپلیکیشن برای کلیک
          <div className={`mt-1 flex-1 gap-2 w-full items-center justify-between`}>
            <SelectInput
              name="stage-game-language"
              options={NavigateList}
              onChange={(value) => setNavigate(value)}
            />
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
      <Footer buttonFn={registerAndConfirm} buttonText="ثبت بنر" loadingButton={loading} classes="md:!mr-72 !justify-end" />
     
      
      <PackageList
        ref={(Ref) => {
          PackageListHelper.setRef(Ref);
        }}
      />
      <ShowVideoModal
        ref={(Ref) => {
          ShowVideoModalHelper.setRef(Ref);
        }}
      />
      <ShowImageModal
        ref={(Ref) => {
          ShowImageModalHelper.setRef(Ref);
        }}
      />
      <ModalInput
        ref={(Ref) => {
          ModalInputHelper.setRef(Ref);
        }}
      />
    </div>
  );
};

export default Page;
