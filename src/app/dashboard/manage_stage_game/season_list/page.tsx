"use client";

import React, { useEffect, useState } from "react";
import FooterPaginate from "@/components/FooterPaginate";
import ScreenLoading from "@/components/ScreenLoading";
import { AppDispatch, RootState } from "@/redux/store";
import InfiniteScroll from "react-infinite-scroll-component";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import SelectInput from "@/components/SelectInput";
import { Switch } from "@headlessui/react";
import Border from "@/components/Border";


type SelectedOption = {
  value: any;
  label: string;
};
const PublicationStatus:SelectedOption[] = [
  {value:null, label:"انتخاب وضعیت انتشار"},
  {value:"draft", label:"پیشنویس"},
  {value:"ready", label:"آماده انتشار"},
  {value:"published", label:"منتشر شده"},
  {value:"archived", label:"آرشیو شده، غیرفعال"},
  {value:"rejected", label:"رد شده"},
]
const CompletionStatus:SelectedOption[] = [
  {value:null, label:"انتخاب وضعیت کامل بودن فصل"},
  {value:"incomplete", label:"ناقص (نیاز به بخش‌هایی بیشتر)"},
  {value:"in_progress", label:"در حال کار و بازبینی"},
  {value:"complete", label:"کامل‌شده ولی قابل به‌روزرسانی"},
  {value:"finalized", label:"نهایی‌شده، بدون نیاز به تغییر"},
]
const Page = () => {
  const [search, setSearch] = useState("");
  const [data, setData] = useState<any>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [getError, setGetError] = useState(false);
  const [noItem, setNoItem] = useState(false);
  const [footerTry, setFooterTry] = useState(false);
  const [footerLoading, setFooterLoading] = useState(false);
  const [searchTimeout, setSearchTimeout] = useState<any>(null);
  const [publicationStatus, setPublicationStatus] = useState<string | null>(null)
  const [completionStatus, setCompletionStatus] = useState<string | null>(null)
  const [visible, setVisible] = useState(false);
  const [active, setActive] = useState(false);
  const [language, setLanguage] = useState<string | null>(null)
  const [languageList, setLanguageList] = useState([])

  useEffect(() => {
    getDataForFirst(null);
  }, []);

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

  const getDataForFirst = async (txt: any) => {
    await axios({
      url: "/",
      method: "post",
      data: {
        query: `
            query paginateStageGameSeasonForAdmin(
              $page : Int,
              $limit : Int,
              $language : ID,
              $search : String,
              $filter_publication_status : String,
              $filter_completion_status : String,
              $filter_visible : Boolean,
              $filter_active : Boolean,
            ){
                paginateStageGameSeasonForAdmin(
                  page : $page,
                  limit : $limit,
                  language : $language,
                  search : $search,
                  filter_publication_status : $filter_publication_status,
                  filter_completion_status : $filter_completion_status,
                  filter_visible : $filter_visible,
                  filter_active : $filter_active,
                ) {
                    list{
                        _id,
                        title,
                        icon_image
                    },
                    hasNextPage,
                    nextPage
                }
            }
            `,
        variables: {
          page : 1,
          language : language??undefined,
          search : txt?.length>1?txt:undefined,
          filter_publication_status : publicationStatus??undefined,
          filter_completion_status : completionStatus??undefined,
          filter_visible : visible,
          filter_active : active,
        },
      },
    })
      .then((response) => {
        const riciveData = response.data.data.paginateStageGameSeasonForAdmin;
        if (riciveData.hasNextPage == true) {
          setLoading(false);
          setData(riciveData.list);
          setPage(riciveData.nextPage);
          setFooterLoading(true);
        } else {
          if (riciveData.list.length > 0) {
            setFooterLoading(false);
            setPage(1);
            setLoading(false);
            setData(riciveData.list);
          } else {
            setFooterLoading(false);
            setLoading(true);
            setData([]);
            setNoItem(true);
          }
        }
      })
      .catch(() => {
        setFooterLoading(false);
        setLoading(true);
        setFooterTry(false);
        setGetError(true);
        setData([]);
      });
  };

  const getDataForMore = async () => {
    await axios({
      url: "/",
      method: "post",
      data: {
        query: `
            query paginateStageGameSeasonForAdmin(
              $page : Int,
              $limit : Int,
              $language : ID,
              $search : String,
              $filter_publication_status : String,
              $filter_completion_status : String,
              $filter_visible : Boolean,
              $filter_active : Boolean,
            ){
                paginateStageGameSeasonForAdmin(
                  page : $page,
                  limit : $limit,
                  language : $language,
                  search : $search,
                  filter_publication_status : $filter_publication_status,
                  filter_completion_status : $filter_completion_status,
                  filter_visible : $filter_visible,
                  filter_active : $filter_active,
                ) {
                    list{
                        _id,
                        title,
                        icon_image
                    },
                    hasNextPage,
                    nextPage
                }
            }
            `,
        variables: {
          page : page,
          language : language??undefined,
          search : search?.length>1?search:undefined,
          filter_publication_status : publicationStatus??undefined,
          filter_completion_status : completionStatus??undefined,
          filter_visible : visible,
          filter_active : active,
        },
      },
    })
      .then((response) => {
        const riciveData = response.data.data.paginateStageGameSeasonForAdmin;
        if (riciveData.hasNextPage == true) {
          setData([...data, ...riciveData.list]);
          setPage(riciveData.nextPage);
          setFooterLoading(true);
        } else {
          if (riciveData.list.length > 0) {
            setFooterLoading(false);
            setPage(page);
            setData([...data, ...riciveData.list]);
          } else {
            setFooterLoading(false);
            setNoItem(data.length > 0 ? false : true);
            setLoading(data.length > 0 ? false : true);
          }
        }
      })
      .catch(() => {
        setLoading(data.length > 0 ? false : true);
        setFooterTry(data.length > 0 ? true : false);
        setGetError(data.length > 0 ? false : true);
      });
  };

  const handleSearch = (e: string) => {
    setSearch(e);
    clearTimeout(searchTimeout);
    setSearchTimeout(
      setTimeout(() => {
        setPage(1);
        setLoading(true);
        setFooterLoading(false);
        setGetError(false);
        setNoItem(false);
        setFooterTry(false);
        setData([]);

        getDataForFirst(e);
        clearTimeout(searchTimeout);
      }, 1500)
    );
  };

  const submitSearch = () => {
    getDataForFirst(search);
    clearTimeout(searchTimeout);
  };

  const clearSearchFn = () => {
    setSearch("");
    getDataForFirst("");
    clearTimeout(searchTimeout);
  };

  const tryAgain = () => {
    setFooterLoading(false);
    setLoading(true);
    setGetError(false);
    setNoItem(false);
    setPage(1);
    setFooterTry(false);
    const txt = search == "" ? null : search;
    getDataForFirst(txt);
  };

  return (
    <div className="h-full w-full m-0">
      <div className="flex flex-col lg:flex-row h-full w-full">
        <div className="lg:w-1/4 p-4 lg:h-full lg:overflow-visible overflow-auto">
            


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
                className="font-['iransans-md'] flex-1 text-right text-text6 dark:text-text6_dark text-[.75rem] sm:text-[.85rem] cursor-pointer py-3"
                htmlFor="name"
              >
                وضعیت انتشار فصل
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
                className="font-['iransans-md'] flex-1 text-right text-text6 dark:text-text6_dark text-[.75rem] sm:text-[.85rem] cursor-pointer py-3"
                htmlFor="name"
              >
                وضعیت کامل بودن فصل
                <div className={`mt-1 flex-1 gap-2 w-full items-center justify-between`}>
                  <SelectInput
                    name="stage-game-language"
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




        </div>
        <div className="lg:w-3/4 p-0 lg:h-[100vh] overflow-auto">
          <div className="p-4">
            
            {loading ? (
              <div className="flex justify-center items-center h-[70vh] sm:h-[80vh]">
                <ScreenLoading notItem={noItem} getError={getError} tryAgain={tryAgain} />
              </div>
            ) : (
              <InfiniteScroll
                dataLength={data?.length}
                next={() => getDataForMore()}
                hasMore={!loading && footerLoading ? true : false}
                loader={
                  !loading && data?.length > 0 ? (
                    <FooterPaginate loading={footerLoading} footerTry={footerTry} tryOperation={getDataForFirst} />
                  ) : (
                    ""
                  )
                }
              >
                <ul
                  role="list"
                  className={`grid gap-4 sm:mx-auto sm:gap-6 grid-cols-1 mt-8 sm:mt-10 max-w-[1300px] ${
                    !open ? "2xl:grid-cols-3 xl:grid-cols-3 lg:grid-cols-2" : "xl:grid-cols-2 2xl:grid-cols-3"
                  }`}
                >
                  {data?.map((item: any, index: number) => (
                    <div>

                    </div>
                  ))}
                </ul>
              </InfiniteScroll>
            )}

          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
