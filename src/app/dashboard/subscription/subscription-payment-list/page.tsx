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


const Page = () => {
  const inputImageRef: any = useRef();
  const [image, setImage] = useState<any>(null)
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [price, setPrice] = useState("")

  const [visible, setVisible] = useState(false);
  const [active, setActive] = useState(false);
  const [loading, setLoading] = useState(false);
  
  
  const registerAndConfirm = async()=>{
    
  }

  const handleAddPhotos = (e: any) => {
    
  };
  
  const deleteBanner = ()=>{
    
  }

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
      <Footer buttonFn={registerAndConfirm} buttonText="ثبت آیتم جدید" loadingButton={loading} classes="md:!mr-72 !justify-end" />

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
