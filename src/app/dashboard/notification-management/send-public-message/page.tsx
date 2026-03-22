"use client";

import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { BiTrash } from "react-icons/bi";
import ImageComponent from "@/components/ImageComponent";
import Input from "@/components/Input";
import TextAreaInput from "@/components/TextAreaInput";
import Footer from "@/components/Footer/Footer";
import Border from "@/components/Border";
import { Switch } from "@headlessui/react";
import GradientButton from "@/components/GradientButton";
import PackageListHelper from "@/components/PackageList/PackageListHelper";
import PackageList from "@/components/PackageList/PackageList";




type PackageSelectedInfo = {
  _id: string;
  title: string;
  image: string;
}
const Page = () => {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [loading, setLoading] = useState(false);
  const [packageSelected, setPackageSelected] = useState<PackageSelectedInfo | null>(null)
  const [link, setLink] = useState("")
  const [freeCoin, setFreeCoin] = useState("")
  const [freeSubscription, setFreeSubscription] = useState("")
  const [sendNotification, setSendNotification] = useState(false)
  const [description, setDescription] = useState("")
  

  const registerAndConfirm = ()=>{
    if(title.length == 0  || body.length == 0){
      toast.error("ابتدا موارد الزامی را وارد کنید.", {
        position: "top-center",
        autoClose: 4000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: typeof window !== "undefined" && localStorage.getItem("theme") == "dark" ? "dark" : "light",
      });
    } else if(link.length > 0 && link.length <= 7){
      toast.error("لینک وارد شده معتبر نمیباشد.", {
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
  const checkedAndRegister = async () => {
    setLoading(true);
    let data = {
      query: `
          mutation registerNewPublicMessageInAppByAdmin(
            $title : String!,
            $body : String!,
            $link : String,
            $package : ID,
            $number_free_coin : Int,
            $duration_free_subscription : Int,
            $admin_note : String,
            $send_notification : Boolean,
          ){
            registerNewPublicMessageInAppByAdmin(
              title : $title,
              body : $body,
              link : $link,
              package : $package,
              number_free_coin : $number_free_coin,
              duration_free_subscription : $duration_free_subscription,
              admin_note : $admin_note,
              send_notification : $send_notification,
            ) {
              status,
              message,
            }
          }
          `,
      variables: {
        title : title,
        body : body,
        link : link?.length > 7?link:undefined,
        package : packageSelected?._id?packageSelected._id:undefined,
        number_free_coin : freeCoin.length > 0?Number(freeCoin):undefined,
        duration_free_subscription : freeSubscription.length > 0?Number(freeSubscription):undefined,
        admin_note : description?.length > 0?description:undefined,
        send_notification : sendNotification,
      },
    };
    await axios({
      url: "/",
      method: "post",
      data: data,
    })
      .then(async (response) => {
        setLoading(false);
        if (response.data?.data?.registerNewPublicMessageInAppByAdmin?.status == 200) {
            toast.success(response.data?.data?.registerNewPublicMessageInAppByAdmin?.message, {
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
            setBody("")
            setLink("")
            setFreeCoin("")
            setFreeSubscription("")
            setDescription("")
            setSendNotification(false)
            setPackageSelected(null)
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
      .catch((e) => {
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
      <div className="mt-6">
        <label
          className="font-['iransans-md'] flex-1 text-right text-text6 dark:text-text6_dark text-[.85rem] sm:text-[.95rem] cursor-pointer py-3"
          htmlFor="name-stage-season"
        >
          عنوان اعلان
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
          متن اعلان
          <span className="text-red-500 px-1">*</span>
          <TextAreaInput
            id={"body-public-notification"}
            value={body}
            changeState={(e: any) => setBody(e)}
            textAreaStyles="!text-sm mt-1"
            rows={4}
          />
        </label>
      </div>
      <div
        className="py-4 cursor-pointer sm:hover:bg-border2 dark:sm:hover:bg-border2_dark transition select-none"
        onClick={() => setSendNotification((last) => !last)}
      >
        <div className="flex items-center justify-between w-full h-[42px] pl-2 rounded">
          <label className={`text-sm font-['iransans-md'] cursor-pointer`}>
            <h3 className="text-text dark:text-text_dark font-['iransans-md'] text-[15px]">
              نوتیفیکیشن ارسال شود
            </h3>
          </label>
          <Switch
            checked={sendNotification}
            onChange={() => setSendNotification((last) => !last)}
            onClick={(e) => e.stopPropagation()}
            className={`${sendNotification ? "bg-rgba2" : "bg-border dark:bg-border_dark"}
relative h-[19px] w-[33px] shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out flex items-center`}
          >
            <span
              aria-hidden="true"
              className={`${
                sendNotification
                  ? "translate-x-2 bg-primary"
                  : "-translate-x-[16px] bg-text5 dark:bg-text5_dark"
              }
pointer-events-none inline-block h-[22px] w-[22px] transform rounded-full shadow-lg ring-0 transition duration-200 ease-in-out`}
            />
          </Switch>
        </div>
        <p className="text-justify font-['iransans-md'] text-text5 dark:text-text5_dark text-[12px] sm:text-[14px] mb-1">
          با فعال بودن این گزینه، نوتیفیکیشن نیز به دستگاه کاربر ارسال خواهد شد.
        </p>
      </div>
      <Border />
      <div className="mt-12">
        <GradientButton
          buttonText={"انتخاب بسته و پکیج"}
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
      <div className="mt-12">
        <label
          className="font-['iransans-md'] flex-1 text-right text-text6 dark:text-text6_dark text-[.85rem] sm:text-[.95rem] cursor-pointer py-3"
          htmlFor="number-season-stage-season"
        >
          دادن سکه رایگان در اعلان
          <span className="text-red-500 px-1">(بر اساس تعداد سکه)</span>
          <div className={`mt-1 flex gap-2 w-full items-center justify-between`}>
            <Input type="number" id="number-season-stage-season" value={freeCoin} changeState={setFreeCoin} classes="flex-1" inputStyles="!text-base" />
          </div>
        </label>
      </div>
      <div className="mt-6">
        <label
          className="font-['iransans-md'] flex-1 text-right text-text6 dark:text-text6_dark text-[.85rem] sm:text-[.95rem] cursor-pointer py-3"
          htmlFor="number-season-stage-season"
        >
          دادن اشتراک رایگان در اعلان  
          <span className="text-red-500 px-1">(بر اساس تعداد روز)</span>
          <div className={`mt-1 flex gap-2 w-full items-center justify-between`}>
            <Input type="number" id="number-season-stage-season" value={freeSubscription} changeState={setFreeSubscription} classes="flex-1" inputStyles="!text-base" />
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
          className="text-right lg:w-2/3 w-5/6 xl:w-3/5 2xl:w-1/2 text-text6 dark:text-text6_dark cursor-pointer font-iransans-md text-sm"
          htmlFor="description-stage-season"
        >
          یادداشت ادمین
          <TextAreaInput
            id={"description-stage-season"}
            value={description}
            changeState={(e: any) => setDescription(e)}
            textAreaStyles="!text-sm mt-1"
            rows={4}
          />
        </label>
      </div>
      <Footer buttonFn={registerAndConfirm} buttonText="ارسال پیام عمومی" loadingButton={loading} classes="md:!mr-72 !justify-end" />
      <PackageList
        ref={(Ref) => {
          PackageListHelper.setRef(Ref);
        }}
      />
    </div>
  );
};

export default Page;
