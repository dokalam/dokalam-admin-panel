"use client";

import React, { useRef, useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { BiTrash } from "react-icons/bi";
import ShowVideoModalHelper from "@/components/ShowMediaModal/ShowVideoModalHelper";
import ShowImageModalHelper from "@/components/ShowMediaModal/ShowImageModalHelper";
import ModalInputHelper from "@/components/ModalInput/ModalInputHelper";
import ShowVideoModal from "@/components/ShowMediaModal/ShowVideoModal";
import ShowImageModal from "@/components/ShowMediaModal/ShowImageModal";
import ModalInput from "@/components/ModalInput/ModalInput";
import Input from "@/components/Input";
import TextAreaInput from "@/components/TextAreaInput";
import Footer from "@/components/Footer/Footer";
import GradientButton from "@/components/GradientButton";
import { Switch } from "@headlessui/react";
import SelectInput from "@/components/SelectInput";
import Border from "@/components/Border";
import { validateStage } from "@/utils/ValidateStage";
import { normalizeStageData } from "@/utils/NormalizeStageData";
import { useParams } from "next/navigation";
import ScreenLoading from "@/components/ScreenLoading";
import { normalizeStageDataInEdit } from "@/utils/NormalizeStageDataInEdit";
import ImageComponent from "@/components/ImageComponent";


type WordItem = {
  _id?: string;
  word: string;
  word_hint: string;
  unknown_word: boolean;
  letters: string[];
  additional_words: string[];
  hidden_words: string[];
  order?: number;
};
type PartItem = {
  _id?: string;
  sentence: string;
  sentence_hint: string;
  sentence_display: string;
  words: WordItem[];
  order?: number;
}
type SelectedOption = {
  value: any;
  label: string;
};
const PublicationStatus:SelectedOption[] = [
  {value:null, label:"انتخاب وضعیت انتشار محتوا"},
  {value:"draft", label:"پیشنویس"},
  {value:"ready", label:"آماده انتشار"},
  {value:"published", label:"منتشر شده"},
  {value:"archived", label:"آرشیو شده، غیرفعال"},
  {value:"rejected", label:"رد شده"},
]
const CompletionStatus:SelectedOption[] = [
  {value:null, label:"انتخاب وضعیت کامل بودن محتوا"},
  {value:"incomplete", label:"ناقص (نیاز به بخش‌هایی بیشتر)"},
  {value:"in_progress", label:"در حال کار و بازبینی"},
  {value:"complete", label:"کامل‌شده ولی قابل به‌روزرسانی"},
  {value:"finalized", label:"نهایی‌شده، بدون نیاز به تغییر"},
]
type listType = {
  label: any;
  value: any;
};
function hasDifferences(arr1: PartItem[], arr2: PartItem[]): boolean {
  const sorted1 = [...arr1].sort((a, b) => (a.order || 0) - (b.order || 0));
  const sorted2 = [...arr2].sort((a, b) => (a.order || 0) - (b.order || 0));
  
  // اگر طول متفاوت باشد، حتماً متفاوت هستند
  if (sorted1.length !== sorted2.length) return true;
  
  // حالا که طول مساوی است، هر آیتم را مقایسه کن
  for (let i = 0; i < sorted1.length; i++) {
    if (JSON.stringify(sorted1[i]) !== JSON.stringify(sorted2[i])) {
      return true;
    }
  }
  
  return false;
}
const Page = () => {
  const { stageId } = useParams();
  const [oldData, setOldData] = useState<any>(null)
  const [changeVersionUpdated, setChangeVersionUpdated] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(false);
  const [language, setLanguage] = useState<string | null>(null)
  const [languageList, setLanguageList] = useState<listType[]>([])
  const [season, setSeason] = useState<string | null>(null)
  const [seasonList, setSeasonList] = useState<listType[]>([])
  const [visible, setVisible] = useState(true);
  const [active, setActive] = useState(true);
  const [stageNumberInLanguage, setStageNumberInLanguage] = useState("")
  const [stageNumberInSeason, setStageNumberInSeason] = useState("")
  const [stageHint, setStageHint] = useState("")
  const [parts, setParts] = useState<PartItem[]>([]);
  const [activeTab, setActiveTab] = useState(0);
  const [publicationStatus, setPublicationStatus] = useState<string | null>(null)
  const [completionStatus, setCompletionStatus] = useState<string | null>(null)
  const [loading2, setLoading2] = useState(true)
  const [getError, setGetError] = useState(false)
  
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
            query getPackageGameStageInformation(
              $_id : ID!,
            ){
                getPackageGameStageInformation(
                  _id : $_id,
                ) {
                    _id,
                    parts{
                      _id,
                      sentence,
                      sentence_hint,
                      sentence_display,
                      words{_id, word, word_hint, unknown_word, letters, additional_words, hidden_words, order}
                      order,
                    },
                    stage_hint,
                    season_info{_id, title},
                    language_ref,
                    package_info{title, icon_image}
                    stage_number_in_package,
                    stage_number_in_season,
                    is_visible,
                    is_active,
                    publication_status,
                    completion_status,
                }
            }
            `,
        variables: {
          _id : stageId
        },
      },
    }).then(async (response) => {
        const data = response.data.data.getPackageGameStageInformation;
        if (data) {
          const deepCopy = structuredClone(data);
          setOldData(deepCopy);
          setLanguage(data?.language_ref)
          setSeason(data?.season_info?._id)
          setVisible(data?.is_visible)
          setActive(data?.is_active)
          const normalData = normalizeStageDataInEdit(data?.parts)
          setParts(normalData)
          setStageHint(data?.stage_hint)
          setStageNumberInLanguage(data?.stage_number_in_package)
          setStageNumberInSeason(data?.stage_number_in_season)
          setPublicationStatus(data?.publication_status)
          setCompletionStatus(data?.completion_status)
          const seasons = [{
            label: data?.season_info?.title,
            value: data?.season_info?._id,
          }]
          setSeasonList(seasons)
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
    if(!season || !language || stageNumberInLanguage.length == 0 || stageNumberInSeason.length == 0 || !publicationStatus || !completionStatus){
      toast.error("ابتدا موارد الزامی را وارد کنید", {
        position: "top-center",
        autoClose: 6000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: typeof window !== "undefined" && localStorage.getItem("theme") == "dark" ? "dark" : "light",
      });
    } else {
      const result = validateStage(parts);
      if(result.status == 200){
        const normalData = normalizeStageData(parts)
        const arr1 = normalData
        const oldDataParts = normalizeStageDataInEdit(oldData.parts)
        const normalOldData = normalizeStageData(oldDataParts)
        const arr2 = normalOldData
        const check = hasDifferences(arr1, arr2)
        if(check == true){
          checkedAndRegister(normalData)
        } else {
          checkedAndRegister()
        }
      } else {
        toast.error(result.message, {
          position: "top-center",
          autoClose: 6000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: typeof window !== "undefined" && localStorage.getItem("theme") == "dark" ? "dark" : "light",
        });
      }
    }
  }
  const checkedAndRegister = async(normalData?:PartItem[])=>{
    setLoading(true)
    let data = {
      query: `
          mutation editPackageGameStageInformation(
            $_id : ID!,
            $parts : [StageStructure],
            $stage_hint : String,
            $stage_number_in_package : Int,
            $stage_number_in_season : Int,
            $language_ref : ID,
            $is_visible : Boolean,
            $is_active : Boolean,
            $publication_status : String,
            $completion_status : String,
            $change_version_updated : Boolean!
          ){
            editPackageGameStageInformation(
              _id : $_id,
              parts : $parts,
              stage_hint : $stage_hint,
              stage_number_in_package : $stage_number_in_package,
              stage_number_in_season : $stage_number_in_season,
              language_ref : $language_ref,
              is_visible : $is_visible,
              is_active : $is_active,
              publication_status : $publication_status,
              completion_status : $completion_status,
              change_version_updated : $change_version_updated
            ) {
              status,
              message,
            }
          }
          `,
      variables: {
        _id : stageId,
        parts : (normalData && normalData?.length > 0)?normalData:undefined,
        stage_hint : ((oldData?.stage_hint && stageHint !== oldData?.stage_hint) || (!oldData?.stage_hint && stageHint?.length >0))?stageHint:undefined,
        stage_number_in_package : (oldData?.stage_number_in_package !== Number(stageNumberInLanguage) && Number(stageNumberInLanguage) > 0)?Number(stageNumberInLanguage):undefined,
        stage_number_in_season : (oldData?.stage_number_in_season !== Number(stageNumberInSeason) && Number(stageNumberInSeason) > 0)?Number(stageNumberInSeason):undefined,
        language_ref : language !== oldData?.language_ref?language:undefined,
        is_visible : (oldData?.is_visible !== visible)?visible:undefined,
        is_active : (oldData?.is_active !== active)?active:undefined,
        publication_status : (oldData?.publication_status !== publicationStatus)?publicationStatus:undefined,
        completion_status : (oldData?.completion_status !== completionStatus)?completionStatus:undefined,
        change_version_updated : changeVersionUpdated
      },
    };
    await axios({
      url: "/",
      method: "post",
      data: data
    })
      .then(async (response) => {
        setLoading(false);
        if (response.data?.data?.editPackageGameStageInformation?.status == 200) {
            toast.success(response.data?.data?.editPackageGameStageInformation?.message, {
              position: "top-center",
              autoClose: 5000,
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
  }
  ///////////////////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////////////
  const addNewPart = () => {
    const newItem: PartItem = {
      sentence: "",
      sentence_hint: "",
      sentence_display: "",
      words: [],
      order: undefined
    }
    setParts(prev => [...prev, newItem]);
  }
  const removePart = (indexToRemove: number) => {
    setParts(prev => prev.filter((_, index) => index !== indexToRemove));
    if (activeTab === indexToRemove && indexToRemove > 0) {
      setActiveTab(indexToRemove - 1);
    } else if (activeTab > indexToRemove) {
      setActiveTab(prev => prev - 1);
    }
  };
  //////////////////////////////////////////////////////////////////
  const changeSentence = (newValue: string) => {
    const index = activeTab
    setParts(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], sentence: newValue };
      return updated;
    });
  };
  const changeSentenceHint = (newValue: string) => {
    const index = activeTab
    setParts(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], sentence_hint: newValue };
      return updated;
    });
  };
  const changeSentenceDisplay = (newValue: string) => {
    const index = activeTab
    setParts(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], sentence_display: newValue };
      return updated;
    });
  }; 
  const addNewWord = () => {
    const newItem: WordItem = {
      word: "",
      word_hint: "",
      unknown_word: false,
      letters: [],
      additional_words: [],
      hidden_words: [],
      order:undefined
    };
    setParts(prev => {
      const updated = [...prev];
      updated[activeTab].words.push(newItem);
      return [...updated];
    });
  };
  const changeWord = (index: number, newValue: string) => {
    setParts(prev => {
      const updated = [...prev];
      updated[activeTab].words[index].word = newValue;
      return updated;
    });
  };
  const changeWordHint = (index: number, newValue: string) => {
    setParts(prev => {
      const updated = [...prev];
      updated[activeTab].words[index].word_hint = newValue;
      return updated;
    });
  };
  const changeUnknownWord = (index: number) => {
    setParts(prev => {
      const updated = [...prev];
      updated[activeTab].words[index] = {
        ...updated[activeTab].words[index],
        unknown_word: !updated[activeTab].words[index].unknown_word,
      };
      return updated;
    });
  };
  const deleteWord = (index: number) => {
    setParts(prev => {
      const updated = [...prev];
      updated[activeTab].words.splice(index, 1);
      return [...updated];
    });
  };
  const addLetter = (index: number) => {
    setParts(prev => {
      const updated = [...prev];
      updated[activeTab].words[index].letters.push("");
      return [...updated];
    });
  };
  const changeLetter = (wordIndex: number, letterIndex: number, newValue: string) => {
    setParts(prev => {
      const updated = [...prev];
      updated[activeTab].words[wordIndex].letters[letterIndex] = newValue;
      return [...updated];
    });
  };
  const addAdditionalWord = (index: number) => {
    setParts(prev => {
      const updated = [...prev];
      updated[activeTab].words[index].additional_words.push("");
      return [...updated];
    });
  };
  const addHiddenWord = (index: number) => {
    setParts(prev => {
      const updated = [...prev];
      updated[activeTab].words[index].hidden_words.push("");
      return [...updated];
    });
  };
  const changeAdditionalWord = (wordIndex: number, wordIdx: number, newValue: string) => {
    setParts(prev => {
      const updated = [...prev];
      updated[activeTab].words[wordIndex].additional_words[wordIdx] = newValue;
      return [...updated];
    });
  };
  const changeHiddenWord = (wordIndex: number, wordIdx: number, newValue: string) => {
    setParts(prev => {
      const updated = [...prev];
      updated[activeTab].words[wordIndex].hidden_words[wordIdx] = newValue;
      return [...updated];
    });
  };
  const deleteLetter = (wordIndex: number, letterIndex: number) => {
    setParts(prev => {
      const updated = [...prev];
      updated[activeTab].words[wordIndex].letters.splice(letterIndex, 1);
      return [...updated];
    });
  };
  const deleteAdditionalWord = (wordIndex: number, wordIdx: number) => {
    setParts(prev => {
      const updated = [...prev];
      updated[activeTab].words[wordIndex].additional_words.splice(wordIdx, 1);
      return [...updated];
    });
  };
  const deleteHiddenWord = (wordIndex: number, wordIdx: number) => {
    setParts(prev => {
      const updated = [...prev];
      updated[activeTab].words[wordIndex].hidden_words.splice(wordIdx, 1);
      return [...updated];
    });
  };
  //////////////////////////////////////////////////////////////////
  let isDown = false;
  let startX: number;
  let scrollLeft: number;

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = scrollRef.current;
    if (!el) return;
    isDown = true;
    el.classList.add('cursor-grabbing');
    startX = e.pageX - el.offsetLeft;
    scrollLeft = el.scrollLeft;
  };

  const handleMouseLeaveOrUp = () => {
    const el = scrollRef.current;
    if (!el) return;
    isDown = false;
    el.classList.remove('cursor-grabbing');
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = scrollRef.current;
    if (!el || !isDown) return;
    e.preventDefault();
    const x = e.pageX - el.offsetLeft;
    const walk = (x - startX) * 1.5; // سرعت حرکت
    el.scrollLeft = scrollLeft - walk;
  };

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
        <div className="flex w-full items-center justify-between mt-6">
          {
            oldData?.package_info?.icon_image && (
              <ImageComponent
                parentclasses="w-16 h-16 lg:h-[80px] lg:w-[80px] 2xl:h-[80px] 2xl:w-[80px] !rounded-xl"
                imageClasses="!rounded-xl"
                src={oldData.package_info.icon_image}
              />
            )
          }
          <div className="flex-1 pr-3 flex flex-col justify-between">
            <div className="flex items-center">
              <h1 className="text-[16px] 2xl:text-[18px] font-['iransans-bold'] text-text dark:text-text_dark">
                {oldData.package_info.title}
              </h1>
            </div>
          </div>
        </div>
      <div className="mt-6">
        <label
          className="font-['iransans-md'] flex-1 text-right text-text6 dark:text-text6_dark text-[.85rem] sm:text-[.95rem] cursor-pointer py-3"
          htmlFor="name"
        >
          فصل مرحله
          <span className="text-red-500 px-1">*</span>
          <div className={`mt-1 flex-1 gap-2 w-full items-center justify-between`}>
            <SelectInput
              value={season}
              disabled={true}
              name="package-game-season"
              options={seasonList}
              onChange={(value) => {
                setSeason(value || null)
              }}
            />
          </div>
        </label>
      </div>
      <div className="mt-6">
        <label
          className="font-['iransans-md'] flex-1 text-right text-text6 dark:text-text6_dark text-[.85rem] sm:text-[.95rem] cursor-pointer py-3"
          htmlFor="name"
        >
          زبان مرحله
          <span className="text-red-500 px-1">*</span>
          <div className={`mt-1 flex-1 gap-2 w-full items-center justify-between`}>
            <SelectInput
              value={language}
              name="package-game-language"
              options={languageList}
              onChange={(value) => setLanguage(value || null)}
            />
          </div>
        </label>
      </div>
      <div className="mt-6">
        <label
          className="font-['iransans-md'] flex-1 text-right text-text6 dark:text-text6_dark text-[.85rem] sm:text-[.95rem] cursor-pointer py-3"
          htmlFor="stage-number-in-language"
        >
          شماره مرحله در پکیج
          <span className="text-red-500 px-1">*</span>
          <div className={`mt-1 flex gap-2 w-full items-center justify-between`}>
            <Input type="number" id="stage-number-in-language" value={stageNumberInLanguage} changeState={setStageNumberInLanguage} classes="flex-1" inputStyles="!text-base" />
          </div>
        </label>
      </div>
      <div className="mt-6">
        <label
          className="font-['iransans-md'] flex-1 text-right text-text6 dark:text-text6_dark text-[.85rem] sm:text-[.95rem] cursor-pointer py-3"
          htmlFor="stage-number-in-season"
        >
          شماره مرحله در فصل
          <span className="text-red-500 px-1">*</span>
          <div className={`mt-1 flex gap-2 w-full items-center justify-between`}>
            <Input type="number" id="stage-number-in-season" value={stageNumberInSeason} changeState={setStageNumberInSeason} classes="flex-1" inputStyles="!text-base" />
          </div>
        </label>
      </div>
      <div className="mt-6">
        <label
          className="text-right lg:w-2/3 w-5/6 xl:w-3/5 2xl:w-1/2 text-text6 dark:text-text6_dark cursor-pointer font-iransans-md text-sm"
          htmlFor="description-stage-season"
        >
          دربارهٔ مرحله
          <TextAreaInput
            id={"description-stage-season"}
            value={stageHint}
            changeState={(e: any) => setStageHint(e)}
            textAreaStyles="!text-sm mt-1"
            rows={4}
          />
        </label>
      </div>
      <div className="mt-6">
        <label
          className="font-['iransans-md'] flex-1 text-right text-text6 dark:text-text6_dark text-[.85rem] sm:text-[.95rem] cursor-pointer py-3"
          htmlFor="name"
        >
          وضعیت انتشار مرحله
          <span className="text-red-500 px-1">*</span>
          <div className={`mt-1 flex-1 gap-2 w-full items-center justify-between`}>
            <SelectInput
              value={publicationStatus}
              name="package-game-publication-status"
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
          وضعیت کامل بودن مرحله
          <span className="text-red-500 px-1">*</span>
          <div className={`mt-1 flex-1 gap-2 w-full items-center justify-between`}>
            <SelectInput
              value={completionStatus}
              name="package-game-completion-status"
              options={CompletionStatus}
              onChange={(value) => setCompletionStatus(value)}
            />
          </div>
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
      <div className="mt-6 mb-6">
        <GradientButton
          buttonText={"افزودن یک جمله"}
          onClickFn={addNewPart}
          loading={false}
          classes="!text-sm !flex-none !px-8 sm:!w-[200px] !w-full"
        />
      </div>
              
      <div className="w-full left-0 right-0 sticky top-[61px] z-40 bg-background/80 dark:bg-background_dark/80 backdrop-blur border-b border-border dark:border-border_dark shadow-lg">
        <div
          ref={scrollRef}
          className="w-full max-w-full overflow-x-auto whitespace-nowrap scrollbar-hide cursor-grab px-2 py-3"
          onMouseDown={handleMouseDown}
          onMouseLeave={handleMouseLeaveOrUp}
          onMouseUp={handleMouseLeaveOrUp}
          onMouseMove={handleMouseMove}
        >
          <div className="flex inline-flex gap-6">
            {parts.map((_, index) => (
              <div
                key={index.toString()}
                className="relative inline-flex items-center group font-['iransans-md'] bg-muted/60 dark:bg-muted_dark/50 rounded-lg shadow-sm transition-all hover:shadow-md"
              >
                <button
                  onClick={() => setActiveTab(index)}
                  className={`min-w-[130px] px-5 py-2 text-sm rounded-lg transition-all duration-200
                    ${
                      activeTab === index
                        ? 'text-primary bg-primary/20 border-2 border-primary'
                        : 'text-text2 border-2 border-text5 dark:border-text5_dark dark:text-text2_dark hover:bg-accent/30'
                    }
                  `}
                >
                  جمله {index + 1}
                </button>

                <div
                  className="absolute -top-2 -right-2 bg-white dark:bg-background_dark rounded-full p-[2px] shadow cursor-pointer group-hover:opacity-100 opacity-70 transition-all"
                  onClick={() => removePart(index)}
                >
                  <BiTrash size={25} className="text-red_error" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {
        parts?.length > 0 &&(
          <div>
           <div className="mt-6">
              <label
                className="font-['iransans-md'] flex-1 text-right text-text6 dark:text-text6_dark text-[.85rem] sm:text-[.95rem] cursor-pointer py-3"
                htmlFor="sentence-stage"
              >
                جمله
                <span className="text-red-500 px-1">*</span>
                <div className={`mt-1 flex gap-2 w-full items-center justify-between`}>
                  <Input id="sentence-stage" value={parts[activeTab].sentence} changeState={(value: string) => changeSentence(value)} classes="flex-1" inputStyles="!text-base" />
                </div>
              </label>
            </div>
            <div className="mt-6">
              <label
                className="font-['iransans-md'] flex-1 text-right text-text6 dark:text-text6_dark text-[.85rem] sm:text-[.95rem] cursor-pointer py-3"
                htmlFor="sentence-stage"
              >
                راهنمای جمله
                <div className={`mt-1 flex gap-2 w-full items-center justify-between`}>
                  <Input id="sentence-stage" value={parts[activeTab].sentence_hint} changeState={(value: string) => changeSentenceHint(value)} classes="flex-1" inputStyles="!text-base" />
                </div>
              </label>
            </div>
            <div className="mt-6">
              <label
                className="font-['iransans-md'] flex-1 text-right text-text6 dark:text-text6_dark text-[.85rem] sm:text-[.95rem] cursor-pointer py-3"
                htmlFor="sentence-stage"
              >
                نمایش جمله
                <div className={`mt-1 flex gap-2 w-full items-center justify-between`}>
                  <Input id="sentence-stage" value={parts[activeTab].sentence_display} changeState={(value: string) => changeSentenceDisplay(value)} classes="flex-1" inputStyles="!text-base" />
                </div>
              </label>
            </div>
            <div className="mt-6">
              <GradientButton
                buttonText={"افزودن کلمه جدید"}
                onClickFn={addNewWord}
                loading={false}
                classes="!text-sm !flex-none !px-8 sm:!w-[200px] !w-full"
              />
            </div>
          {
            parts[activeTab].words.map((item:any, index:number)=>(
                <div key={index.toString()} className="bg-background2 my-12 dark:bg-background2_dark p-4 border-2 border-dashed border-primary dark:border-primary rounded-md">
                  <div className={`flex w-full items-center justify-between gap-4`}>
                    <div className="flex w-[55%] flex-row items-center font-['iransans-md'] gap-2">
                      <div
                        className="flex justify-center items-center rounded-full transition text-white bg-green_color w-10 h-10"
                      >
                        <p className="text-lg text-center">{`${index + 1}`}</p>
                      </div>
                      <Input 
                        id="name-stage-season" 
                        value={item.word}
                        changeState={(value: string) => changeWord(index, value)}
                        classes="flex-1" inputStyles="!text-base"
                      />
                    </div>
                    <div className="flex flex-row items-center font-['iransans-md'] gap-4">
                      <p className="text-xs 3xs:text-sm text-center">کلمه نامشخص</p>
                      <Switch
                        checked={item.unknown_word}
                        onChange={() => {}}
                        onClick={() => changeUnknownWord(index)}
                        className={`${item.unknown_word ? "bg-rgba2" : "bg-border dark:bg-border_dark"}
            relative h-[19px] w-[33px] shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out flex items-center`}
                      >
                        <span
                          aria-hidden="true"
                          className={`${
                            item.unknown_word
                              ? "translate-x-2 bg-primary"
                              : "-translate-x-[16px] bg-text5 dark:bg-text5_dark"
                          }
            pointer-events-none inline-block h-[22px] w-[22px] transform rounded-full shadow-lg ring-0 transition duration-200 ease-in-out`}
                        />
                      </Switch>
                      <div
                        onClick={() => deleteWord(index)}
                        className="flex justify-center items-center rounded transition text-white bg-red_error sm:hover:bg-red_color text-2xl w-10 h-10"
                      >
                        <BiTrash />
                      </div>
                    </div>
                  </div>
                  <div className="mt-2">
                    <label
                      className="font-['iransans-md'] flex-1 text-right text-text6 dark:text-text6_dark text-[.85rem] sm:text-[.95rem] cursor-pointer py-3"
                      htmlFor="sentence-stage"
                    >
                      راهنمای کلمه
                      <div className={`mt-1 flex gap-2 w-full items-center justify-between`}>
                        <Input id="sentence-stage" value={item.word_hint} changeState={(value: string) => changeWordHint(index, value)} classes="flex-1" inputStyles="!text-base" />
                      </div>
                    </label>
                  </div>
                  {item.unknown_word && (
                    <>
                      <div className="mt-6 flex w-full items-center justify-between gap-4">
                        <GradientButton
                          buttonText={"افزودن حرف"}
                          onClickFn={() => addLetter(index)}
                          loading={false}
                          classes="!text-sm !flex-none !px-8 !w-[31%]"
                        />
                        <GradientButton
                          buttonText={"افزودن کلمه اضافه"}
                          onClickFn={() => addAdditionalWord(index)}
                          loading={false}
                          classes="!text-sm !flex-none !px-8 !w-[31%]"
                        />
                        <GradientButton
                          buttonText={"افزودن کلمه پنهان"}
                          onClickFn={() => addHiddenWord(index)}
                          loading={false}
                          classes="!text-sm !flex-none !px-8 !w-[31%]"
                        />
                      </div>
                      {
                        item?.letters?.length > 0 &&(
                          <div className="mt-4 flex flex-wrap gap-3">
                            {item.letters.map((letter:any, letterIdx:number) => (
                              <div key={letterIdx} className="relative inline-block">
                                <Input
                                  value={letter}
                                  changeState={(val: string) => changeLetter(index, letterIdx, val.slice(0, 1))}
                                  classes="w-12 h-12 text-center rounded-md"
                                  inputStyles="text-lg text-center font-bold tracking-wide"
                                  maxLength={1}
                                />
                                <div
                                  onClick={() => deleteLetter(index, letterIdx)}
                                  className="absolute -top-1 -right-2 z-10 text-red_error items-center justify-center cursor-pointer text-[20px] sm:text-[20px]"
                                >
                                  <BiTrash size={20} />
                                </div>
                              </div>
                            ))}
                          </div>
                        )
                      }
                      {item?.additional_words?.length > 0&&<Border top="mt-4" bottom="mb-4"/>}
                      {
                        item?.additional_words?.length > 0&&(
                          <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3">
                            {item.additional_words.map((word:any, addIdx:number) => (
                              <div key={addIdx} className="relative">
                                <Input
                                  value={word}
                                  changeState={(val: string) => changeAdditionalWord(index, addIdx, val)}
                                  classes="w-full rounded-md"
                                  inputStyles="text-sm"
                                />
                                <div
                                  onClick={() => deleteAdditionalWord(index, addIdx)}
                                  className="absolute -top-2 -right-2 z-10 text-red_error items-center justify-center cursor-pointer text-[20px] sm:text-[20px]"
                                >
                                  <BiTrash size={20} />
                                </div>
                              </div>
                            ))}
                          </div>
                        )
                      }
                      {item?.hidden_words?.length > 0&&<Border top="mt-4" bottom="mb-4"/>}
                      {
                        item?.hidden_words?.length > 0&&(
                          <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3">
                            {item.hidden_words.map((word:any, addIdx:number) => (
                              <div key={addIdx} className="relative">
                                <Input
                                  value={word}
                                  changeState={(val: string) => changeHiddenWord(index, addIdx, val)}
                                  classes="w-full rounded-md"
                                  inputStyles="text-sm"
                                />
                                <div
                                  onClick={() => deleteHiddenWord(index, addIdx)}
                                  className="absolute -top-2 -right-2 z-10 text-red_error items-center justify-center cursor-pointer text-[20px] sm:text-[20px]"
                                >
                                  <BiTrash size={20} />
                                </div>
                              </div>
                            ))}
                          </div>
                        )
                      }
                    </>
                  )}
                </div>
            ))
          }
          </div>
        )
      }
      <Footer buttonFn={registerAndConfirm} buttonText="ویرایش اطلاعات" loadingButton={loading} classes="md:!mr-72 !justify-end" />
      <ModalInput
        ref={(Ref) => {
          ModalInputHelper.setRef(Ref);
        }}
      />
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
    </div>
  );
};

export default Page;
