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
import UserList from "@/components/UserList/UserList";
import UserListHelper from "@/components/UserList/UserListHelper";
import { FaCoins, FaUserLarge } from "react-icons/fa6";
import { IoDiamondSharp } from "react-icons/io5";
import FreeCoinList from "@/components/FreeCoinList/FreeCoinList";
import FreeCoinListHelper from "@/components/FreeCoinList/FreeCoinListHelper";
import FreeSubscriptionList from "@/components/FreeSubscriptionList/FreeSubscriptionList";
import FreeSubscriptionListHelper from "@/components/FreeSubscriptionList/FreeSubscriptionListHelper";




type PackageSelectedInfo = {
  _id: string;
  title: string;
  image: string;
}
type UserSelectedInfo = {
  _id: string;
  user_name: string;
  phone: any;
  name: any;
}
type FreeCoinSelectedInfo = {
  _id: string;
  type: string;
  title: string;
  icon_image: string;
  number_coin: string;
}
type FreeSubscriptionSelectedInfo = {
  _id: string;
  type: string;
  title: string;
  icon_image: string;
  duration: string;
}
const Page = () => {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [loading, setLoading] = useState(false);
  const [packageSelected, setPackageSelected] = useState<PackageSelectedInfo | null>(null)
  const [userSelected, setUserSelected] = useState<UserSelectedInfo | null>(null)
  const [link, setLink] = useState("")
  const [freeCoinSelected, setFreeCoinSelected] = useState<FreeCoinSelectedInfo | null>(null)
  const [freeSubscriptionSelected, setFreeSubscriptionSelected] = useState<FreeSubscriptionSelectedInfo | null>(null)
  const [sendNotification, setSendNotification] = useState(false)
  const [description, setDescription] = useState("")
  

  const registerAndConfirm = ()=>{
    if(!userSelected?._id){
      toast.error("کاربری برای ارسال اعلان خصوصی انتخاب نکرده‌اید.", {
        position: "top-center",
        autoClose: 4000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: typeof window !== "undefined" && localStorage.getItem("theme") == "dark" ? "dark" : "light",
      });
    } else if(title.length == 0  || body.length == 0){
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
          mutation registerNewPrivateMessageInAppByAdmin(
            $user : ID!,
            $title : String!,
            $body : String!,
            $link : String,
            $package : ID,
            $free_coin_plan : ID,
            $free_subscription_plan : ID,
            $admin_note : String,
            $send_notification : Boolean,
          ){
            registerNewPrivateMessageInAppByAdmin(
              user : $user,
              title : $title,
              body : $body,
              link : $link,
              package : $package,
              free_coin_plan : $free_coin_plan,
              free_subscription_plan : $free_subscription_plan,
              admin_note : $admin_note,
              send_notification : $send_notification,
            ) {
              status,
              message,
            }
          }
          `,
      variables: {
        user : userSelected?._id,
        title : title,
        body : body,
        link : link?.length > 7?link:undefined,
        package : packageSelected?._id?packageSelected._id:undefined,
        free_coin_plan : freeCoinSelected?._id?freeCoinSelected._id:undefined,
        free_subscription_plan : freeSubscriptionSelected?._id?freeSubscriptionSelected._id:undefined,
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
        if (response.data?.data?.registerNewPrivateMessageInAppByAdmin?.status == 200) {
            toast.success(response.data?.data?.registerNewPrivateMessageInAppByAdmin?.message, {
              position: "top-center",
              autoClose: 3000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: typeof window !== "undefined" && localStorage.getItem("theme") == "dark" ? "dark" : "light",
            });
            setUserSelected(null)
            setTitle("")
            setBody("")
            setLink("")
            setFreeCoinSelected(null)
            setFreeSubscriptionSelected(null)
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
  const selectUser = ()=>{
    const previousSelected = userSelected?{
      _id: [userSelected?._id],
      user_name: [userSelected?.user_name],
      phone: [userSelected?.phone],
      name: [userSelected?.name],
    }:undefined;
    UserListHelper.openModal({
      previousSelected:previousSelected,
      numberSelected: 1,
      buttons: [
        {
          buttonText: "لغو",
          type: "border",
          onClickFn: () => {
            UserListHelper.closeModal();
          },
        },
        {
          buttonText: "انتخاب کاربر",
          type: "bold",
          onClickFn: ({ data }: { data: any }) => {
            setUserSelected({
              _id: data._id[0],
              user_name: data.user_name[0],
              phone: data?.phone[0],
              name: data?.name[0],
            })
            UserListHelper.closeModal();
          },
        },
      ],
    });
  }
  const deletePackageItem = () => {
    setPackageSelected(null);
  };
  const deleteUserItem = () => {
    setUserSelected(null);
  };
  
  const selectFreeCoinPlan = ()=>{
    const previousSelected = freeCoinSelected?{
      _id: [freeCoinSelected?._id],
      type: [freeCoinSelected?.type],
      title: [freeCoinSelected?.title],
      icon_image: [freeCoinSelected?.icon_image],
      number_coin: [freeCoinSelected?.number_coin],
    }:undefined;
    FreeCoinListHelper.openModal({
      previousSelected:previousSelected,
      numberSelected: 1,
      buttons: [
        {
          buttonText: "لغو",
          type: "border",
          onClickFn: () => {
            FreeCoinListHelper.closeModal();
          },
        },
        {
          buttonText: "انتخاب سکه رایگان",
          type: "bold",
          onClickFn: ({ data }: { data: any }) => {
            setFreeCoinSelected({
              _id: data._id[0],
              type: data.type[0],
              title: data.title[0],
              icon_image: data.icon_image[0],
              number_coin: data.number_coin[0],
            })
            FreeCoinListHelper.closeModal();
          },
        },
      ],
    });
  }
  const deleteFreeCoinPlan = () => {
    setFreeCoinSelected(null);
  };

  const selectFreeSubscriptionPlan = ()=>{
    const previousSelected = freeSubscriptionSelected?{
      _id: [freeSubscriptionSelected?._id],
      type: [freeSubscriptionSelected?.type],
      title: [freeSubscriptionSelected?.title],
      icon_image: [freeSubscriptionSelected?.icon_image],
      duration: [freeSubscriptionSelected?.duration],
    }:undefined;
    FreeSubscriptionListHelper.openModal({
      previousSelected:previousSelected,
      numberSelected: 1,
      buttons: [
        {
          buttonText: "لغو",
          type: "border",
          onClickFn: () => {
            FreeCoinListHelper.closeModal();
          },
        },
        {
          buttonText: "انتخاب اشتراک رایگان",
          type: "bold",
          onClickFn: ({ data }: { data: any }) => {
            setFreeSubscriptionSelected({
              _id: data._id[0],
              type: data.type[0],
              title: data.title[0],
              icon_image: data.icon_image[0],
              duration: data.duration[0],
            })
            FreeCoinListHelper.closeModal();
          },
        },
      ],
    });
  }
  const deleteFreeSubscriptionPlan = () => {
    setFreeSubscriptionSelected(null);
  };

  return (
    <div className="flex flex-col justify-between w-full lg:w-[600px] 2xl:w-[750px] mt-10 mb-28 px-4 sm:mx-auto">
      <div className="mt-12">
        <GradientButton
          buttonText={"انتخاب کاربر هدف"}
          onClickFn={selectUser}
          loading={false}
          classes="!text-sm !flex-none !px-8 sm:!w-[300px] !w-full"
        />
      </div>
      {userSelected && (
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-y-12 gap-x-2 sm:gap-y-12 sm:gap-x-2 mt-4 border-2 border-dashed border-primary dark:border-primary rounded-md p-4">

            <div className="flex flex-col items-center gap-2 bg-background3 dark:bg-background3_dark border border-dashed border-info dark:border-info rounded-md py-4">
              <div
                className="relative w-[90%] h-22 3xs:h-24 sm:h-32 cursor-pointer"
              >
                
                <FaUserLarge className="h-full w-full text-info"/> 
                <div className="absolute top-0 w-full flex justify-between px-1 pt-1">
                  <div
                    onClick={(e: any) => {
                      e.stopPropagation();
                      deleteUserItem();
                    }}
                    className="flex justify-center items-center rounded transition text-white bg-[#00000099] sm:hover:bg-[#33333370] text-lg w-6 h-6"
                  >
                    <BiTrash />
                  </div>
                </div>
              </div>
              <div className="mt-4">
                {userSelected?.user_name&&<p className="text-xs text-center font-['iransans-md'] text-text dark:text-text_dark w-22 sm:w-32 3xs:w-24 h-6">{userSelected.user_name}</p>}
                {userSelected?.phone&&<p className="text-xs text-center font-['iransans-md'] text-text dark:text-text_dark w-22 sm:w-32 3xs:w-24 h-6">{userSelected.phone}</p>}
                {userSelected?.name&&<p className="text-xs text-center font-['iransans-md'] text-text dark:text-text_dark w-22 sm:w-32 3xs:w-24 h-6">{userSelected.name}</p>}
              </div>
            </div>

        </div>
      )}
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
        <GradientButton
          buttonText={"دادن سکه رایگان"}
          onClickFn={selectFreeCoinPlan}
          loading={false}
          classes="!text-sm !flex-none !px-8 sm:!w-[300px] !w-full"
        />
      </div>
      {freeCoinSelected && (
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-y-12 gap-x-2 sm:gap-y-12 sm:gap-x-2 mt-4 border-2 border-dashed border-primary dark:border-primary rounded-md p-4">
            <div className="flex flex-col gap-y-4 items-center bg-background3 dark:bg-background3_dark border border-dashed border-info dark:border-info rounded-md py-2">
              <div
                className="relative w-[90%] h-22 3xs:h-24 sm:h-32 cursor-pointer"
              >
                  {
                    freeCoinSelected?.icon_image?
                    <ImageComponent
                      src={freeCoinSelected?.icon_image}
                      alt={"file_photos"}
                      parentclasses="h-full w-full cursor-pointer"
                    />
                    :
                    <div className="p-6">
                      <FaCoins className="h-full w-full cursor-pointer text-warning"/>
                    </div>
                  }
                <div className="absolute top-0 w-full flex justify-between px-1 pt-1">
                  <div
                    onClick={(e: any) => {
                      e.stopPropagation();
                      deleteFreeCoinPlan();
                    }}
                    className="flex justify-center items-center rounded transition text-white bg-[#00000099] sm:hover:bg-[#33333370] text-lg w-6 h-6"
                  >
                    <BiTrash />
                  </div>
                </div>
              </div>
              <p className="text-xs text-center font-['iransans-md'] text-text dark:text-text_dark w-22 sm:w-32 3xs:w-24">{freeCoinSelected?.title}</p>
              <p className="text-xs text-center font-['iransans-md'] text-info w-22 sm:w-32 3xs:w-24">{freeCoinSelected?.type == "private"?"( آیتم خصوصی )":freeCoinSelected?.type == "public"?"( آیتم عمومی )":""}</p>
              <p className="text-[18px] text-center font-['iransans-black-en'] text-warning w-22 sm:w-32 3xs:w-24">{`${freeCoinSelected?.number_coin} سکه`}</p>
            </div>
        </div>
      )}
      <div className="mt-12">
        <GradientButton
          buttonText={"دادن اشتراک رایگان"}
          onClickFn={selectFreeSubscriptionPlan}
          loading={false}
          classes="!text-sm !flex-none !px-8 sm:!w-[300px] !w-full"
        />
      </div>
      {freeSubscriptionSelected && (
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-y-12 gap-x-2 sm:gap-y-12 sm:gap-x-2 mt-4 border-2 border-dashed border-primary dark:border-primary rounded-md p-4">
            <div className="flex flex-col gap-y-4 items-center bg-background3 dark:bg-background3_dark border border-dashed border-info dark:border-info rounded-md py-2">
              <div
                className="relative w-[90%] h-22 3xs:h-24 sm:h-32 cursor-pointer"
              >
                  {
                    freeSubscriptionSelected?.icon_image?
                    <ImageComponent
                      src={freeSubscriptionSelected?.icon_image}
                      alt={"file_photos"}
                      parentclasses="h-full w-full cursor-pointer"
                    />
                    :
                    <div className="p-6">
                      <IoDiamondSharp className="h-full w-full cursor-pointer text-info"/>
                    </div>
                  }
                <div className="absolute top-0 w-full flex justify-between px-1 pt-1">
                  <div
                    onClick={(e: any) => {
                      e.stopPropagation();
                      deleteFreeSubscriptionPlan();
                    }}
                    className="flex justify-center items-center rounded transition text-white bg-[#00000099] sm:hover:bg-[#33333370] text-lg w-6 h-6"
                  >
                    <BiTrash />
                  </div>
                </div>
              </div>
              <p className="text-xs text-center font-['iransans-md'] text-text dark:text-text_dark w-22 sm:w-32 3xs:w-24">{freeSubscriptionSelected?.title}</p>
              <p className="text-xs text-center font-['iransans-md'] text-info w-22 sm:w-32 3xs:w-24">{freeSubscriptionSelected?.type == "private"?"( آیتم خصوصی )":freeSubscriptionSelected?.type == "public"?"( آیتم عمومی )":""}</p>
              <p className="text-[18px] text-center font-['iransans-black-en'] text-warning w-22 sm:w-32 3xs:w-24">{`${freeSubscriptionSelected?.duration} روز`}</p>
            </div>
        </div>
      )}
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
      <Footer buttonFn={registerAndConfirm} buttonText="ارسال پیام خصوصی" loadingButton={loading} classes="md:!mr-72 !justify-end" />
      <PackageList
        ref={(Ref) => {
          PackageListHelper.setRef(Ref);
        }}
      />
      <UserList
        ref={(Ref) => {
          UserListHelper.setRef(Ref);
        }}
      />
      <FreeCoinList
        ref={(Ref) => {
          FreeCoinListHelper.setRef(Ref);
        }}
      />
      <FreeSubscriptionList
        ref={(Ref) => {
          FreeSubscriptionListHelper.setRef(Ref);
        }}
      />
    </div>
  );
};

export default Page;
