"use client";

import React, { useEffect, useState } from "react";
import ImageGallery from "react-image-gallery";
import Globals from "@/utils/Globals";
import Image from "next/image";
import { FaPlay } from "react-icons/fa6";
import { secondsToTime } from "@/utils/SecondToTime";
import { IoIosVideocam } from "react-icons/io";
import ShowVideoModalHelper from "./ShowMediaModal/ShowVideoModalHelper";
import ShowImageModalHelper from "./ShowMediaModal/ShowImageModalHelper";
import ImageComponent from "./ImageComponent";

const Slider = ({ media }: { media: any[] }) => {
  const [items, setItems] = useState<any>([]);

  useEffect(() => {
    const array = [];
    for (let index = 0; index < media.length; index++) {
      const element = media[index];
      const item = {
        original: `${Globals.uri}${element.url}`,
        thumbnail: `${Globals.uri}${element.url}`,
        duration: element.duration || null,
        title: element.title || null,
      };
      array.push(item);
    }
    setItems(array);

    // const thumbnailWrapper = document.getElementsByClassName("image-gallery-thumbnails");
  }, []);

  const renderItem = (item: any) => {
    return item?.duration ? (
      <div
        className="relative h-64 sm:h-96 w-full rounded-none sm:rounded-md"
        onClick={() => {
          ShowVideoModalHelper.showModal({
            src: item.original,
            title: item?.title || null,
            autoPlay: true,
          });
        }}
      >
        <video
          src={item.original}
          className="video h-full w-full object-cover rounded-none sm:rounded-md"
        />
        <div className="absolute top-0 right-0 left-0 bottom-0 h-full w-full flex items-center justify-center">
          <div className="absolute bottom-3 right-3 flex items-center gap-2 sm:gap-3 bg-[#00000080] rounded px-2 py-[2px] sm:px-3">
            <p className="text-sm sm:text-base font-['iransans-light'] text-white">
              {secondsToTime(item.duration)}
            </p>
            <div className="text-base sm:text-xl text-white">
              <IoIosVideocam />
            </div>
          </div>
          {item?.title && (
            <div className="absolute bottom-5 flex items-center bg-[#00000080] rounded px-4 py-1">
              <p className="text-base font-['iransans-light'] text-white">{item.title}</p>
            </div>
          )}
          <div className="z-50 text-xl sm:text-4xl text-primary bg-[#33333350] rounded-full p-7">
            <FaPlay />
          </div>
        </div>
      </div>
    ) : (
      <div
        className="relative h-64 sm:h-96 w-full rounded-none sm:rounded-md"
        onClick={() => {
          ShowImageModalHelper.showModal({
            src: item.original,
            title: item?.title || null,
          });
        }}
      >
        <Image
          className={`inset-0 h-full w-full rounded-none sm:rounded-md bg-gray-50 object-cover`}
          src={item.original}
          alt={"files_photo"}
          fill={true}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          loading="lazy"
        />
        <div className="absolute top-0 right-0 left-0 bottom-0 h-full w-full flex items-center justify-center">
          {item?.title && (
            <div className="absolute bottom-5 flex items-center bg-[#00000090] rounded px-4 py-1">
              <p className="text-base font-['iransans-light'] text-white">{item.title}</p>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderThumbnailItem = (item: any) => {
    return item?.duration ? (
      // <div className="!w-full !h-full !rounded">
      //   <video src={item.original} className="!h-[64px] !w-[64px] rounded object-cover" />
      // </div>
      <div className="!w-full !h-full !rounded relative">
        <video src={`${item.original}`} className="!h-[64px] !w-[64px] rounded object-cover" />
        <div className="absolute top-0 right-0 left-0 bottom-0 h-full w-full flex items-center justify-center">
          <div className="text-sm text-primary bg-[#33333350] bg-opacity-30 rounded-full p-2">
            <FaPlay />
          </div>
        </div>
      </div>
    ) : (
      <ImageComponent
        src={item?.original}
        baseURI={false}
        imageClasses="!h-[64px] !w-[64px] !rounded object-cover"
        parentclasses="!w-full !h-full !rounded"
      />
    );
  };

  return (
    <div className="">
      <ImageGallery
        items={items}
        additionalClass=""
        isRTL={true}
        slideDuration={250}
        showPlayButton={false}
        showFullscreenButton={false}
        renderItem={(item) => renderItem(item)}
        renderThumbInner={(item) => renderThumbnailItem(item)}
      />
    </div>
  );
};
export default Slider;
