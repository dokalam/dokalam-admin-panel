"use client";

import axios from "axios";
import React, { useRef, useState } from "react";
import { FaCamera, FaPlay, FaRegSquarePlus, FaVideo } from "react-icons/fa6";
import { toast } from "react-toastify";
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

const Page = () => {
  const inputImageRef: any = useRef();
  const inputVideoRef: any = useRef();
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState<any>([]);
  const [video, setVideo] = useState<any>([]);
  const media = video.concat(image);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [priceDetail, setPriceDetail] = useState("");
  const [discount, setDiscount] = useState("");
  const [categories, setCategories] = useState<{ title: string; children: string[] }[]>([]);

  const handleAddPhotos = (e: any) => {
    const photos = e.target.files;
    if (photos.length > 10) {
      toast.warning("بیشتر از 10 عکس نمی‌توانید برای آگهی انتخاب کنید.", {
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
      if (image.length + photos.length > 10) {
        toast.warning("بیشتر از 10 عکس نمی‌توانید برای آگهی انتخاب کنید.", {
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
        const newData: any = [...image];
        for (let index = 0; index < photos.length; index++) {
          const data = {
            file: photos[index],
            preview: URL.createObjectURL(photos[index]),
          };
          newData.push(data);
        }
        setImage(newData);
      }
      inputImageRef.current.value = "";
    }
  };

  const handleAddVideos = (e: any) => {
    const uri = URL.createObjectURL(e.target.files[0]);
    var videoElement = document.createElement("video");
    videoElement.preload = "metadata";
    videoElement.src = URL.createObjectURL(e.target.files[0]);
    videoElement.onloadedmetadata = function () {
      const videos = e.target.files;
      window.URL.revokeObjectURL(videoElement.src);
      const duration = videoElement.duration;
      if (duration < 30) {
        toast.warning("ویدیوی انتخابی نمیتواند کمتر از 30 ثانیه باشد.", {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: typeof window !== "undefined" && localStorage.getItem("theme") == "dark" ? "dark" : "light",
        });
      } else if (duration > 120) {
        toast.warning("ویدیوی انتخابی نمیتواند بیشتر از 120 ثانیه باشد.", {
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
        const items: any = [];
        const data = {
          file: videos[0],
          preview: uri,
          duration: duration.toFixed(0).toString(),
        };
        items.push(data);
        setVideo(items);
        inputVideoRef.current.value = "";
      }
    };
  };

  const deleteMediaItem = (item: any) => {
    if (item?.file?.type.includes("video") == true) {
      setVideo([]);
    } else {
      let index = image.findIndex((i: any) => i.preview == item.preview);
      const newData = [...image];
      newData.splice(index, 1);
      setImage(newData);
    }
  };

  const setTitleForMediaItem = (item: any) => {
    let title = item?.file?.type.includes("video") == true ? "عنوان ویدیو" : "عنوان عکس";
    let x = item?.file?.type.includes("video") == true ? "ویدیو" : "عکس";
    ModalInputHelper.showModalInput({
      title: title,
      description: `میتوانید یک عنوان کوتاه برای این ${x} بنویسید`,
      inputValue: item.title == undefined || item.title == null ? "" : item.title,
      buttons:
        item.title == undefined
          ? [
              {
                buttonText: "تایید",
                onClickFn: (call) => {
                  if (item?.file?.type.includes("video") == true) {
                    const index = video.findIndex((i: any) => i.preview == item.preview);
                    const newData: any = [...video];
                    newData[index] = { ...newData[index], title: call == "" ? undefined : call };
                    setVideo(newData);
                  } else {
                    const index = image.findIndex((i: any) => i.preview == item.preview);
                    const newData: any = [...image];
                    newData[index] = { ...newData[index], title: call == "" ? undefined : call };
                    setImage(newData);
                  }
                  ModalInputHelper.closeModalInput();
                },
              },
              {
                buttonText: "انصراف",
                onClickFn: () => {
                  ModalInputHelper.closeModalInput();
                },
              },
            ]
          : [
              {
                buttonText: "تایید",
                onClickFn: (call) => {
                  if (item?.file?.type.includes("video") == true) {
                    const index = video.findIndex((i: any) => i.preview == item.preview);
                    const newData: any = [...video];
                    newData[index] = { ...newData[index], title: call == "" ? undefined : call };
                    setVideo(newData);
                  } else {
                    const index = image.findIndex((i: any) => i.preview == item.preview);
                    const newData: any = [...image];
                    newData[index] = { ...newData[index], title: call == "" ? undefined : call };
                    setImage(newData);
                  }
                  ModalInputHelper.closeModalInput();
                },
              },
              {
                buttonText: "حذف عنوان",
                onClickFn: () => {
                  if (item?.file?.type.includes("video") == true) {
                    const index = video.findIndex((i: any) => i.preview == item.preview);
                    const newData: any = [...video];
                    newData[index] = { ...newData[index], title: undefined };
                    setVideo(newData);
                  } else {
                    const index = image.findIndex((i: any) => i.preview == item.preview);
                    const newData: any = [...image];
                    newData[index] = { ...newData[index], title: undefined };
                    setImage(newData);
                  }
                  ModalInputHelper.closeModalInput();
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
        maxLength: 30,
      },
    });
  };

  const finalFileRegister = async () => {
    let value = [];
    if (categories?.length > 0) {
      for (let index = 0; index < categories.length; index++) {
        const element = categories[index];
        const children = element.children;
        if (children?.length > 0) {
          for (let j = 0; j < children.length; j++) {
            const element2 = children[j];
            const item = [element.title, element2];
            value.push(item);
          }
        }
      }
    }

    setLoading(true);
    let data = {
      query: `
          mutation newProductDefinition(
            $name : String!,
            $description : String!,
            $price : String!,
            $discount : String,
            $price_title : String,
            $category : [[String]],
          ){
            newProductDefinition(
                name : $name,
                description : $description,
                price : $price,
                discount : $discount,
                price_title : $price_title,
                category : $category,
            ) {
              status,
              message,
              _id
            }
          }
          `,
      variables: {
        name: name,
        description: description,
        price: price,
        discount: discount,
        price_title: priceDetail,
        category: value?.length > 0 ? value : undefined,
      },
    };
    await axios({
      url: "/",
      method: "post",
      data: data,
    })
      .then(async (response) => {
        if (response.data?.data == null) {
          setLoading(false);
          if (response.data.errors[0].data[0].message) {
          } else {
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
          }
        } else {
          if (response.data?.data?.newProductDefinition?.status == 200) {
            const productId = response.data.data.newProductDefinition._id;
            await uploadMedia(productId);
          } else {
            setLoading(false);
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
          }
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

  const uploadMedia = async (productId: any) => {
    const media: any = video.concat(image);
    if (media.length > 0) {
      let duration = [];
      let nulls = [];
      for (let index = 0; index < media.length; index++) {
        const element = media[index];
        if (element.duration) {
          await Promise.resolve(duration.push([`${index}`, `${element.duration}`]));
        }
        await Promise.resolve(nulls.push(null));
      }
      let data = {
        query: `
            mutation addMediaForProduct($product : ID!, $media : [Upload!]!, $duration : [[String]]){
                addMediaForProduct(product : $product, media : $media, duration : $duration) {
                status,
                message
              }
            }
            `,
        variables: {
          product: productId,
          media: nulls,
          duration: duration.length > 0 ? duration : null,
        },
      };
      let formD = new FormData();
      formD.append("operations", JSON.stringify(data));
      let map: any = {};
      for (let index = 0; index < media.length; index++) {
        await Promise.resolve((map[index] = [`variables.media.${index}`]));
      }
      formD.append("map", JSON.stringify(map));
      for (let index = 0; index < media.length; index++) {
        const element = await media[index];
        const item: any = element.file;
        Promise.resolve(formD.append(`${index}`, item));
      }
      await axios({
        url: "/",
        method: "post",
        data: formD,
        headers: {
          Accept: "*/*",
          "Content-Type": "multipart/form-data",
        },
      })
        .then(async (response) => {
          if (response.data.data.addMediaForProduct.status == 200) {
            setLoading(false);
            setName("");
            setDescription("");
            setImage([]);
            setVideo([]);
            setDiscount("");
            setPrice("");
            setPriceDetail("");
            setCategories([]);
            const time = setTimeout(() => {
              DialogHelper.showDialog({
                dialogType: "success",
                buttons: [
                  {
                    buttonText: "تایید",
                    onClickFn: () => {},
                    type: "bold",
                  },
                ],
                bodyText: "محصول جدید با موفقیت ایجاد شد.",
              });
              clearTimeout(time);
            }, 200);
          } else {
            setLoading(false);
            setName("");
            setDescription("");
            setImage([]);
            setVideo([]);
            setDiscount("");
            setPrice("");
            setPriceDetail("");
            setCategories([]);
            const time = setTimeout(() => {
              DialogHelper.showDialog({
                dialogType: "warning",
                buttons: [
                  {
                    buttonText: "متوجه شدم",
                    onClickFn: () => {},
                    type: "bold",
                  },
                ],
                bodyText: "محصول جدید با موفقیت ثبت شد. اما در بارگذاری محتوا مشکلی پیش آمد.",
              });
              clearTimeout(time);
            }, 200);
          }
        })
        .catch(async () => {
          setLoading(false);
          setName("");
          setDescription("");
          setImage([]);
          setVideo([]);
          setDiscount("");
          setPrice("");
          setPriceDetail("");
          setCategories([]);
          const time = setTimeout(() => {
            DialogHelper.showDialog({
              dialogType: "warning",
              buttons: [
                {
                  buttonText: "متوجه شدم",
                  onClickFn: () => {},
                  type: "bold",
                },
              ],
              bodyText: "محصول جدید با موفقیت ثبت شد. اما در بارگذاری محتوا مشکلی پیش آمد.",
            });
            clearTimeout(time);
          }, 200);
        });
    } else {
      setLoading(false);
      setName("");
      setDescription("");
      setImage([]);
      setVideo([]);
      setDiscount("");
      setPrice("");
      setPriceDetail("");
      setCategories([]);
      const time = setTimeout(() => {
        DialogHelper.showDialog({
          dialogType: "success",
          buttons: [
            {
              buttonText: "تایید",
              onClickFn: () => {},
              type: "bold",
            },
          ],
          bodyText: "محصول جدید با موفقیت ثبت شد. اما در بارگذاری محتوا مشکلی پیش آمد.",
        });
        clearTimeout(time);
      }, 200);
    }
  };

  return (
    <div className="flex flex-col justify-between w-full lg:w-[600px] 2xl:w-[750px] mt-10 mb-28 px-4 sm:mx-auto">
      <div className="flex gap-6 justify-center font-['iransans-md'] mt-1">
        <label
          className="text-text6 dark:text-text6_dark border-2 border-dashed border-text5 dark:border-text5_dark py-6 text-lg flex-1 rounded-md cursor-pointer transition sm:hover:bg-border2 sm:dark:hover:bg-border2_dark flex flex-col justify-center items-center gap-y-2"
          htmlFor="upload_file_photos"
          tabIndex={0}
        >
          <div className="text-4xl">
            <FaCamera />
          </div>
          <p className="text-xs 3xs:text-sm text-center">افزودن عکس</p>
          <input
            ref={inputImageRef}
            autoComplete="off"
            tabIndex={-1}
            className="hidden"
            id="upload_file_photos"
            type="file"
            accept="image/*"
            multiple
            onChange={handleAddPhotos}
          />
        </label>
        <label
          className="text-text6 dark:text-text6_dark border-2 border-dashed border-text5 dark:border-text5_dark py-6 text-lg flex-1 rounded-md cursor-pointer transition sm:hover:bg-border2 sm:dark:hover:bg-border2_dark flex flex-col justify-center items-center gap-y-2"
          htmlFor="upload_file_video"
        >
          <div className="text-4xl">
            <FaVideo />
          </div>
          <p className="text-xs 3xs:text-sm text-center">افزودن ویدیو</p>
          <input
            ref={inputVideoRef}
            className="hidden"
            id="upload_file_video"
            type="file"
            accept="video/*"
            onChange={handleAddVideos}
          />
        </label>
      </div>

      {media.length > 0 && (
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-y-4 sm:gap-y-4 mt-4 border-2 border-dashed border-border dark:border-border_dark rounded-md py-2">
          {media.map((item: any, index: number) => (
            <div key={`${index.toString()}`} className="w-full h-20 3xs:h-24 sm:h-28 flex justify-center items-center">
              <div
                className="relative w-20 h-20 3xs:w-24 3xs:h-24 sm:w-28 sm:h-28 cursor-pointer"
                onClick={() => {
                  if (item?.file?.type.includes("video") == true) {
                    ShowVideoModalHelper.showModal({
                      src: item.preview,
                      title: item?.title ? item.title : null,
                    });
                  } else {
                    ShowImageModalHelper.showModal({
                      src: item.preview,
                      title: item?.title ? item.title : null,
                    });
                  }
                }}
              >
                {item?.file?.type.includes("video") == true ? (
                  <div className="relative h-full w-full">
                    <video src={item.preview} className="inset-0 h-full w-full rounded-md object-cover" />
                    <div className="absolute top-[26%] right-[26%] text-xl sm:text-3xl text-primary bg-background6 bg-opacity-30 rounded-full p-3">
                      <FaPlay />
                    </div>
                    <div className="absolute bottom-1 left-1 flex items-center gap-2 bg-[#00000080] rounded px-1">
                      <p className="text-xs font-['iransans-light'] text-white">{secondsToTime(item.duration)}</p>
                      <div className="text-sm text-white">
                        <IoIosVideocam />
                      </div>
                    </div>
                  </div>
                ) : (
                  <ImageComponent
                    src={item.preview}
                    alt={"file_photos"}
                    baseURI={false}
                    parentclasses="h-full w-full cursor-pointer"
                  />
                )}
                <div className="absolute top-0 w-full flex justify-between px-1 pt-1">
                  <div
                    onClick={(e: any) => {
                      e.stopPropagation();
                      setTitleForMediaItem(item);
                    }}
                    className={`flex justify-center items-center rounded transition ${
                      item?.title && item.title.length > 0 ? "text-primary" : "text-white"
                    } bg-[#00000080] sm:hover:bg-[#33333370] text-lg w-6 h-6`}
                  >
                    <BiEditAlt />
                  </div>
                  <div
                    onClick={(e: any) => {
                      e.stopPropagation();
                      deleteMediaItem(item);
                    }}
                    className="flex justify-center items-center rounded transition text-white bg-[#00000080] sm:hover:bg-[#33333370] text-lg w-6 h-6"
                  >
                    <BiTrash />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-6">
        <label
          className="font-['iransans-md'] flex-1 text-right text-text6 dark:text-text6_dark text-[.85rem] sm:text-[.95rem] cursor-pointer py-3"
          htmlFor="name"
        >
          نام محصول
          <div className={`mt-1 flex gap-2 w-full items-center justify-between`}>
            <Input id="name" value={name} changeState={setName} classes="flex-1" inputStyles="!text-base" />
          </div>
        </label>
      </div>

      <div className="mt-6">
        <label
          className="text-right lg:w-2/3 w-5/6 xl:w-3/5 2xl:w-1/2 text-text6 dark:text-text6_dark cursor-pointer font-iransans-md text-sm"
          htmlFor="description"
        >
          توضیحات آژانس
          <TextAreaInput
            id={"description"}
            value={description}
            changeState={(e: any) => setDescription(e)}
            textAreaStyles="!text-sm mt-1"
            rows={7}
          />
        </label>
      </div>

      <div className="mt-6">
        <label
          className="font-['iransans-md'] flex-1 text-right text-text6 dark:text-text6_dark text-[.85rem] sm:text-[.95rem] cursor-pointer py-3 flex flex-col"
          htmlFor="price"
        >
          قیمت محصول
          <div className={`mt-1 flex gap-2 w-full items-center justify-between`}>
            <Input
              id="price"
              value={priceDigitSeperator(price)}
              changeState={(e: any) => {
                setPrice(e.replace(/[^0-9]/g, ""));
              }}
              classes="flex-1"
              inputStyles="!text-base"
              inputMode={"numeric"}
              maxLength={15}
              ltr={true}
            />
          </div>
          <div className="flex flex-col text-right text-text4 dark:text-text4_dark text-sm font-['iransans-light'] mt-[2px]">
            <div>{price.trim() != "" && `${priceDigitSeperator(price)} تومان`}</div>
            <div>{price.trim() != "" && `${numberToWords(price)} تومان`}</div>
          </div>
        </label>
      </div>

      <div className="mt-6">
        <label
          className="text-right lg:w-2/3 w-5/6 xl:w-3/5 2xl:w-1/2 text-text6 dark:text-text6_dark cursor-pointer font-iransans-md text-sm"
          htmlFor="priceDetail"
        >
          توضیحات قیمت
          <Input
            id="priceDetail"
            value={priceDetail}
            changeState={setPriceDetail}
            classes="flex-1"
            inputStyles="!text-base !mt-1"
          />
        </label>
      </div>

      <div className="mt-6">
        <label
          className="font-['iransans-md'] flex-1 text-right text-text6 dark:text-text6_dark text-[.85rem] sm:text-[.95rem] cursor-pointer py-3 flex flex-col"
          htmlFor="discount"
        >
          تخفیف %
          <div className={`mt-1 flex gap-2 w-full items-center justify-between`}>
            <Input
              id="discount"
              value={discount}
              changeState={(e: any) => {
                setDiscount(e.replace(/[^0-9]/g, ""));
              }}
              classes="flex-1"
              inputStyles="!text-base"
              inputMode={"numeric"}
              maxLength={2}
              ltr={true}
            />
          </div>
          <div className="flex flex-col text-right text-text4 dark:text-text4_dark text-sm font-['iransans-light'] mt-[2px]">
            <div>{discount.trim() != "" && `${numberToWords(discount)} درصد`}</div>
          </div>
        </label>
      </div>

      <div
        className="border border-border dark:border-border_dark px-6 py-2 bg-primary font-iransans-md w-fit mt-6 rounded cursor-pointer transition hover:opacity-75 text-white"
        onClick={() => {
          ModalInputHelper.showModalInput({
            title: "افزودن دسته بندی جدید",
            buttons: [
              {
                buttonText: "افزودن",
                onClickFn: (val: string) => {
                  setCategories((last) => {
                    return [...last, { title: val, children: [] }];
                  });
                  ModalInputHelper.closeModalInput();
                },
              },
            ],
          });
        }}
      >
        افزودن دسته بندی جدید
      </div>

      <Footer buttonFn={finalFileRegister} buttonText="ثبت محصول" loadingButton={loading} classes="md:!mr-60 !justify-end" />
      {categories?.length > 0 && (
        <div className="flex flex-col gap-2 mt-6">
          {categories.map((item: any, index: number) => (
            <div className="flex gap-2 font-iransans-md whitespace-break-spaces" key={`${item}${index}`}>
              <div className="flex items-center gap-2 border border-border dark:border-border_dark px-3 py-2 rounded">
                <MdDelete
                  className="text-2xl text-primary cursor-pointer hover:opacity-75 transition"
                  onClick={() => {
                    const data = [...categories];
                    data.splice(index, 1);
                    setCategories([...data]);
                  }}
                />
                <div className="text-base text-text6 dark:text-text6_dark">{item.title}</div>
                <div
                  className="text-base p-1 bg-primary rounded cursor-pointer transition sm:hover:opacity-75 text-white"
                  onClick={() => {
                    ModalInputHelper.showModalInput({
                      title: `${item.title}`,
                      buttons: [
                        {
                          buttonText: "افزودن",
                          onClickFn: (val: string) => {
                            categories[index].children.push(val);
                            setCategories([...categories]);
                            ModalInputHelper.closeModalInput();
                          },
                        },
                      ],
                    });
                  }}
                >
                  <FaRegSquarePlus />
                </div>
              </div>

              {categories[index].children?.length > 0 && (
                <div className="flex flex-wrap items-center gap-2">
                  {categories[index].children.map((item2: string, index2: number) => (
                    <div
                      className="relative text-sm font-iransans-md text-text4 dark:text-text4_dark border border-border dark:border-border_dark py-2 px-3 rounded"
                      key={`${item2}${index2}`}
                    >
                      {item2}
                      <div className="absolute -top-1 -left-2 text-sm sm:text-sm cursor-pointer rounded-full hover:bg-border dark:hover:bg-border_dark transition border border-primary text-red_color bg-border2 dark:bg-border2_dark">
                        <IoClose
                          onClick={() => {
                            categories[index].children.splice(index2, 1);
                            setCategories([...categories]);
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
      <ShowVideoModal
        ref={(Ref) => {
          ShowVideoModalHelper.setRef(Ref);
        }}
      />
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
