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

const StageCard = ({
  type,
  _id,
  parts,
  stage_hint,
  packageInfo,
  season,
  stage_number,
  stage_number_in_season,
  rtl,
  language,
  media,
  voice,
  is_visible,
  is_active,
  publication_status,
  completion_status,
}: {
  type: "stage-game" | "package-game";
  _id: string;
  parts: {
    sentence: string;
    sentence_hint?: string;
    sentence_display?: string;
    words:{
      word: string;
      unknown_word: boolean;
      letters: string[];
      additional_words: string[];
      hidden_words: string[];
    }[]
  }[],
  stage_number: number;
  stage_number_in_season: number;
  stage_hint?: string;
  packageInfo?: {
    title: string;
    icon_image?: string;
  };
  season:{
    title: string;
    season_number: number;
  },
  rtl: boolean;
  language: string;
  media?: {
    path: string;
    order?: number;
    file_type?: string;
    duration?: string;
  }[];
  voice?: {
    path: string;
    order?: number;
    file_type?: string;
    duration?: string;
  }[];
  is_visible: boolean;
  is_active: boolean;
  publication_status: string;
  completion_status: string;
}) => {
  const router = useRouter();
  const direction = rtl ? "rtl" : "ltr";
  const textAlign = rtl ? "text-right" : "text-left";
  const flexDir = rtl ? "flex-row-reverse" : "flex-row";
  const itemAlign = rtl ? "items-end sm:items-start" : "items-start sm:items-end";
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const stageId = _id


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
      className={`relative w-full p-4 rounded-2xl shadow-bottom dark:shadow-bottom-dark m-1 bg-background7 dark:bg-background7_dark flex flex-col justify-between gap-4 ${textAlign}`}
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
                      if(type == "stage-game"){
                        router.push(`/dashboard/manage-stage-game/stage-list/edit-stage/${stageId}`)
                      } else if(type == "package-game"){
                        router.push(`/dashboard/manage-package-game/stage-list/edit-stage/${stageId}`)
                      }
                    }}
                  >
                    <FaPencil className="text-text4 dark:text-text4_dark text-lg"/>
                    ویرایش اطلاعات
                  </button>
                  <button
                    className="block flex flex-row items-center gap-2 w-full text-right px-2 py-4 text-sm text-text2 dark:text-text2_dark hover:bg-border dark:hover:bg-border_dark"
                    onClick={() => {
                      if(type == "stage-game"){
                        router.push(`/dashboard/manage-stage-game/stage-list/edit-stage-media/${stageId}`)
                      } else if(type == "package-game"){
                        router.push(`/dashboard/manage-package-game/stage-list/edit-stage-media/${stageId}`)
                      }
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
        {
            (type == "package-game" && packageInfo) && (
            <div className="flex w-full items-center justify-between mt-6">
              {
                packageInfo?.icon_image && (
                  <ImageComponent
                    parentclasses="w-12 h-12 lg:h-18 lg:w-18 2xl:h-18 2xl:w-18 !rounded-xl"
                    imageClasses="!rounded-xl"
                    src={packageInfo.icon_image}
                  />
                )
              }
              <div className="flex-1 pr-3 flex flex-col justify-between font-['iransans-md']">
                <div className="flex items-center">
                  <h3 className="text-sm 2xl:text-base text-text dark:text-text_dark line-clamp-1">
                    {packageInfo.title}
                  </h3>
                </div>
                <div className="bg-primary dark:bg-primary px-6 rounded text-white text-[16px] w-fit">
                  <p>{`مرحله ${stage_number}`}</p>
                </div>
              </div>
            </div>
          )
        }
        <div className="mt-2 text-sm flex flex-col gap-x-6 gap-y-4 text-text6 dark:text-text6_dark font-['iransans-md']">
          {
            type == "stage-game"&&
            <div className="bg-primary dark:bg-primary px-4 py-1 rounded text-white text-[16px] w-fit">
              <p>{`مرحله ${stage_number} زبان ${language}`}</p>
            </div>
          }
          <div className="py-2 text-[12px]">
            <p>{`فصل ${season.title} ( مرحله ${stage_number_in_season} در فصل ${season.season_number} )`}</p>
            {
              type == "package-game"&&
                <p className="mt-2">{`زبان ${language}`}</p>
            }
          </div>
        </div>
        <div className="flex flex-col gap-6">
          {
            parts.map((item, index)=>(
              <div key={index.toString()} className="flex flex-col gap-2 bg-background6 dark:bg-background5_dark px-2 py-6 rounded w-full border border-dashed border-text5 dark:border-text5_dark">
                <p className="text-info text-[16px] font-['iransans-bold']">{item.sentence}</p>
                {item?.sentence_display&&<p className="text-text5 dark:text-text5_dark text-[12px] font-['iransans-md']">{item.sentence_display}</p>}
                {item?.sentence_hint&&<p className="text-text5 dark:text-text5_dark text-[12px] font-['iransans-md']">{item.sentence_hint}</p>}
                <div className="flex flex-wrap gap-2 mt-4">
                  {
                    item?.words.map((item2, index2)=>(
                      <div key={index2.toString()} className={`${item2.unknown_word == true?"bg-warning":"bg-info"} rounded w-fit px-4 py-2 h-fit`}>
                        <p className={`text-white text-[16px] font-['iransans-md']`}>{item2.word}</p>
                        {
                          item2.unknown_word&&
                          <div className="flex flex-col gap-2 mt-2">
                            {
                              item2?.letters?.length > 0&&(
                                <div className="flex flex-wrap gap-2">
                                {
                                  item2?.letters?.map((item3, index3)=>(
                                    <p key={index3.toString()} className={`text-white text-[16px] font-['iransans-bold']`}>{item3}{index3+1 < item2.letters.length&&<span className="text-white"> - </span>}</p>
                                  ))
                                }
                                </div>
                              )
                            }
                            {
                              item2?.additional_words?.length > 0&&(
                                <div className="flex flex-wrap gap-2">
                                {
                                  item2?.additional_words?.map((item3, index3)=>(
                                    <p key={index3.toString()} className={`text-black text-[12px] font-['iransans-md']`}>{item3.length>1?item3:"#NO#"}{index3+1 < item2.additional_words.length&&<span className="text-white"> - </span>}</p>
                                  ))
                                }
                                </div>
                              )
                            }
                            {
                              item2?.hidden_words?.length > 0&&(
                                <div className="flex flex-wrap gap-2">
                                {
                                  item2?.hidden_words?.map((item3, index3)=>(
                                    <p key={index3.toString()} className={`text-red_error text-[12px] font-['iransans-md']`}>{item3.length>1?item3:"#NO#"}{index3+1 < item2.hidden_words.length&&<span className="text-white"> - </span>}</p>
                                  ))
                                }
                                </div>
                              )
                            }
                          </div>
                        }
                      </div>
                    ))
                  }
                </div>
              </div>
            ))
          }
          {stage_hint&&<p className="text-text5 dark:text-text5_dark text-[12px] font-['iransans-md']">{stage_hint}</p>}
        </div>
      </div>
      <div className="flex flex-col gap-4">
        {/* اطلاعات متنی */}
        <div className={`flex flex-col sm:${flexDir} gap-4`}>
          <div className="flex-1">
            <div className="mt-2 flex flex-wrap gap-2 text-xs font-['iransans-md'] text-text dark:text-text_dark">
              <span className="bg-yellow-100 dark:bg-yellow-800 px-2 py-1 rounded">
                انتشار: {publication_status}
              </span>
              <span className="bg-green-100 dark:bg-green-800 px-2 py-1 rounded">
                تکمیل: {completion_status}
              </span>
            </div>
          </div>

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
        </div>
        {/* رسانه‌ها */}
        {((media && media?.length > 0) || (voice && voice?.length > 0)) && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {media?.map((item, index) =>
              item.duration ? (
                <div
                  key={index.toString()}
                  className="relative aspect-video overflow-hidden rounded-lg"
                >
                  <video
                    src={`${Globals.uri}${item.path}`}
                    className="w-full h-full object-cover rounded-lg"
                  />
                  <div className="absolute inset-0 flex justify-center items-center bg-black/30">
                    <FaPlay className="text-white text-2xl" />
                  </div>
                  <div className="absolute bottom-1 left-1 flex items-center gap-2 bg-black/60 text-white text-xs px-2 py-0.5 rounded">
                    <span>{secondsToTime(item.duration)}</span>
                    <IoIosVideocam className="text-base" />
                  </div>
                </div>
              ) : (
                <div key={index} className="aspect-video overflow-hidden rounded-lg">
                  <ImageComponent
                    src={item.path}
                    alt="media_image"
                    baseURI={true}
                    parentclasses="h-full w-full object-cover rounded-lg"
                  />
                </div>
              )
            )}
            {voice?.map((item, index) =>
                <div key={index.toString()} className="relative bg-primary bg-opacity-10 rounded-lg p-3 w-full col-span-1 sm:col-span-2">
                    <audio src={`${Globals.uri}${item.path}`} controls className="w-full rounded-md" />
                    <BsMusicNoteBeamed className="absolute top-2 right-2 text-primary text-xl" />
                </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default StageCard;