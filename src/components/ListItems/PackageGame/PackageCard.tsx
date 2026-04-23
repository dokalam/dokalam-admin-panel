import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { BsMusicNoteBeamed } from "react-icons/bs";
import { IoIosVideocam, IoMdEye, IoMdEyeOff } from "react-icons/io";
import { MdVerifiedUser } from "react-icons/md";
import { FaPlay } from "react-icons/fa";
import ImageComponent from "@/components/ImageComponent";
import { secondsToTime } from "@/utils/SecondToTime";
import { HiDotsVertical } from "react-icons/hi";
import { FaImage, FaPencil } from "react-icons/fa6";
import Globals from "@/utils/Globals";
import GradientButton from "@/components/GradientButton";

const PackageCard = ({
  _id,
  rtl,
  title,
  description,
  subject,
  language,
  icon_image,
  banner_image,
  music,
  badge,
  topic_category_info,
  package_collection_all,
  free,
  free_with_subscription,
  price,
  number_stage,
  number_season,
  is_visible,
  is_active,
  publication_status,
  completion_status,
  rating_number,
  rating_average,
  version_created_pending_diff,
  version_updated_pending_diff,
  version_deleted_pending_diff,
}: {
  _id: string;
  rtl: boolean;
  title: string;
  description?: string;
  subject?: string;
  language: string;
  icon_image?: string;
  banner_image?: string;
  music?: {
    path: string;
    file_type?: string;
    duration?: string;
  };
  badge?: string;
  topic_category_info?:{
    title: string;
  }[];
  package_collection_all?:{
    title: string;
  }[];
  free?: boolean;
  free_with_subscription?: boolean;
  price?: number;
  number_stage?: number;
  number_season?: number;
  is_visible: boolean;
  is_active: boolean;
  publication_status: string;
  completion_status: string;
  rating_number?: number;
  rating_average?: number;
  version_created_pending_diff?: number;
  version_updated_pending_diff?: number;
  version_deleted_pending_diff?: number;
}) => {
  const router = useRouter();
  const direction = rtl ? "rtl" : "ltr";
  const textAlign = rtl ? "text-right" : "text-left";
  const flexDir = rtl ? "flex-row-reverse" : "flex-row";
  const itemAlign = rtl ? "items-end sm:items-start" : "items-start sm:items-end";
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const packageId = _id


  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div 
      dir={direction} 
      className={`flex flex-col justify-between relative w-full p-4 rounded-2xl shadow-bottom dark:shadow-bottom-dark m-1 bg-background7 dark:bg-background7_dark gap-4 ${textAlign}`}
      >
        <div className="flex flex-col gap-4">
          <div
            className={`absolute top-2 ${rtl ? "left-2" : "right-2"} z-20`}
            ref={menuRef}
          >
            <div className="relative inline-block text-left">
              <button
                onClick={() => setMenuOpen((prev) => !prev)}
                className="p-1 rounded-full text-primary hover:bg-rgba0 hover:text-white"
              >
                <HiDotsVertical className="text-xl" />
              </button>
              {menuOpen && (
                <div
                  ref={menuRef}
                  className={`absolute mt-2 w-60 rounded-[15px] font-['iransans-md'] shadow-lg bg-background2 dark:bg-background2_dark ring-1 ring-black ring-opacity-5 focus:outline-none z-30 left-6`}
                >
                  <div className="py-4">
                    <button
                      className="block flex flex-row items-center gap-2 w-full text-right px-2 py-4 text-sm text-text2 dark:text-text2_dark hover:bg-border dark:hover:bg-border_dark"
                      onClick={() => {
                        router.push(`/dashboard/manage-package-game/package-list/edit-package/${packageId}`)
                      }}
                    >
                      <FaPencil className="text-text4 dark:text-text4_dark text-lg"/>
                      ویرایش اطلاعات
                    </button>
                    <button
                      className="block flex flex-row items-center gap-2 w-full text-right px-2 py-4 text-sm text-text2 dark:text-text2_dark hover:bg-border dark:hover:bg-border_dark"
                      onClick={() => {
                        router.push(`/dashboard/manage-package-game/package-list/edit-package-media/${packageId}`)
                      }}
                    >
                      <FaImage className="text-text4 dark:text-text4_dark text-lg"/>
                      ویرایش رسانه
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
          {/* رسانه‌ها */}
          {(icon_image || banner_image || music) && (
            <div className="grid grid-cols-3 gap-2 mt-2">
              {
                icon_image &&(
                  <div className="aspect-video overflow-hidden rounded-lg h-20 w-20">
                    <ImageComponent
                      src={icon_image}
                      alt="media_image"
                      baseURI={true}
                      parentclasses="h-20 w-20 object-cover rounded-lg"
                    />
                  </div>
                )
              }
              {
                banner_image &&(
                  <div className="aspect-video overflow-hidden rounded-lg h-20 w-36">
                    <ImageComponent
                      src={banner_image}
                      alt="media_image"
                      baseURI={true}
                      parentclasses=" h-20 w-36 object-cover rounded-lg"
                    />
                  </div>
                )
              }
              {music && (
                <div className="relative bg-primary bg-opacity-10 rounded-lg p-3 w-full col-span-1 sm:col-span-2">
                  <audio src={`${Globals.uri}${music.path}`} controls className="w-full rounded-md" />
                  <BsMusicNoteBeamed className="absolute top-2 right-2 text-primary text-xl" />
                </div>
              )}
            </div>
          )}
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <h2 className="text-lg font-['iransans-bold'] text-text dark:text-text_dark">{title}</h2>
            {badge && (
              <span className="text-xs bg-info text-white px-2 py-1 rounded font-['iransans-md']">
                {badge}
              </span>
            )}
          </div>
          <div className="mt-2 text-[16px] flex flex-wrap gap-x-6 gap-y-1 text-primary font-['iransans-md']">
            <p>
              <span className="text-text5 dark:text-text5_dark">تعداد امتیاز: </span>
              {rating_number??"0"}
            </p>
            {rating_average&&(<p>
              <span className="text-text5 dark:text-text5_dark">میانگین امیتیاز: </span>
              {rating_average}
            </p>)}
          </div>
          <div className="mt-2 text-sm flex flex-wrap gap-x-6 gap-y-1 text-text dark:text-text_dark font-['iransans-md']">
            <p>
              <span className="text-text5 dark:text-text5_dark">زبان: </span>
              {language}
            </p>
            <p>
              <span className="text-text5 dark:text-text5_dark">تعداد فصل: </span>
              {number_season}
            </p>
            <p>
              <span className="text-text5 dark:text-text5_dark">تعداد  مراحل: </span>
              {number_stage}
            </p>
          </div>
          <div className="mt-2 text-sm flex flex-wrap gap-x-6 gap-y-1 text-text6 dark:text-text6_dark font-['iransans-md']">
            {subject&&(<p>
              <span className="text-text5 dark:text-text5_dark">موضوع: </span>
              {subject}
            </p>)}
            {
              description&&<p className="text-text5 dark:text-text5_dark text-[12px] mt-2">{description}</p>
            }
          </div>
        </div>
        <div className="flex flex-col gap-4">
          <div className="mt-2 text-sm flex flex-row gap-x-2 gap-y-1 font-['iransans-md']">
            <p className="text-warning">
              <span className="text-text5 dark:text-text5_dark">قیمت: </span>
              {free == true? `رایگان`:`${price} سکه`}
            </p>
            <p className={free_with_subscription == true?"text-info":"text-red_color"}>
              {free_with_subscription == true? `(با اشتراک رایگان)`:`(با اشتراک غیر رایگان)`}
            </p>
          </div>
          <div className="mt-2 flex flex-wrap gap-2 text-xs font-['iransans-md'] text-text dark:text-text_dark">
            <span className="bg-yellow-100 dark:bg-yellow-800 px-2 py-1 rounded">
              انتشار: {publication_status}
            </span>
            <span className="bg-green-100 dark:bg-green-800 px-2 py-1 rounded">
              تکمیل: {completion_status}
            </span>
          </div>
          {
            (topic_category_info && topic_category_info?.length > 0)&&(
              <div className="mt-2 flex flex-wrap items-center gap-2 font-['iransans-md'] text-[10px] dark:text-text5_dark">
                <span className="text-text5 dark:text-text5_dark">کالکشن‌ها: </span>
                {
                  package_collection_all?.map((item, index)=>(
                    <span key={index.toString()} className="bg-[#33b5e530] px-2 py-1 rounded">
                      {item.title}
                    </span>
                  ))  
                }
              </div>
            )
          }
          {
            (topic_category_info && topic_category_info?.length > 0)&&(
              <div className="mt-2 flex flex-wrap items-center gap-2 font-['iransans-md'] text-[10px] dark:text-text5_dark">
                <span className="text-text5 dark:text-text5_dark">دسته بندی‌ها: </span>
                {
                  topic_category_info?.map((item, index)=>(
                    <span key={index.toString()} className="bg-[#33b5e530] px-2 py-1 rounded">
                      {item.title}
                    </span>
                  ))  
                }
              </div>
            )
          }
          <div className={`flex sm:flex-col gap-2 ${itemAlign} text-sm font-['iransans-md'] text-text6 dark:text-text6_dark`}>
            <div className="flex items-center gap-1">
              {is_visible ? (
                <IoMdEye className="text-green-600" />
              ) : (
                <IoMdEyeOff className="text-red-600" />
              )}
              <span className="hidden sm:inline">
                {is_visible ? "قابل نمایش" : "مخفی"}
              </span>
            </div>

            <div className="flex items-center gap-1">
              <MdVerifiedUser
                className={`${
                  is_active ? "text-green-600" : "text-gray-400"
                }`}
              />
              <span className="hidden sm:inline">
                {is_active ? "فعال" : "غیرفعال"}
              </span>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            {
              (version_created_pending_diff && version_created_pending_diff > 0)?
              <GradientButton
                  buttonText={"در انتظار اعمال ورژن ایجاد"}
                  onClickFn={()=>{}}
                  loading={false}
                  type={"border"}
                  classes="!text-base !px-8 !w-full rounded-[15px] !bg-red_error"
              />:null
            }
            {
              (version_updated_pending_diff && version_updated_pending_diff > 0)?
              <GradientButton
                  buttonText={"در انتظار اعمال ورژن آپدیت"}
                  onClickFn={()=>{}}
                  loading={false}
                  type={"border"}
                  classes="!text-base !px-8 !w-full rounded-[15px] !bg-red_error"
              />:null
            }
            {
              (version_deleted_pending_diff && version_deleted_pending_diff > 0)?
              <GradientButton
                  buttonText={"در انتظار اعمال ورژن حذف"}
                  onClickFn={()=>{}}
                  loading={false}
                  type={"border"}
                  classes="!text-base !px-8 !w-full rounded-[15px] !bg-red_error"
              />:null
            }
          </div>
        </div>
    </div>
  );
};

export default PackageCard;