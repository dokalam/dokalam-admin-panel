"use client";

import React, { useRef, useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { FaCamera, FaMusic, FaPlay } from "react-icons/fa6";
import DialogHelper from "@/components/Dialog/DialogHelper";
import { BiEditAlt, BiTrash } from "react-icons/bi";
import { IoIosMusicalNotes, IoIosVideocam } from "react-icons/io";
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
import TopicCategoryList from "@/components/TopicCategoryList/TopicCategoryList";
import TopicCategoryListHelper from "@/components/TopicCategoryList/TopicCategoryListHelper";
import Io5Icons from "@/utils/Icons/Io5Icons";
import CollectionList from "@/components/CollectionList/CollectionList";
import CollectionListHelper from "@/components/CollectionList/CollectionListHelper";

type SelectedOption = {
  value: any;
  label: string;
};
const LiteraryFormList:SelectedOption[] = [
  {value:null, label:"انتخاب فرم نگارش ادبی"},
  {value:"نثر - رمان", label:"نثر - رمان"},
  {value:"نثر - داستان کوتاه", label:"نثر - داستان کوتاه"},
  {value:"نثر - مقاله", label:"نثر - مقاله"},
  {value:"نثر - زندگینامه", label:"نثر - زندگینامه"},
  {value:"نثر - یادداشت‌ها / خاطره‌نگاری", label:"نثر - یادداشت‌ها / خاطره‌نگاری"},
  {value:"نثر - سفرنامه", label:"نثر - سفرنامه"},
  {value:"نثر - نامه", label:"نثر - نامه"},
  {value:"نثر - گفت‌وگو", label:"نثر - گفت‌وگو"},
  {value:"نثر - مقاله علمی یا عمومی", label:"نثر - مقاله علمی یا عمومی"},
  {value:"نظم - حماسی", label:"نظم - حماسی"},
  {value:"نظم - غنایی", label:"نظم - غنایی"},
  {value:"نظم - هجو / طنز شعری", label:"نظم - هجو / طنز شعری"},
  {value:"نظم - شعر آزاد", label:"نظم - شعر آزاد"},
  {value:"نظم - شعر بی‌قافیه با وزن مشخص", label:"نظم - شعر بی‌قافیه با وزن مشخص"},
  {value:"نظم - شعرهای قالب‌دار خارجی", label:"نظم - شعرهای قالب‌دار خارجی"},
]
const PublicationStatus:SelectedOption[] = [
  {value:null, label:"انتخاب وضعیت انتشار"},
  {value:"draft", label:"پیشنویس"},
  {value:"ready", label:"آماده انتشار"},
  {value:"published", label:"منتشر شده"},
  {value:"archived", label:"آرشیو شده، غیرفعال"},
  {value:"rejected", label:"رد شده"},
]
const CompletionStatus:SelectedOption[] = [
  {value:null, label:"انتخاب وضعیت تکمیل بودن بسته"},
  {value:"incomplete", label:"ناقص (نیاز به بخش‌هایی بیشتر)"},
  {value:"in_progress", label:"در حال کار و بازبینی"},
  {value:"complete", label:"کامل‌شده ولی قابل به‌روزرسانی"},
  {value:"finalized", label:"نهایی‌شده، بدون نیاز به تغییر"},
]
type TakenSource = {
  title: string;
  poet: string;
  author: string;
  literary_form: string | null;
};
type ContentSourceType = {
  selected: string | null;
  list:SelectedOption[]
}
type TopicCategorySelected = {
  _id: string;
  title: string;
  image: string;
}
type packageCollection = {
  _id: string;
  title: string;
}
const Page = () => {
  const inputIconImageRef: any = useRef();
  const inputBannerImageRef: any = useRef();
  const inputMusicRef: any = useRef();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [subject, setSubject] = useState("");
  const [badg, setBadg] = useState("");
  const [takenSource, setTakenSource] = useState<TakenSource>({
    title: "",
    poet: "",
    author: "",
    literary_form: null,
  })
  const [contentSourceType, setContentSourceType] = useState<ContentSourceType>({
    selected: null,
    list: [{value:null, label:"انتخاب نوع محتوا"}, {value:"original", label:"محتوا اختصاصی و اورجینال"}, {value:"derived", label:"محتوا مشتق شده از منبع دیگر"}, {value:"copy", label:"محتوا کپی از منبع دیگر"}]
  })
  const [language, setLanguage] = useState<string | null>(null)
  const [languageList, setLanguageList] = useState([])
  const [visible, setVisible] = useState(false);
  const [active, setActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [iconImage, setIconImage] = useState<any>(null);
  const [bannerImage, setBannerImage] = useState<any>(null);
  const [music, setMusic] = useState<any>(null)
  const [topicCategory, setTopicCategory] = useState<TopicCategorySelected[]>([])
  const [packageCollection, setPackageCollection] = useState<packageCollection[]>([])
  const [free, setFree] = useState(false)
  const [freeWithSubscription, setFreeWithSubscription] = useState(true)
  const [price, setPrice] = useState("")
  const [testable, setTestable] = useState(false)
  const [numberStage, setNumberStage] = useState("")
  const [numberSeason, setNumberSeason] = useState("")
  const [order, setOrder] = useState("")
  const [publicationStatus, setPublicationStatus] = useState<string | null>(null)
  const [completionStatus, setCompletionStatus] = useState<string | null>(null)

  useEffect(()=>{
    getAllLanguage()
  }, [])
  const getAllLanguage = async()=>{
    const data = {
      query: `
        query getAllLanguageForAdmin($filter_visible : Boolean, $filter_active : Boolean){
          getAllLanguageForAdmin(filter_visible : $filter_visible, filter_active : $filter_active) {
            _id,
            name,
          }
        }
        `,
      variables: {
        filter_visible: false,
        filter_active: false,
      },
    };
    await axios({
      url: "/",
      method: "post",
      data: data,
    }).then(async (response) => {
        const data = response.data.data.getAllLanguageForAdmin;
        if (data.length > 0) {
          const items = data.map((item: any) => ({
            label: item.name,
            value: item._id,
          }));
          items.unshift({
            label: "انتخاب زبان",
            value: null,
          })
          setLanguageList(items);
        }
      })
      .catch(() => {
        setLanguageList([])
      });
  }
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
          mutation newPackageDefinitionForPackageGame(
            $title : String!,
            $description : String,
            $subject : String,
            $badg : String,
            $taken_source : TakenSource,
            $content_source_type : String!,
            $publication_status : String!,
            $completion_status : String!,
            $language : ID!,
            $topic_category : [ID],
            $package_collection : [ID],
            $icon_image : Upload!,
            $banner_image : Upload!,
            $music : FileInput,
            $free : Boolean!,
            $free_with_subscription : Boolean!,
            $price : Int!,
            $testable : Boolean!,
            $number_stage : Int!,
            $number_season : Int!,
            $is_visible : Boolean!,
            $is_active : Boolean!,
            $order : Int
          ){
            newPackageDefinitionForPackageGame(
              title : $title,
              description : $description,
              subject : $subject,
              badg : $badg,
              taken_source : $taken_source,
              content_source_type : $content_source_type,
              publication_status : $publication_status,
              completion_status : $completion_status,
              language : $language,
              topic_category : $topic_category,
              package_collection : $package_collection,
              icon_image : $icon_image,
              banner_image : $banner_image,
              music : $music,
              free : $free,
              free_with_subscription : $free_with_subscription,
              price : $price,
              testable : $testable,
              number_stage : $number_stage,
              number_season : $number_season,
              is_visible : $is_visible,
              is_active : $is_active,
              order : $order
            ) {
              status,
              message,
            }
          }
          `,
      variables: {
        title : title,
        description : description,
        subject : subject,
        badg : badg,
        taken_source : takenSource,
        content_source_type : contentSourceType.selected,
        publication_status : publicationStatus,
        completion_status : completionStatus,
        language : language,
        topic_category : topicCategory?.length > 0?topicCategory:undefined,
        package_collection : packageCollection?.length > 0?packageCollection:undefined,
        icon_image: null,
        banner_image: null,
        music: music?.file && music?.duration ? { file: null, duration: music.duration } : undefined,
        free : free,
        free_with_subscription : freeWithSubscription,
        price : Number(price),
        testable : testable,
        number_stage : Number(numberStage),
        number_season : Number(numberSeason),
        is_visible : visible,
        is_active : active,
        order : order?.length>0?Number(order):undefined,
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
    if (bannerImage?.file) {
      map[fileIndex.toString()] = ['variables.banner_image'];
      fileMap[fileIndex.toString()] = bannerImage.file;
      fileIndex++;
    }
    if (music?.file && music?.duration) {
      map[fileIndex.toString()] = ['variables.music.file'];
      fileMap[fileIndex.toString()] = music.file;
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
        if (response.data?.data?.newPackageDefinitionForPackageGame?.status == 200) {
            toast.success(response.data?.data?.newPackageDefinitionForPackageGame?.message, {
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
  }
  const handleAddIconPhoto = (e: any) => {
    const photo = e.target.files;
    console.log(photo[0])
    const data = {
      file: photo[0],
      preview: URL.createObjectURL(photo[0]),
    };
    setIconImage(data);
    inputIconImageRef.current.value = "";
  };
  const handleAddBannerPhoto = (e: any) => {
    const photo = e.target.files;
    console.log(photo[0])
    const data = {
      file: photo[0],
      preview: URL.createObjectURL(photo[0]),
    };
    setBannerImage(data);
    inputBannerImageRef.current.value = "";
  };
  const handleAddMusic = (e: any) => {
    const uri = URL.createObjectURL(e.target.files[0]);
    var musicElement = document.createElement("audio");
    musicElement.preload = "metadata";
    musicElement.src = URL.createObjectURL(e.target.files[0]);
    musicElement.onloadedmetadata = function () {
      const audios = e.target.files;
      window.URL.revokeObjectURL(musicElement.src);
      const duration = musicElement.duration;
      if (duration < 3) {
        toast.warning("موزیک متن نمیتواند کمتر از 3 ثانیه باشد", {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: typeof window !== "undefined" && localStorage.getItem("theme") == "dark" ? "dark" : "light",
        });
      } else if (duration > 180) {
        toast.warning("موزیک متن نمیتواند بیشتر از 180 ثانیه باشد.", {
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
        const data = {
          file: audios[0],
          preview: uri,
          duration: duration.toFixed(0).toString(),
        };
        setMusic(data);
        inputMusicRef.current.value = "";
      }
    };
  };

  const dleteImage = (item: string) => {
    if (item == "icon") {
      setIconImage(null)
    } else if(item == "banner") {
      setBannerImage(null)
    }
  };
  /////////////////////////////////////////////////////////////
  const selectTopicCaetgory = ()=>{
    const previousSelected = {
      _id: topicCategory.map(item => item._id),
      title: topicCategory.map(item => item.title),
      image: topicCategory.map(item => item.image),
    };
    TopicCategoryListHelper.openModal({
      previousSelected:previousSelected,
      numberSelected: 100,
      buttons: [
        {
          buttonText: "لغو",
          type: "border",
          onClickFn: () => {
            TopicCategoryListHelper.closeModal();
          },
        },
        {
          buttonText: "انتخاب دسته بندی",
          type: "bold",
          onClickFn: ({ data }: { data: any }) => {
            setTopicCategory(data._id.map((id: string, index: number) => ({
              _id: id,
              title: data.title[index],
              image: data.image[index],
            })))
            TopicCategoryListHelper.closeModal();
          },
        },
      ],
    });
  }
  const deleteTopicCategory = (index : number)=>{
    const newData = [...topicCategory];
    newData.splice(index, 1);
    setTopicCategory(newData);
  }
  /////////////////////////////////////////////////////////////
  const selectPackageCollection = ()=>{
    const previousSelected = {
      _id: packageCollection.map(item => item._id),
      title: packageCollection.map(item => item.title),
    };
    CollectionListHelper.openModal({
      previousSelected:previousSelected,
      numberSelected: 5,
      buttons: [
        {
          buttonText: "لغو",
          type: "border",
          onClickFn: () => {
            CollectionListHelper.closeModal();
          },
        },
        {
          buttonText: "انتخاب کالکشن",
          type: "bold",
          onClickFn: ({ data }: { data: any }) => {
            setPackageCollection(data._id.map((id: string, index: number) => ({
              _id: id,
              title: data.title[index],
            })))
            CollectionListHelper.closeModal();
          },
        },
      ],
    });
  }
  const deletePackageCollection = (index : number)=>{
    const newData = [...packageCollection];
    newData.splice(index, 1);
    setPackageCollection(newData);
  }
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
        <label
          className="text-text6 dark:text-text6_dark border-2 border-dashed border-text5 dark:border-text5_dark py-6 text-lg flex-1 rounded-md cursor-pointer transition sm:hover:bg-border2 sm:dark:hover:bg-border2_dark flex flex-col justify-center items-center gap-y-2"
          htmlFor="upload_file_photo_banner"
        >
          <div className="text-4xl">
            <FaCamera />
          </div>
          <p className="text-xs 3xs:text-sm text-center">افزودن عکس بنر</p>
          <input
            ref={inputBannerImageRef}
            className="hidden"
            id="upload_file_photo_banner"
            type="file"
            accept="image/*"
            onChange={handleAddBannerPhoto}
          />
        </label>
        <label
          className="text-text6 dark:text-text6_dark border-2 border-dashed border-text5 dark:border-text5_dark py-6 text-lg flex-1 rounded-md cursor-pointer transition sm:hover:bg-border2 sm:dark:hover:bg-border2_dark flex flex-col justify-center items-center gap-y-2"
          htmlFor="upload_file_audio"
        >
          <div className="text-4xl">
            <FaMusic />
          </div>
          <p className="text-xs 3xs:text-sm text-center">افزودن موزیک</p>
          <input
            ref={inputMusicRef}
            className="hidden"
            id="upload_file_audio"
            type="file"
            accept=".mp3,audio/mpeg"
            onChange={handleAddMusic}
          />
        </label>
      </div>

      {(iconImage || bannerImage || music) && (
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
            {bannerImage && (
              <div
                className="relative w-40 h-20 sm:w-60 sm:h-28 cursor-pointer"
                onClick={() =>
                  ShowImageModalHelper.showModal({
                    src: bannerImage.preview,
                  })
                }
              >
                <ImageComponent
                  src={bannerImage.preview}
                  alt="banner"
                  baseURI={false}
                  parentclasses="h-full w-full object-cover rounded-md cursor-pointer"
                />
                <div className="absolute top-0 w-full flex justify-between px-1 pt-1">
                  <div
                    onClick={(e: any) => {
                      e.stopPropagation();
                      dleteImage("banner");
                    }}
                    className="flex justify-center items-center rounded transition text-white bg-[#00000080] hover:bg-[#33333370] text-lg w-6 h-6"
                  >
                    <BiTrash />
                  </div>
                </div>
              </div>
            )}
            {music && (
              <div className="relative bg-primary rounded-lg p-4 w-full max-w-xs mx-auto mb-2">
                <audio
                  src={music.preview}
                  controls
                  className="w-full rounded-md"
                />
                <div className="absolute top-2 left-2">
                  <div
                    onClick={(e) => {
                      e.stopPropagation();
                      setMusic(null)
                    }}
                    className="w-6 h-6 bg-black/50 text-white hover:bg-black/70 rounded flex items-center justify-center"
                  >
                    <BiTrash size={14} />
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
          عنوان بسته
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
          توضیحات بسته
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
          htmlFor="name-stage-season"
        >
          موضوع بسته
          <div className={`mt-1 flex gap-2 w-full items-center justify-between`}>
            <Input id="name-stage-season" value={subject} changeState={setSubject} classes="flex-1" inputStyles="!text-base" />
          </div>
        </label>
      </div>
      <div className="mt-6">
        <label
          className="font-['iransans-md'] flex-1 text-right text-text6 dark:text-text6_dark text-[.85rem] sm:text-[.95rem] cursor-pointer py-3"
          htmlFor="badg-stage-season"
        >
          نشان ( مثل جدید یا به‌زودی )
          <div className={`mt-1 flex gap-2 w-full items-center justify-between`}>
            <Input id="badg-stage-season" value={badg} changeState={setBadg} classes="flex-1" inputStyles="!text-base" />
          </div>
        </label>
      </div>
      <div className="mt-6">
        <label
          className="font-['iransans-md'] flex-1 text-right text-text6 dark:text-text6_dark text-[.85rem] sm:text-[.95rem] cursor-pointer py-3"
          htmlFor="name"
        >
          زبان بسته
          <span className="text-red-500 px-1">*</span>
          <div className={`mt-1 flex-1 gap-2 w-full items-center justify-between`}>
            <SelectInput
              name="stage-game-language"
              options={languageList}
              onChange={(value) => setLanguage(value || null)}
            />
          </div>
        </label>
      </div>
      
      <div className="mt-6">
        <label
          className="font-['iransans-md'] flex-1 text-right text-text6 dark:text-text6_dark text-[.85rem] sm:text-[.95rem] cursor-pointer py-3"
          htmlFor="name"
        >
          نوع محتوا
          <span className="text-red-500 px-1">*</span>
          <div className={`mt-1 flex-1 gap-2 w-full items-center justify-between`}>
            <SelectInput
              name="stage-game-language"
              options={contentSourceType.list}
              onChange={(value) => setContentSourceType(prev =>({
                ...prev,
                selected:value
              }))}
            />
          </div>
        </label>
      </div>
      <div className="mt-6">
        <label
          className="font-['iransans-md'] flex-1 text-right text-text6 dark:text-text6_dark text-[.85rem] sm:text-[.95rem] cursor-pointer py-3"
          htmlFor="name"
        >
          وضعیت انتشار بسته
          <span className="text-red-500 px-1">*</span>
          <div className={`mt-1 flex-1 gap-2 w-full items-center justify-between`}>
            <SelectInput
              name="stage-game-language"
              options={PublicationStatus}
              onChange={(value) => setPublicationStatus(value)}
            />
          </div>
        </label>
      </div>
      <div className="mt-6">
        <label
          className="font-['iransans-md'] flex-1 text-right text-text6 dark:text-text6_dark text-[.85rem] sm:text-[.95rem] cursor-pointer py-3"
          htmlFor="name"
        >
          وضعیت کامل بودن بسته
          <span className="text-red-500 px-1">*</span>
          <div className={`mt-1 flex-1 gap-2 w-full items-center justify-between`}>
            <SelectInput
              name="stage-game-language"
              options={CompletionStatus}
              onChange={(value) => setCompletionStatus(value)}
            />
          </div>
        </label>
      </div>
      <div className="mt-6">
        <label
          className="font-['iransans-md'] flex-1 text-right text-text6 dark:text-text6_dark text-[.85rem] sm:text-[.95rem] cursor-pointer py-3"
          htmlFor="number-season-stage-season"
        >
          تعداد فصل
          <span className="text-red-500 px-1">*</span>
          <div className={`mt-1 flex gap-2 w-full items-center justify-between`}>
            <Input type="number" id="number-season-stage-season" value={numberSeason} changeState={setNumberSeason} classes="flex-1" inputStyles="!text-base" />
          </div>
        </label>
      </div>
      <div className="mt-6">
        <label
          className="font-['iransans-md'] flex-1 text-right text-text6 dark:text-text6_dark text-[.85rem] sm:text-[.95rem] cursor-pointer py-3"
          htmlFor="number-stage-season"
        >
          تعداد کل مراحل
          <span className="text-red-500 px-1">*</span>
          <div className={`mt-1 flex gap-2 w-full items-center justify-between`}>
            <Input type="number" id="number-stage-season" value={numberStage} changeState={setNumberStage} classes="flex-1" inputStyles="!text-base" />
          </div>
        </label>
      </div>
      <div className="mt-6">
        <label
          className="font-['iransans-md'] flex-1 text-right text-text6 dark:text-text6_dark text-[.85rem] sm:text-[.95rem] cursor-pointer py-3"
          htmlFor="number-stage-season"
        >
          قیمت بسته بر اساس سکه
          <span className="text-red-500 px-1">*</span>
          <div className={`mt-1 flex gap-2 w-full items-center justify-between`}>
            <Input type="number" id="number-stage-season" value={price} changeState={setPrice} classes="flex-1" inputStyles="!text-base" />
          </div>
        </label>
      </div>
      {
        topicCategory.length > 0&&(
          <div className="flex flex-row flex-wrap gap-4 mt-12 border-2 border-dashed border-primary dark:border-primary rounded-md py-4 px-4 justify-start">
            {topicCategory.map((item, index) => (
              <div key={index.toString()}>
                <div className="flex flex-row font-['iransans-md'] border items-center gap-4 border-primary py-2 px-2 rounded-md text-text dark:text-text_dark">
                  {item?.title}
                  <div
                    className="text-lg p-1 cursor-pointer rounded-md text-primary bg-background dark:bg-background_dark hover:bg-border dark:hover:bg-border_dark transition border border-primary"
                    onClick={() => deleteTopicCategory(index)}
                  >
                    <Io5Icons icon={"IoClose"} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )
      }
      <div className={topicCategory.length > 0?"mt-4":"mt-12"}>
        <GradientButton
          buttonText={"انتخاب دسته بندی"}
          onClickFn={selectTopicCaetgory}
          loading={false}
          classes="!text-sm !flex-none !px-8 sm:!w-[300px] !w-full"
        />
      </div>
      {
        packageCollection.length > 0&&(
          <div className="flex flex-row flex-wrap gap-4 mt-12 border-2 border-dashed border-primary dark:border-primary rounded-md py-4 px-4 justify-start">
            {packageCollection.map((item, index) => (
              <div key={index.toString()}>
                <div className="flex flex-row font-['iransans-md'] border items-center gap-4 border-primary py-2 px-2 rounded-md text-text dark:text-text_dark">
                  {item?.title}
                  <div
                    className="text-lg p-1 cursor-pointer rounded-md text-primary bg-background dark:bg-background_dark hover:bg-border dark:hover:bg-border_dark transition border border-primary"
                    onClick={() => deletePackageCollection(index)}
                  >
                    <Io5Icons icon={"IoClose"} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )
      }
      <div className={packageCollection.length > 0?"mt-4":"mt-12"}>
        <GradientButton
          buttonText={"انتخاب کالکشن"}
          onClickFn={selectPackageCollection}
          loading={false}
          classes="!text-sm !flex-none !px-8 sm:!w-[300px] !w-full"
        />
      </div>
      <div
        className="py-4 cursor-pointer sm:hover:bg-border2 dark:sm:hover:bg-border2_dark transition select-none"
        onClick={() => setFree((last) => !last)}
      >
        <div className="flex items-center justify-between w-full h-[42px] pl-2 rounded">
          <label className={`text-sm font-['iransans-md'] cursor-pointer`}>
            <h3 className="text-text dark:text-text_dark font-['iransans-md'] text-[15px]">
              بسته رایگان است
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
          با فعال بودن این گزینه، این بسته برای همه‌ی کاربران رایگان خواهد بود.
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
              بسته با داشتن اشتراک رایگان است
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
          با فعال بودن این گزینه، کاربران با داشتن اشتراک به رایگان به این بسته دسترسی  خواهند داشت.
        </p>
      </div>
      <Border />
      <div
        className="py-4 cursor-pointer sm:hover:bg-border2 dark:sm:hover:bg-border2_dark transition select-none"
        onClick={() => setTestable((last) => !last)}
      >
        <div className="flex items-center justify-between w-full h-[42px] pl-2 rounded">
          <label className={`text-sm font-['iransans-md'] cursor-pointer`}>
            <h3 className="text-text dark:text-text_dark font-['iransans-md'] text-[15px]">
              امکان تست قبل از خرید
            </h3>
          </label>
          <Switch
            checked={testable}
            onChange={() => setTestable((last) => !last)}
            onClick={(e) => e.stopPropagation()}
            className={`${testable ? "bg-rgba2" : "bg-border dark:bg-border_dark"}
relative h-[19px] w-[33px] shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out flex items-center`}
          >
            <span
              aria-hidden="true"
              className={`${
                testable
                  ? "translate-x-2 bg-primary"
                  : "-translate-x-[16px] bg-text5 dark:bg-text5_dark"
              }
pointer-events-none inline-block h-[22px] w-[22px] transform rounded-full shadow-lg ring-0 transition duration-200 ease-in-out`}
            />
          </Switch>
        </div>
        <p className="text-justify font-['iransans-md'] text-text5 dark:text-text5_dark text-[12px] sm:text-[14px] mb-1">
          با فعال بودن این گزینه، کاربر قبل از خرید بسته میتواند مراحل قابل تست را امتحان کند.
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
      <Border height="h-[20px]" color="bg-info" classes="mt-4"/>
        <div className="mt-4 border-2 border-dashed border-info rounded-md py-4 px-4">
          <h1 className="font-['iransans-md'] text-info text-center mt-2">منبع گرفته شده برای محتوا</h1>
          <div className="mt-6">
            <label
              className="font-['iransans-md'] flex-1 text-right text-text6 dark:text-text6_dark text-[.85rem] sm:text-[.95rem] cursor-pointer py-3"
              htmlFor="name-stage-season"
            >
              عنوان منبع
              <div className={`mt-1 flex gap-2 w-full items-center justify-between`}>
                <Input id="name-stage-season" value={takenSource.title} changeState={(value: string) => setTakenSource(prev => ({
                    ...prev,
                    title:value
                  }))
                } classes="flex-1" inputStyles="!text-base" />
              </div>
            </label>
          </div>
          <div className="mt-6">
            <label
              className="font-['iransans-md'] flex-1 text-right text-text6 dark:text-text6_dark text-[.85rem] sm:text-[.95rem] cursor-pointer py-3"
              htmlFor="name-stage-season"
            >
              نویسنده
              <div className={`mt-1 flex gap-2 w-full items-center justify-between`}>
                <Input id="name-stage-season" value={takenSource.author} changeState={(value: string) => setTakenSource(prev => ({
                    ...prev,
                    author:value
                  }))
                } classes="flex-1" inputStyles="!text-base" />
              </div>
            </label>
          </div>
          <div className="mt-6">
            <label
              className="font-['iransans-md'] flex-1 text-right text-text6 dark:text-text6_dark text-[.85rem] sm:text-[.95rem] cursor-pointer py-3"
              htmlFor="name-stage-season"
            >
              شاعر
              <div className={`mt-1 flex gap-2 w-full items-center justify-between`}>
                <Input id="name-stage-season" value={takenSource.poet} changeState={(value: string) => setTakenSource(prev => ({
                    ...prev,
                    poet:value
                  }))
                } classes="flex-1" inputStyles="!text-base" />
              </div>
            </label>
          </div>
          <div className="mt-6">
            <label
              className="font-['iransans-md'] flex-1 text-right text-text6 dark:text-text6_dark text-[.85rem] sm:text-[.95rem] cursor-pointer py-3"
              htmlFor="name"
            >
              فرم نگارش ادبی
              <div className={`mt-1 flex-1 gap-2 w-full items-center justify-between`}>
                <SelectInput
                  name="stage-game-language"
                  options={LiteraryFormList}
                  onChange={(value) => setTakenSource(prev => ({
                    ...prev,
                    literary_form:value
                  }))
                  }
                />
              </div>
            </label>
          </div>
      </div>
      <Footer buttonFn={registerAndConfirm} buttonText="ثبت پکیج" loadingButton={loading} classes="md:!mr-72 !justify-end" />
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
