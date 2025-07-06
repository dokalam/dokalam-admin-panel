import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { BsMusicNoteBeamed } from "react-icons/bs";
import { IoIosVideocam, IoMdEye, IoMdEyeOff } from "react-icons/io";
import { MdVerifiedUser } from "react-icons/md";
import { FaPlay } from "react-icons/fa";
import ImageComponent from "@/components/ImageComponent";
import { secondsToTime } from "@/utils/SecondToTime";
import { HiDotsVertical } from "react-icons/hi";

const SeasonSG = ({
  _id,
  rtl,
  title,
  description,
  language,
  media,
  music,
  badg ="جدید",
  season_number,
  stage_number_from,
  stage_number_to,
  number_stage,
  is_visible,
  is_active,
  content_source_type,
  publication_status,
  completion_status,
  version_created,
  version_updated,
  version_deleted,
}: {
  _id: string;
  rtl: boolean;
  title: string;
  description?: string;
  language: string;
  media?: {
    path: string;
    order?: number;
    file_type?: string;
    duration?: string;
  }[];
  music?: {
    path: string;
    file_type?: string;
    duration?: string;
  };
  badg?: string;
  season_number: number;
  stage_number_from: number;
  stage_number_to: number;
  number_stage: number;
  is_visible: boolean;
  is_active: boolean;
  content_source_type: string;
  publication_status: string;
  completion_status: string;
  version_created?: number;
  version_updated?: number;
  version_deleted?: number;
}) => {
  const router = useRouter();
  const direction = rtl ? "rtl" : "ltr";
  const textAlign = rtl ? "text-right" : "text-left";
  const flexDir = rtl ? "flex-row-reverse" : "flex-row";
  const itemAlign = rtl ? "items-end sm:items-start" : "items-start sm:items-end";
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const seasonId = _id


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
      className={`relative w-full p-4 rounded-2xl shadow-bottom dark:shadow-bottom-dark m-1 bg-background5 dark:bg-background5_dark flex flex-col gap-4 ${textAlign}`}
      >
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
              className={`absolute mt-2 w-32 rounded-md font-['iransans-md'] shadow-lg bg-background dark:bg-background_dark ring-1 ring-black ring-opacity-5 focus:outline-none z-30 ${
                rtl ? "left-0" : "right-0"
              }`}
            >
              <div className="py-1">
                <button
                  className="block w-full text-right px-2 py-2 text-sm text-text2 dark:text-text2_dark hover:bg-border2 dark:hover:bg-border2_dark"
                  onClick={() => {
                    setMenuOpen(false);
                    router.push(`/dashboard/manage-stage-game/season-list/edit-season/${seasonId}`)
                  }}
                >
                  ویرایش
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      {/* رسانه‌ها */}
      {(media?.length || music) && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {media?.map((item, index) =>
            item.duration ? (
              <div
                key={index}
                className="relative aspect-video overflow-hidden rounded-lg"
              >
                <video
                  src={item.path}
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
          {music && (
            <div className="relative bg-primary bg-opacity-10 rounded-lg p-3 w-full col-span-1 sm:col-span-2">
              <audio src={music.path} controls className="w-full rounded-md" />
              <BsMusicNoteBeamed className="absolute top-2 right-2 text-primary text-xl" />
            </div>
          )}
        </div>
      )}

      {/* اطلاعات متنی */}
      <div className={`flex flex-col sm:${flexDir} gap-4`}>
        <div className="flex-1">
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <h2 className="text-lg font-['iransans-bold']">{title}</h2>
            {badg && (
              <span className="text-xs bg-info text-white px-2 py-1 rounded">
                {badg}
              </span>
            )}
          </div>

          {description && (
            <p className="text-sm text-text6 dark:text-text6_dark mt-2 line-clamp-2 font-['iransans-md']">
              {description}
            </p>
          )}

          <div className="mt-2 text-sm flex flex-wrap gap-x-6 gap-y-1 text-text6 dark:text-text6_dark font-['iransans-md']">
            <span>زبان: {language}</span>
            <span>فصل: {season_number}</span>
            <span>
              مراحل: {stage_number_from} تا {stage_number_to} ( {number_stage} مرحله )
            </span>
          </div>

          <div className="mt-2 flex flex-wrap gap-2 text-xs font-['iransans-md'] text-text dark:text-text_dark">
            <span className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
              منبع: {content_source_type}
            </span>
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
    </div>
  );
};

export default SeasonSG;