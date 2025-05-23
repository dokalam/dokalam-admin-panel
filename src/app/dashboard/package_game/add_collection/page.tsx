"use client";

import axios from "axios";
import React, { useRef, useState, useEffect } from "react";
import { FaCamera, FaPlay, FaRegSquarePlus, } from "react-icons/fa6";
import { toast } from "react-toastify";
import DialogHelper from "@/components/Dialog/DialogHelper";
import { BiEditAlt, BiTrash } from "react-icons/bi";
import { secondsToTime } from "@/utils/SecondToTime";
import ImageComponent from "@/components/ImageComponent";
import ShowImageModalHelper from "@/components/ShowMediaModal/ShowImageModalHelper";
import ShowImageModal from "@/components/ShowMediaModal/ShowImageModal";
import Input from "@/components/Input";
import TextAreaInput from "@/components/TextAreaInput";
import { priceDigitSeperator } from "@/utils/PriceDigitSeparator";
import { numberToWords } from "@persian-tools/persian-tools";
import { MdDelete } from "react-icons/md";
import { IoClose } from "react-icons/io5";
import Footer from "@/components/Footer/Footer";
import Border from "@/components/Border";
import { Switch } from "@headlessui/react";
import SelectInput from "@/components/SelectInput";
import GradientButton from "@/components/GradientButton";
import PackageList from "@/components/PackageList/PackageList";
import PackageListHelper from "@/components/PackageList/PackageListHelper";
import ModalInput from "@/components/ModalInput/ModalInput";
import ModalInputHelper from "@/components/ModalInput/ModalInputHelper";

const Page = () => {
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [visible, setVisible] = useState(false);
  const [active, setActive] = useState(false);
  const [order, setOrder] = useState("")
  const [packageSelected, setPackageSelected] = useState<any>({
    _id: [],
    title: [],
    image: []
  })
  const merged = packageSelected._id.map((id: string, index: number) => ({
    _id: id,
    title: packageSelected.title[index],
    image: packageSelected.image[index]
  }));

  const registerAndConfirm = ()=>{
    if(title.length < 3 || order.length == 0){
      toast.error("ابتدا موارد الزامی را به درستی وارد کنید", {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: typeof window !== "undefined" && localStorage.getItem("theme") == "dark" ? "dark" : "light",
      });
    } else if(packageSelected._id.length < 6) {
      toast.error("نمیتوانید یک کالکشن را با کمتر از 6 پکیج ثبت کنید", {
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
  const checkedAndRegister = async () => {
    setLoading(true);
    let data = {
      query: `
          mutation newPackageCollectionDefinitionForPackageGame(
            $title : String!,
            $list : [CollectionListItem!]!,
            $order : Int!,
            $is_visible : Boolean!,
            $is_active : Boolean!
          ){
            newPackageCollectionDefinitionForPackageGame(
              title : $title,
              list : $list,
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
        list : packageSelected._id.map((item:any, index:number)=>({
          package : item,
          order : index + 1
        })),
        order : Number(order),
        is_visible : visible,
        is_active : active,
      },
    };
    await axios({
      url: "/",
      method: "post",
      data: data,
    })
      .then(async (response) => {
        setLoading(false);
        if (response.data?.data?.newPackageCollectionDefinitionForPackageGame?.status == 200) {
            toast.success(response.data?.data?.newPackageCollectionDefinitionForPackageGame?.message, {
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
            setOrder("")
            setPackageSelected({
              _id: [],
              title: [],
              image: []
            })
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
      .catch(() => {
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
    PackageListHelper.openModal({
      previousSelected: packageSelected,
      numberSelected: 8,
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
            setPackageSelected(data)
            PackageListHelper.closeModal();
          },
        },
      ],
    });
  }
  const deletePackageItem = (indexToRemove: number) => {
    setPackageSelected((prevState: any) => ({
      _id: prevState._id.filter((_: any, index: number) => index !== indexToRemove),
      title: prevState.title.filter((_: any, index: number) => index !== indexToRemove),
      image: prevState.image.filter((_: any, index: number) => index !== indexToRemove)
    }));
  };

  const movePackageItem = (fromIndex: number, toIndex: number) => {
    setPackageSelected((prevState: any) => {
      const moveInArray = (array: any[]) => {
        const newArray = [...array];
        const [movedItem] = newArray.splice(fromIndex, 1);
        newArray.splice(toIndex, 0, movedItem);
        return newArray;
      };

      return {
        _id: moveInArray(prevState._id),
        title: moveInArray(prevState.title),
        image: moveInArray(prevState.image),
      };
    });
  };
  const setOrderForItemInCollection = ({item, index}:{item:any, index:number}) => {
     let title = `ترتیب نمایش پکیج در کالکشن = (${index + 1})`;
      ModalInputHelper.showModalInput({
        title: title,
        description: "میتوانید ترتیب نمایش این پکیج را تغییر دهید.",
        inputValue: `${index + 1}`,
        buttons:[
                {
                  buttonText: "تایید",
                  onClickFn: (call) => {
                    const value = Number(call)
                    if(typeof value === 'number' && Number.isFinite(value) && value < 9 && value > 0){
                      const fromIndex = index
                      const toIndex = value - 1
                      movePackageItem(fromIndex, toIndex)
                      ModalInputHelper.closeModalInput();
                    } else {
                      toast.warning("مقدار وارد شده معتبر نمیباشد", {
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
                  },
                },
                {
                  buttonText: "انصراف",
                  onClickFn: () => {
                    ModalInputHelper.closeModalInput();
                  },
                },
              ],
        options: {
          maxLength: 2,
        },
      });
  };
  return (
    <div className="flex flex-col justify-between w-full lg:w-[600px] 2xl:w-[750px] mt-10 mb-28 px-4 sm:mx-auto">
      <div className="mt-6">
        <label
          className="font-['iransans-md'] flex-1 text-right text-text6 dark:text-text6_dark text-[.85rem] sm:text-[.95rem] cursor-pointer py-3"
          htmlFor="name"
        >
          عنوان کالشن
          <span className="text-red-500 px-1">*</span>
          <div className={`mt-1 flex gap-2 w-full items-center justify-between`}>
            <Input id="name" value={title} changeState={setTitle} classes="flex-1" inputStyles="!text-base" />
          </div>
        </label>
      </div>
      <div className="mt-12">
        <GradientButton
          buttonText={"چیدن لیست اصلی این کالکشن"}
          onClickFn={selectPackages}
          loading={false}
          classes="!text-sm !flex-none !px-8 sm:!w-[300px] !w-full"
        />
      </div>
      {merged.length > 0 && (
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-y-12 sm:gap-y-12 mt-4 border-2 border-dashed border-primary dark:border-primary rounded-md py-4">
          {merged.map((item: any, index: number) => (
            <div key={`${index.toString()}`} className="flex flex-col items-center gap-2">
              <div
                className="relative w-20 h-22 3xs:w-24 3xs:h-24 sm:w-28 sm:h-28 cursor-pointer"
              >

                  <ImageComponent
                    src={item.image}
                    alt={"file_photos"}
                    parentclasses="h-full w-full cursor-pointer"
                  />
                <div className="absolute top-0 w-full flex justify-between px-1 pt-1">
                  <div
                    onClick={(e: any) => {
                      e.stopPropagation();
                      setOrderForItemInCollection({item, index});
                    }}
                    className={`flex justify-center items-center rounded transition text-red_color bg-[#00000099] sm:hover:bg-[#33333370] text-lg w-6 h-6`}
                  >
                    <p className="text-xs 3xs:text-sm text-center font-['iransans-md']">{index + 1}</p>
                  </div>
                  <div
                    onClick={(e: any) => {
                      e.stopPropagation();
                      deletePackageItem(index);
                    }}
                    className="flex justify-center items-center rounded transition text-white bg-[#00000099] sm:hover:bg-[#33333370] text-lg w-6 h-6"
                  >
                    <BiTrash />
                  </div>
                </div>
              </div>
              <p className="text-xs text-center font-['iransans-md'] text-text dark:text-text_dark w-20 sm:w-28 3xs:w-24">{item.title}</p>
            </div>
          ))}
        </div>
      )}
      <div className="mt-8">
        <label
          className="font-['iransans-md'] flex-1 text-right text-text6 dark:text-text6_dark text-[.85rem] sm:text-[.95rem] cursor-pointer py-3"
          htmlFor="number-season-stage-season"
        >
          ترتیب نمایش
          <span className="text-red-500 px-1">*</span>
          <div className={`mt-1 flex gap-2 w-full items-center justify-between`}>
            <Input type="number" id="number-season-stage-season" value={order} changeState={setOrder} classes="flex-1" inputStyles="!text-base" />
          </div>
        </label>
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
      <Border />
      <PackageList
        ref={(Ref) => {
          PackageListHelper.setRef(Ref);
        }}
      />
      <ModalInput
        ref={(Ref) => {
          ModalInputHelper.setRef(Ref);
        }}
      />
      <Footer buttonFn={registerAndConfirm} buttonText="ثبت کالکشن" loadingButton={loading} classes="md:!mr-72 !justify-end" />
    </div>
  );
};

export default Page;
