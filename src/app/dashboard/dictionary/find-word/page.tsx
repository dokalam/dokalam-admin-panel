"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import Footer from "@/components/Footer/Footer";
import SelectInput from "@/components/SelectInput";
import Input from "@/components/Input";
import { BiTrash, BiCopy } from "react-icons/bi";
import { FaCheck } from "react-icons/fa";
import GradientButton from "@/components/GradientButton";


interface WordItem {
  word: string;
}

interface CategorizedWords {
  [key: number]: string[];
}

const Page = () => {
  const [letter, setLetter] = useState(["", "", ""]);
  const [loading, setLoading] = useState(false);
  const [language, setLanguage] = useState<string | null>(null)
  const [languageList, setLanguageList] = useState([])
  const [words, setWords] = useState<CategorizedWords | null>(null);
  const [copiedWord, setCopiedWord] = useState<any>(null) // برای نمایش آیکون کپی شده
  
  useEffect(()=>{
    getAllLanguage()
  }, [])

  const getAllLanguage = async()=>{
    const data = {
      query: `
        query getAllLanguageForAdmin($filter_visible : Boolean, $filter_active : Boolean){
          getAllLanguageForAdmin(filter_visible : $filter_visible, filter_active : $filter_active) {
            code,
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
            value: item.code,
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

 
  const categorizeWords = (wordsArray: WordItem[]): CategorizedWords => {
    const categorized: CategorizedWords = {};
    
    wordsArray.forEach((item: WordItem) => {
      const wordLength = item.word.length;
      if (!categorized[wordLength]) {
        categorized[wordLength] = [];
      }
      categorized[wordLength].push(item.word);
    });
    
    // مرتب سازی دسته ها (از 3 حرفی به بالا)
    const sortedCategories: CategorizedWords = Object.keys(categorized)
      .map(Number)
      .sort((a: number, b: number) => a - b)
      .reduce((obj: CategorizedWords, key: number) => {
        obj[key] = categorized[key];
        return obj;
      }, {} as CategorizedWords);
    
    return sortedCategories;
  };

  // تابع کپی کردن در کلیپ بورد
  const copyToClipboard = async (word:string, index:number) => {
    try {
      await navigator.clipboard.writeText(word);
      setCopiedWord(`${word}_${index}`);
      toast.success(`"${word}" کپی شد!`, {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: typeof window !== "undefined" && localStorage.getItem("theme") == "dark" ? "dark" : "light",
      });
      setTimeout(() => setCopiedWord(null), 2000);
    } catch (err) {
      toast.error("خطا در کپی کردن", {
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

  const registerAndConfirm = ()=>{
    if(!language){
      toast.error("زبان دیکشنری را انتخاب کنید.",  {
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
          query combineLettersAndFindWords(
            $letter : [String!]!,
            $language : String!,
          ){
            combineLettersAndFindWords(
              letter : $letter,
              language : $language,
            ) {
              word
            }
          }
          `,
      variables: {
        letter : letter.filter(l => l !== ""), // حذف حروف خالی
        language : language
      },
    };
    
    // بررسی اینکه حداقل 3 حرف وجود داشته باشد
    const filteredLetters = letter.filter(l => l !== "");
    if(filteredLetters.length < 3){
      toast.error("حداقل 3 حرف وارد کنید",{
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
      return;
    }
    
    await axios({
      url: "/",
      method: "post",
      data: data,
    })
      .then(async (response) => {
        const data = response.data?.data?.combineLettersAndFindWords;
        if(data && data?.length > 0){
          const categorized = categorizeWords(data);
          setWords(categorized);
          toast.success(`${data.length} کلمه یافت شد`, {
            position: "top-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: typeof window !== "undefined" && localStorage.getItem("theme") == "dark" ? "dark" : "light",
          });
        } else if(data && data?.length == 0){
          setWords(null)
          toast.info("هیچ کلمه‌ای یافت نشد.", {
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
          setWords(null);
          toast.error(response.data?.errors[0]?.data[0]?.message??"هیچ کلمه‌ای یافت نشد",{
            position: "top-center",
            autoClose: 4000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: typeof window !== "undefined" && localStorage.getItem("theme") == "dark" ? "dark" : "light",
          });
        }
        setLoading(false);
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

  const changeLetter = (index: number, value: string) => {
      // فقط حروف الفبای فارسی، عربی و انگلیسی مجاز هستند
      const filteredValue = value.match(/[\u0600-\u06FF\u0750-\u077F\uFB50-\uFDFF\uFE70-\uFEFFa-zA-Z]/g)?.join('') || '';
      setLetter(prev => {
          const newLetter = [...prev];
          newLetter[index] = filteredValue;
          return newLetter;
      });
  };

  const deleteInput = (index: number) => {
    if(letter.length > 3){
      const newLetter = [...letter];
      newLetter.splice(index, 1);
      setLetter(newLetter);
    } else {
      toast.error("حداقل باید 3 حرف را ترکیب کنید.", {
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
  };
  
  const addNewInput = () => {
    if(letter.length < 12){
      setLetter(prev => [...prev, ""]);
    } else {
      toast.error("بیشتر از 12 حرف نمیتوان انتخاب کرد", {
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
  };

  const handlePaste = (index: number, pastedText: string) => {
    // حذف همه چیز به جز حروف الفبای فارسی، عربی و انگلیسی
    // \p{L} تمام حروف همه زبان‌ها را شامل می‌شود (نیاز به flag 'u' دارد)
      const chars = pastedText.match(/[\u0600-\u06FF\u0750-\u077F\uFB50-\uFDFF\uFE70-\uFEFFa-zA-Z]/g) || [];
      
      if (chars.length === 0) return;
      
      setLetter(prev => {
          let newLetters = [...prev];
          let currentIndex = index;
          
          for (let i = 0; i < chars.length; i++) {
              if (currentIndex >= newLetters.length) {
                  if (newLetters.length < 12) {
                      newLetters.push(chars[i]);
                      currentIndex++;
                  } else {
                      break;
                  }
              } else {
                  newLetters[currentIndex] = chars[i];
                  currentIndex++;
              }
          }
          
          return newLetters;
      });
  };
  return (
    <div className="flex flex-col justify-between w-full lg:w-[600px] 2xl:w-[750px] mt-10 mb-28 px-4 sm:mx-auto">
      <div className="mt-6">
        <label
          className="font-['iransans-md'] flex-1 text-right text-text6 dark:text-text6_dark text-[.85rem] sm:text-[.95rem] cursor-pointer py-3"
          htmlFor="name"
        >
          زبان دیکشنری
          <span className="text-red-500 px-1">*</span>
          <div className={`mt-1 flex-1 gap-2 w-full items-center justify-between`}>
            <SelectInput
              value={language}
              name="dictionary-language"
              options={languageList}
              onChange={(value) => setLanguage(value || null)}
            />
          </div>
        </label>
      </div>
      <div className="mt-6">
        <GradientButton
          buttonText={"افزودن یک حرف"}
          onClickFn={addNewInput}
          loading={false}
          classes="!text-sm !flex-none !px-8 sm:!w-[200px] !w-full"
        />
      </div>
      <div className="mt-6 flex items-center justify-center">
        <div className="mt-4 flex flex-wrap gap-3 max-w-[calc(8*4rem+7*0.75rem)] justify-center">
          {letter.map((item: any, index: number) => (
            <div key={index.toString()} className="relative inline-block group">
              <Input
                value={item}
                changeState={(val: string) => changeLetter(index, val.slice(0, 1))}
                classes="w-16 text-center rounded-md"
                inputStyles="!w-16 !h-16 text-lg text-center font-bold tracking-wide"
                maxLength={1}
                fontSize="28px"
                // اضافه کردن هندلر پیست
                onPaste={(e: React.ClipboardEvent<HTMLInputElement>) => {
                  e.preventDefault();
                  const pastedData = e.clipboardData.getData('text');
                  handlePaste(index, pastedData);
                }}
              />
              <div
                onClick={() => deleteInput(index)}
                className="absolute -top-3 -right-3 z-10 
                  bg-gradient-to-br from-red-500 to-red-600 
                  rounded-full p-1.5 
                  shadow-lg hover:shadow-xl 
                  transition-all duration-300 
                  cursor-pointer 
                  text-white 
                  hover:scale-110 active:scale-95
                  opacity-0 group-hover:opacity-100
                  ring-2 ring-white dark:ring-gray-800
                  hover:rotate-12"
              >
                <BiTrash size={14} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* نمایش کلمات دسته بندی شده */}
      {words && (
        <div className="mt-10 space-y-8">
          {Object.entries(words).map(([length, wordList]) => (
            <div key={length} className="bg-gray-50 dark:bg-gray-800/30 rounded-xl p-5">
              <div className="flex items-center justify-between mb-4 pb-3 border-b-2 border-gray-200 dark:border-gray-700">
                <h3 className="text-xl font-['iransans-bold'] text-gray-800 dark:text-gray-200">
                  کلمات {length} حرفی
                </h3>
                <span className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-3 py-1 rounded-full text-sm font-['iransans-md']">
                  {(wordList as string[]).length} کلمه
                </span>
              </div>
              
              <div className="flex flex-wrap gap-3">
                {(wordList as string[]).map((word: string, idx: number) => (
                  <div
                    key={idx}
                    onClick={() => copyToClipboard(word, idx)}
                    className="group relative bg-white dark:bg-gray-800 
                      hover:bg-gradient-to-br hover:from-blue-50 hover:to-purple-50 
                      dark:hover:from-gray-700 dark:hover:to-gray-600
                      border border-gray-200 dark:border-gray-700 
                      rounded-xl px-4 py-2.5 
                      shadow-sm hover:shadow-md 
                      transition-all duration-300 
                      cursor-pointer
                      flex items-center gap-2"
                  >
                    <span className="text-lg font-['iransans-md'] text-gray-700 dark:text-gray-300">
                      {word}
                    </span>
                    <div className="text-gray-400 dark:text-gray-500 group-hover:text-blue-500 transition-colors">
                      {copiedWord === `${word}_${idx}` ? (
                        <FaCheck className="text-green-500" size={16} />
                      ) : (
                        <BiCopy size={16} />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
      
      <Footer buttonFn={registerAndConfirm} buttonText="ترکیب حروف" loadingButton={loading} classes="md:!mr-72 !justify-end" />
    </div>
  );
};

export default Page;