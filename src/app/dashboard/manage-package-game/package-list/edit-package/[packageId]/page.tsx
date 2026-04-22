"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import ShowImageModalHelper from "@/components/ShowMediaModal/ShowImageModalHelper";
import ShowImageModal from "@/components/ShowMediaModal/ShowImageModal";
import Input from "@/components/Input";
import TextAreaInput from "@/components/TextAreaInput";
import Footer from "@/components/Footer/Footer";
import Border from "@/components/Border";
import { Switch } from "@headlessui/react";
import SelectInput from "@/components/SelectInput";
import GradientButton from "@/components/GradientButton";
import TopicCategoryList from "@/components/TopicCategoryList/TopicCategoryList";
import TopicCategoryListHelper from "@/components/TopicCategoryList/TopicCategoryListHelper";
import Io5Icons from "@/utils/Icons/Io5Icons";
import CollectionList from "@/components/CollectionList/CollectionList";
import CollectionListHelper from "@/components/CollectionList/CollectionListHelper";
import { useParams } from "next/navigation";
import ScreenLoading from "@/components/ScreenLoading";

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
  {value:"incomplete", label:"ناقص (نیاز به بخش‌هایی بیشتر) | (# محتوا آماده نیست (به‌زودی))"},
  {value:"in_progress", label:"در حال کار و بازبینی | (# فصل جدید (به‌زودی))"},
  {value:"complete", label:"کامل‌شده ولی قابل به‌روزرسانی | (# مراحل کامل است)"},
  {value:"finalized", label:"نهایی‌شده، بدون نیاز به تغییر | (# مراحل کامل است)"},
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
const areArraysEqual = (arr1:string[], arr2:string[]) => {
    if (arr1.length !== arr2.length) return false;
    return arr1.every((item, index) => item === arr2[index]);
};
const areObjectsEqual = (obj1:any, obj2:any) => {
    return JSON.stringify(obj1) === JSON.stringify(obj2);
};
const Page = () => {
  const { packageId } = useParams();
  const [oldData, setOldData] = useState<any>(null)
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [subject, setSubject] = useState("");
  const [badge, setBadge] = useState("");
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
  const [topicCategory, setTopicCategory] = useState<TopicCategorySelected[]>([])
  const [packageCollection, setPackageCollection] = useState<packageCollection[]>([])
  const [free, setFree] = useState(false)
  const [freeWithSubscription, setFreeWithSubscription] = useState(true)
  const [price, setPrice] = useState("")
  const [testable, setTestable] = useState(false)
  const [numberStage, setNumberStage] = useState("")
  const [numberSeason, setNumberSeason] = useState("")
  const [publicationStatus, setPublicationStatus] = useState<string | null>(null)
  const [completionStatus, setCompletionStatus] = useState<string | null>(null)
  const [loading2, setLoading2] = useState(true)
  const [getError, setGetError] = useState(false)
  const [changeVersionUpdated, setChangeVersionUpdated] = useState(false);

  useEffect(()=>{
    getAllLanguage()
    getData()
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
  const getData = async()=>{
    await axios({
      url: "/",
      method: "post",
      data: {
        query: `
            query getPackageGamePackageInformation(
              $_id : ID!,
            ){
                getPackageGamePackageInformation(
                  _id : $_id,
                ) {
                  title,
                  description,
                  subject,
                  badge,
                  taken_source{title, poet, author, literary_form},
                  content_source_type,
                  publication_status,
                  completion_status,
                  language_ref,
                  topic_category_info{_id, title},
                  package_collection_all{_id, title},
                  free,
                  free_with_subscription,
                  price,
                  testable,
                  number_stage,
                  number_season,
                  is_visible,
                  is_active,
                }
            }
            `,
        variables: {
          _id : packageId
        },
      },
    }).then(async (response) => {
        const data = response.data.data.getPackageGamePackageInformation;
        if (data) {
          const deepCopy = structuredClone(data);
          setOldData(deepCopy);
          setTitle(data?.title)
          setSubject(data?.subject??"")
          setDescription(data?.description??"")
          setLanguage(data?.language_ref)
          setBadge(data?.badge??"")
          setNumberSeason(data?.number_season??"")
          setNumberStage(data?.number_stage??"")
          setVisible(data?.is_visible)
          setActive(data?.is_active)
          setFree(data?.free??false)
          setFreeWithSubscription(data?.free_with_subscription??true)
          setTestable(data?.testable??false)
          setPrice(data?.price)
          setContentSourceType(prev =>({
                ...prev,
                selected:data?.content_source_type
          }))
          setPublicationStatus(data?.publication_status)
          setCompletionStatus(data?.completion_status)
          if(data?.topic_category_info?.length > 0){
            setTopicCategory(data?.topic_category_info.map((item: any, index: number) => ({
                _id: item._id,
                title: item.title,
                image: null,
            })))
          }
          if(data?.package_collection_all?.length > 0){
            setPackageCollection(data?.package_collection_all.map((item: any, index: number) => ({
                _id: item._id,
                title: item.title,
            })))
          }
          if(data?.taken_source){
            setTakenSource(data?.taken_source)
          }
          setLoading2(false)
        } else {
          setGetError(true)
        }
      })
      .catch(() => {
        setGetError(true)
      });
  }
  const tryAgain = ()=>{
    setLoading2(true)
    setGetError(false)
    getData()
  }
  const registerAndConfirm = ()=>{
    if(title.length == 0 || !language || !contentSourceType.selected || !publicationStatus || !completionStatus || !numberSeason || !numberStage || price.length == 0){
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
    const topicCategoryArr1 = topicCategory?.map(item => item._id)??[]
    const topicCategoryArr2 = oldData?.topic_category_info?.map((item:any) => item._id)??[]
    const checkTopicCategory = areArraysEqual(topicCategoryArr1, topicCategoryArr2)

    const packageCollectionArr1 = packageCollection?.map(item => item._id)??[]
    const packageCollectionArr2 = oldData?.package_collection_all?.map((item:any) => item._id)??[]
    const checkPackageCollection = areArraysEqual(packageCollectionArr1, packageCollectionArr2)

    
    const takenSourceObj1 = takenSource
    const takenSourceObj2 = oldData?.taken_source
    const checkTakenSource = areObjectsEqual(takenSourceObj1, takenSourceObj2)
    let data = {
      query: `
          mutation editPackageGamePackageInformation(
            $_id : ID!,
            $title : String,
            $description : String,
            $subject : String,
            $badge : String,
            $taken_source : TakenSource,
            $content_source_type : String,
            $publication_status : String,
            $completion_status : String,
            $language_ref : ID,
            $topic_category : [ID],
            $package_collection : [ID],
            $free : Boolean,
            $free_with_subscription : Boolean,
            $price : Int,
            $testable : Boolean,
            $number_stage : Int,
            $number_season : Int,
            $is_visible : Boolean,
            $is_active : Boolean,
            $change_version_updated : Boolean!
          ){
            editPackageGamePackageInformation(
              _id : $_id,
              title : $title,
              description : $description,
              subject : $subject,
              badge : $badge,
              taken_source : $taken_source,
              content_source_type : $content_source_type,
              publication_status : $publication_status,
              completion_status : $completion_status,
              language_ref : $language_ref,
              topic_category : $topic_category,
              package_collection : $package_collection,
              free : $free,
              free_with_subscription : $free_with_subscription,
              price : $price,
              testable : $testable,
              number_stage : $number_stage,
              number_season : $number_season,
              is_visible : $is_visible,
              is_active : $is_active,
              change_version_updated : $change_version_updated
            ) {
              status,
              message,
            }
          }
          `,
      variables: {
        _id : packageId,
        title : (title !== oldData?.title && title?.length > 0)?title:undefined,
        description : ((oldData?.description && description !== oldData?.description) || (!oldData?.description && description?.length >0))?description:undefined,
        subject: ((oldData?.subject && subject !== oldData?.subject) || (!oldData?.subject && subject?.length >0))?subject:undefined,
        badge: ((oldData?.badge && badge !== oldData?.badge) || (!oldData?.badge && badge?.length >0))?badge:undefined,
        taken_source : checkTakenSource == true?undefined:takenSourceObj1,
        language_ref : language !== oldData?.language_ref?language:undefined,
        topic_category : checkTopicCategory == true?undefined:topicCategoryArr1,
        package_collection : checkPackageCollection == true?undefined:packageCollectionArr1,
        price : (Number(price) !== oldData?.price && price?.length > 0)?Number(price):undefined,
        free : (oldData?.free !== free)?free:undefined,
        free_with_subscription : (oldData?.free_with_subscription !== freeWithSubscription)?freeWithSubscription:undefined,
        testable : (oldData?.testable !== testable)?testable:undefined,
        number_stage: (oldData?.number_stage !== Number(numberStage) && Number(numberStage) > 0)?Number(numberStage):undefined,
        number_season: (oldData?.number_season !== Number(numberSeason) && Number(numberSeason) > 0)?Number(numberSeason):undefined,
        is_visible : (oldData?.is_visible !== visible)?visible:undefined,
        is_active : (oldData?.is_active !== active)?active:undefined,
        content_source_type : (oldData?.content_source_type !== contentSourceType.selected)?contentSourceType.selected:undefined,
        publication_status : (oldData?.publication_status !== publicationStatus)?publicationStatus:undefined,
        completion_status : (oldData?.completion_status !== completionStatus)?completionStatus:undefined,
        change_version_updated : changeVersionUpdated
      },
    };
    await axios({
        url: "/",
        method: "post",
        data: data,
    }).then(async (response) => {
        setLoading(false);
        if (response.data?.data?.editPackageGamePackageInformation?.status == 200) {
            toast.success(response.data?.data?.editPackageGamePackageInformation?.message, {
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
    loading2 == true?
    <div className="flex items-center justify-center w-full h-[calc(100dvh-60px)]">
      <ScreenLoading
        getError={getError}
        notItem={false}
        tryAgain={tryAgain}
      />
    </div>
    :
    <div className="flex flex-col justify-between w-full lg:w-[600px] 2xl:w-[750px] mt-10 mb-28 px-4 sm:mx-auto">
      
      <Border />
        <div
          className="py-4 cursor-pointer sm:hover:bg-border2 dark:sm:hover:bg-border2_dark transition select-none"
          onClick={() => setChangeVersionUpdated((last) => !last)}
        >
          <div className="flex items-center justify-between w-full h-[42px] pl-2 rounded">
            <label className={`text-sm font-['iransans-md'] cursor-pointer`}>
              <h3 className="text-text dark:text-text_dark font-['iransans-md'] text-[15px]">
                ورژن آپدیت ارتقا یابد
              </h3>
            </label>
            <Switch
              checked={changeVersionUpdated}
              onChange={() => setChangeVersionUpdated((last) => !last)}
              onClick={(e) => e.stopPropagation()}
              className={`${changeVersionUpdated ? "bg-rgba2" : "bg-border dark:bg-border_dark"}
  relative h-[19px] w-[33px] shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out flex items-center`}
            >
              <span
                aria-hidden="true"
                className={`${
                  changeVersionUpdated
                    ? "translate-x-2 bg-primary"
                    : "-translate-x-[16px] bg-text5 dark:bg-text5_dark"
                }
  pointer-events-none inline-block h-[22px] w-[22px] transform rounded-full shadow-lg ring-0 transition duration-200 ease-in-out`}
              />
            </Switch>
          </div>
          <p className="text-justify font-['iransans-md'] text-text5 dark:text-text5_dark text-[12px] sm:text-[14px] mb-1">
            با فعال بودن این گزینه، بعد از ویرایش، ورژن آپدیت سند (version_updated) افزایش میابد.
          </p>
        </div>
      <Border />
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
          htmlFor="name"
        >
          زبان بسته
          <span className="text-red-500 px-1">*</span>
          <div className={`mt-1 flex-1 gap-2 w-full items-center justify-between`}>
            <SelectInput
              value={language}
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
              value={contentSourceType.selected}
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
              value={publicationStatus}
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
              value={completionStatus}
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
                  value={takenSource.literary_form}
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
      <Footer buttonFn={registerAndConfirm} buttonText="ویرایش اطلاعات" loadingButton={loading} classes="md:!mr-72 !justify-end" />
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
