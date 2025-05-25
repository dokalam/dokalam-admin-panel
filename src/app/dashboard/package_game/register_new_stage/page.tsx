"use client";

import React, { useRef, useState, useEffect } from "react";
import axios from "axios";
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
import GradientButton from "@/components/GradientButton";
import { Switch, Listbox, Transition } from "@headlessui/react";
import SelectInput from "@/components/SelectInput";
import Border from "@/components/Border";
import { validateStage } from "@/utils/ValidateStage";
import { normalizeStageData } from "@/utils/NormalizeStageData";
import PackageList from "@/components/PackageList/PackageList";
import PackageListHelper from "@/components/PackageList/PackageListHelper";


type WordItem = {
  word: string;
  word_hint: string;
  unknown_word: boolean;
  letters: string[];
  additional_words: string[];
  order?: number;
};
type PartItem = {
  sentence: string;
  sentence_hint: string;
  words: WordItem[];
  order?: number;
}
type PackageSelectedInfo = {
  _id: string;
  title: string;
  image: string;
}
const Page = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(false);
  const [language, setLanguage] = useState<string | null>(null)
  const [languageList, setLanguageList] = useState([])
  const [season, setSeason] = useState<string | null>(null)
  const [seasonList, setSeasonList] = useState([])
  const [visible, setVisible] = useState(true);
  const [active, setActive] = useState(true);
  const [stageNumber, setStageNumber] = useState("")
  const [stageHint, setStageHint] = useState("")
  const [parts, setParts] = useState<PartItem[]>([]);
  const [activeTab, setActiveTab] = useState(0);
  const [packageSelected, setPackageSelected] = useState<PackageSelectedInfo | null>(null)
  
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
  const getAllSeason = async(value:string)=>{
    const data = {
      query: `
        query getAllPackageGameSeasonForAdmin($package : ID!, $filter_visible : Boolean, $filter_active : Boolean){
          getAllPackageGameSeasonForAdmin(package : $package, filter_visible : $filter_visible, filter_active : $filter_active) {
            _id,
            name,
          }
        }
        `,
      variables: {
        package: value,
        filter_visible: false,
        filter_active: false,
      },
    };
    await axios({
      url: "/",
      method: "post",
      data: data,
    }).then(async (response) => {
        const data = response.data.data.getAllPackageGameSeasonForAdmin;
        if (data.length > 0) {
          const items = data.map((item: any) => ({
            label: item.name,
            value: item._id,
          }));
          items.unshift({
            label: "انتخاب فصل",
            value: null,
          })
          setSeasonList(items);
        }
      })
      .catch(() => {
        setSeasonList([])
      });
  }
  const registerAndConfirm = ()=>{
    if(!season || !language || stageNumber.length == 0){
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
        checkedAndRegister(normalData)
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
  const checkedAndRegister = async(normalData:PartItem[])=>{
    setLoading(true)
    let data = {
      query: `
          mutation newStageDefinitionForStageGame(
            $parts : [StageStructure!]!,
            $stage_hint : String,
            $season : ID!,
            $language : ID!,
            $stage_number : Int!,
            $is_visible : Boolean!,
            $is_active : Boolean!
          ){
            newStageDefinitionForStageGame(
              parts : $parts,
              stage_hint : $stage_hint,
              season : $season,
              language : $language,
              stage_number : $stage_number,
              is_visible : $is_visible,
              is_active : $is_active,
            ) {
              status,
              message,
            }
          }
          `,
      variables: {
        parts : normalData,
        stage_hint : stageHint.trim().length < 3?undefined:stageHint,
        season : season,
        language: language,
        stage_number : Number(stageNumber),
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
        if (response.data?.data?.newStageDefinitionForStageGame?.status == 200) {
            toast.success(response.data?.data?.newStageDefinitionForStageGame?.message, {
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
  ///////////////////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////////////
  const addNewPart = () => {
    const newItem: PartItem = {
      sentence: "",
      sentence_hint: "",
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
  const addNewWord = () => {
    const newItem: WordItem = {
      word: "",
      word_hint: "",
      unknown_word: false,
      letters: [],
      additional_words: [],
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
  const changeAdditionalWord = (wordIndex: number, wordIdx: number, newValue: string) => {
    setParts(prev => {
      const updated = [...prev];
      updated[activeTab].words[wordIndex].additional_words[wordIdx] = newValue;
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
  ////////////////////////////////////////////////////////////////////////
  const selectPackages = ()=>{
    const previousSelected = {
      _id: packageSelected?._id?[packageSelected?._id]:[],
      title: packageSelected?.title?[packageSelected?.title]:[],
      image: packageSelected?.image?[packageSelected?.image]:[],
    };
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
          buttonText: "انتخاب بسته",
          type: "bold",
          onClickFn: ({ data }: { data: any }) => {
            const item = {
              _id: data.id[0],
              title: data.title[0],
              image: data.image[0],
            }
            setPackageSelected(item)
            const value = data.id[0]
            getAllSeason(value)
            PackageListHelper.closeModal();
          },
        },
      ],
    });
  }
  const deletePackageItem = () => {
    setPackageSelected(null)
  };

  return (
    <div className="flex flex-col justify-between w-full lg:w-[600px] 2xl:w-[750px] mt-10 mb-28 px-4 sm:mx-auto">
      <div>
        <label
          className="font-['iransans-md'] flex-1 text-right text-text6 dark:text-text6_dark text-[.85rem] sm:text-[.95rem] cursor-pointer py-3"
          htmlFor="name"
        >
          زبان مرحله
          <span className="text-red-500 px-1">*</span>
          <div className={`mt-1 flex-1 gap-2 w-full items-center justify-between`}>
            <SelectInput
              name="stage-game-language"
              options={languageList}
              onChange={(value) => {
                setLanguage(value || null)
              }}
            />
          </div>
        </label>
      </div>
      <div className="mt-12">
        <GradientButton
          buttonText={"انتخاب بسته و پکیج فصل"}
          onClickFn={selectPackages}
          loading={false}
          classes="!text-sm !flex-none !px-8 sm:!w-[300px] !w-full"
        />
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
              name="stage-game-language"
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
          htmlFor="stage-number"
        >
          شماره مرحله
          <span className="text-red-500 px-1">*</span>
          <div className={`mt-1 flex gap-2 w-full items-center justify-between`}>
            <Input type="number" id="stage-number" value={stageNumber} changeState={setStageNumber} classes="flex-1" inputStyles="!text-base" />
          </div>
        </label>
      </div>
      <div className="mt-6">
        <label
          className="text-right lg:w-2/3 w-5/6 xl:w-3/5 2xl:w-1/2 text-text6 dark:text-text6_dark cursor-pointer font-iransans-md text-sm"
          htmlFor="description-stage-season"
        >
          راهنمای مرحله
          <TextAreaInput
            id={"description-stage-season"}
            value={stageHint}
            changeState={(e: any) => setStageHint(e)}
            textAreaStyles="!text-sm mt-1"
            rows={4}
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
                          classes="!text-sm !flex-none !px-8 !w-[48%]"
                        />
                        <GradientButton
                          buttonText={"افزودن کلمه اضافه"}
                          onClickFn={() => addAdditionalWord(index)}
                          loading={false}
                          classes="!text-sm !flex-none !px-8 !w-[48%]"
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
                    </>
                  )}
                </div>
            ))
          }
          </div>
        )
      }
      <Footer buttonFn={registerAndConfirm} buttonText="ثبت مرحله" loadingButton={loading} classes="md:!mr-72 !justify-end" />
      <ModalInput
        ref={(Ref) => {
          ModalInputHelper.setRef(Ref);
        }}
      />
      <PackageList
        ref={(Ref) => {
          PackageListHelper.setRef(Ref);
        }}
      />
    </div>
  );
};

export default Page;
