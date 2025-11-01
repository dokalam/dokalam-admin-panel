"use client";

import React, { useRef, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { FaCamera } from "react-icons/fa6";
import { BiTrash } from "react-icons/bi";
import ImageComponent from "@/components/ImageComponent";
import ShowImageModalHelper from "@/components/ShowMediaModal/ShowImageModalHelper";
import ShowImageModal from "@/components/ShowMediaModal/ShowImageModal";
import Input from "@/components/Input";
import TextAreaInput from "@/components/TextAreaInput";
import Footer from "@/components/Footer/Footer";
import Border from "@/components/Border";
import { Switch } from "@headlessui/react";
import TopicCategoryList from "@/components/TopicCategoryList/TopicCategoryList";
import TopicCategoryListHelper from "@/components/TopicCategoryList/TopicCategoryListHelper";
import CollectionList from "@/components/CollectionList/CollectionList";
import CollectionListHelper from "@/components/CollectionList/CollectionListHelper";



const Page = () => {
  const inputIconImageRef: any = useRef();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [badge, setBadge] = useState("");
  const [visible, setVisible] = useState(false);
  const [active, setActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [iconImage, setIconImage] = useState<any>(null);
  const [order, setOrder] = useState("")
  const [free, setFree] = useState(true)
  const [freeWithSubscription, setFreeWithSubscription] = useState(false)
  const [price, setPrice] = useState("")

  
  const registerAndConfirm = ()=>{
    if(title.length == 0 ){
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
          mutation newOnlineGameDefinition(
            $title : String!,
            $description : String,
            $badge : String,
            $icon_image : Upload!,
            $free : Boolean!,
            $free_with_subscription : Boolean!,
            $price : Int!,
            $order : Int
            $is_visible : Boolean!,
            $is_active : Boolean!
          ){
            newOnlineGameDefinition(
              title : $title,
              description : $description,
              badge : $badge,
              icon_image : $icon_image,
              free : $free,
              free_with_subscription : $free_with_subscription,
              price : $price,
              order : $order,
              is_visible : $is_visible,
              is_active : $is_active
            ) {
              status,
              message,
            }
          }
          `,
      variables: {
        title : title,
        description : description,
        badge : badge,
        icon_image: null,
        free : free,
        free_with_subscription : freeWithSubscription,
        price : price?.length > 0?Number(price):0,
        order : order?.length>0?Number(order):undefined,
        is_visible : visible,
        is_active : active,
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
        if (response.data?.data?.newOnlineGameDefinition?.status == 200) {
            toast.success(response.data?.data?.newOnlineGameDefinition?.message, {
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

  const dleteImage = (item: string) => {
    setIconImage(null)
  };
  /////////////////////////////////////////////////////////////
  
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

      {(iconImage) && (
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
                      dleteImage("icon");
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
          htmlFor="name-stage-season"
        >
          عنوان بازی
          <span className="text-red-500 px-1">*</span>
          <div className={`mt-1 flex gap-2 w-full items-center justify-between`}>
            <Input id="name-stage-season" value={title} changeState={setTitle} classes="flex-1" inputStyles="!text-base" />
          </div>
        </label>
      </div>
      <div className="mt-6">
        <label
          className="text-right lg:w-2/3 w-5/6 xl:w-3/5 2xl:w-1/2 text-text6 dark:text-text6_dark cursor-pointer font-iransans-md text-sm"
          htmlFor="description-stage-season"
        >
          توضیحات بازی
          <TextAreaInput
            id={"description-stage-season"}
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
          htmlFor="badge-stage-season"
        >
          نشان ( مثل جدید یا به‌زودی )
          <div className={`mt-1 flex gap-2 w-full items-center justify-between`}>
            <Input id="badge-stage-season" value={badge} changeState={setBadge} classes="flex-1" inputStyles="!text-base" />
          </div>
        </label>
      </div>
      <div className="mt-6">
        <label
          className="font-['iransans-md'] flex-1 text-right text-text6 dark:text-text6_dark text-[.85rem] sm:text-[.95rem] cursor-pointer py-3"
          htmlFor="number-stage-season"
        >
          تعداد سکه برای فعال سازی
          <div className={`mt-1 flex gap-2 w-full items-center justify-between`}>
            <Input type="number" id="number-stage-season" value={price} changeState={setPrice} classes="flex-1" inputStyles="!text-base" />
          </div>
        </label>
      </div>
      <Border />
      <div className="mt-6">
        <label
          className="font-['iransans-md'] flex-1 text-right text-text6 dark:text-text6_dark text-[.85rem] sm:text-[.95rem] cursor-pointer py-3"
          htmlFor="number-season-stage-season"
        >
          ترتیب نمایش
          <div className={`mt-1 flex gap-2 w-full items-center justify-between`}>
            <Input type="number" id="number-season-stage-season" value={order} changeState={setOrder} classes="flex-1" inputStyles="!text-base" />
          </div>
        </label>
      </div>
      <Border />
      <div
        className="py-4 cursor-pointer sm:hover:bg-border2 dark:sm:hover:bg-border2_dark transition select-none"
        onClick={() => setFree((last) => !last)}
      >
        <div className="flex items-center justify-between w-full h-[42px] pl-2 rounded">
          <label className={`text-sm font-['iransans-md'] cursor-pointer`}>
            <h3 className="text-text dark:text-text_dark font-['iransans-md'] text-[15px]">
              بازی رایگان است
            </h3>
          </label>
          <Switch
            checked={free}
            onChange={() => setFree((last) => !last)}
            onClick={(e) => e.stopPropagation()}
            className={`${free ? "bg-rgba2" : "bg-border dark:bg-border_dark"}
relative h-[19px] w-[33px] shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out flex items-center`}
          >
            <span
              aria-hidden="true"
              className={`${
                free
                  ? "translate-x-2 bg-primary"
                  : "-translate-x-[16px] bg-text5 dark:bg-text5_dark"
              }
pointer-events-none inline-block h-[22px] w-[22px] transform rounded-full shadow-lg ring-0 transition duration-200 ease-in-out`}
            />
          </Switch>
        </div>
        <p className="text-justify font-['iransans-md'] text-text5 dark:text-text5_dark text-[12px] sm:text-[14px] mb-1">
          با فعال بودن این گزینه، این بازی برای همه‌ی کاربران رایگان خواهد بود.
        </p>
      </div>
      <Border />
      <div
        className="py-4 cursor-pointer sm:hover:bg-border2 dark:sm:hover:bg-border2_dark transition select-none"
        onClick={() => setFreeWithSubscription((last) => !last)}
      >
        <div className="flex items-center justify-between w-full h-[42px] pl-2 rounded">
          <label className={`text-sm font-['iransans-md'] cursor-pointer`}>
            <h3 className="text-text dark:text-text_dark font-['iransans-md'] text-[15px]">
              بازی با داشتن اشتراک رایگان است
            </h3>
          </label>
          <Switch
            checked={freeWithSubscription}
            onChange={() => setFreeWithSubscription((last) => !last)}
            onClick={(e) => e.stopPropagation()}
            className={`${freeWithSubscription ? "bg-rgba2" : "bg-border dark:bg-border_dark"}
relative h-[19px] w-[33px] shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out flex items-center`}
          >
            <span
              aria-hidden="true"
              className={`${
                freeWithSubscription
                  ? "translate-x-2 bg-primary"
                  : "-translate-x-[16px] bg-text5 dark:bg-text5_dark"
              }
pointer-events-none inline-block h-[22px] w-[22px] transform rounded-full shadow-lg ring-0 transition duration-200 ease-in-out`}
            />
          </Switch>
        </div>
        <p className="text-justify font-['iransans-md'] text-text5 dark:text-text5_dark text-[12px] sm:text-[14px] mb-1">
          با فعال بودن این گزینه، کاربران با داشتن اشتراک به رایگان به این بازی دسترسی  خواهند داشت.
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
      <Footer buttonFn={registerAndConfirm} buttonText="ثبت بازی" loadingButton={loading} classes="md:!mr-72 !justify-end" />
      <ShowImageModal
        ref={(Ref) => {
          ShowImageModalHelper.setRef(Ref);
        }}
      />
      <TopicCategoryList
          ref={(Ref) => {
            TopicCategoryListHelper.setRef(Ref);
          }}
      />
      <CollectionList
          ref={(Ref) => {
            CollectionListHelper.setRef(Ref);
          }}
      />
    </div>
  );
};

export default Page;
