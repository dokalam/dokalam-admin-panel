import React from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { BsMusicNoteBeamed } from "react-icons/bs";
import { IoIosVideocam } from "react-icons/io";
import { MdVerifiedUser } from "react-icons/md";
import { FaPlay } from "react-icons/fa";
import ImageComponent from "@/components/ImageComponent";
import { secondsToTime } from "@/utils/SecondToTime";

const SeasonSG = ({
  rtl,
  title,
  description,
  language,
  media,
  music,
  badg,
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
  const direction = rtl ? "rtl" : "ltr";
  const textAlign = rtl ? "text-right" : "text-left";
  const flexDir = rtl ? "flex-row-reverse" : "flex-row";
  const itemAlign = rtl ? "items-end sm:items-start" : "items-start sm:items-end";

  return (
    <div
      dir={direction}
      className={`w-full p-4 rounded-2xl shadow-sm bg-white dark:bg-zinc-900 flex flex-col gap-4 ${textAlign}`}
    >
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
            <h2 className="text-lg font-bold">{title}</h2>
            {badg && (
              <span className="text-xs bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 px-2 py-1 rounded">
                {badg}
              </span>
            )}
          </div>

          {description && (
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
              {description}
            </p>
          )}

          <div className="mt-2 text-sm flex flex-wrap gap-x-4 gap-y-1 text-gray-700 dark:text-gray-300">
            <span>زبان: {language}</span>
            <span>فصل: {season_number}</span>
            <span>
              مراحل: {stage_number_from} تا {stage_number_to} ({number_stage})
            </span>
          </div>

          <div className="mt-2 flex flex-wrap gap-2 text-xs">
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

        <div className={`flex sm:flex-col gap-2 ${itemAlign} text-sm`}>
          <div className="flex items-center gap-1">
            {is_visible ? (
              <AiOutlineEye className="text-green-600" />
            ) : (
              <AiOutlineEyeInvisible className="text-red-600" />
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