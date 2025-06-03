"use client";

import React, { useEffect, useState } from "react";
import FooterPaginate from "@/components/FooterPaginate";
import ScreenLoading from "@/components/ScreenLoading";
import { AppDispatch, RootState } from "@/redux/store";
import InfiniteScroll from "react-infinite-scroll-component";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";

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

  useEffect(() => {
    // getDataForFirst(null);
  }, []);

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
          language : "",
          search : txt,
          filter_publication_status : "",
          filter_completion_status : "",
          filter_visible : "",
          filter_active : "",
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
          page : 1,
          language : "",
          search : search,
          filter_publication_status : "",
          filter_completion_status : "",
          filter_visible : "",
          filter_active : "",
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
          
        </div>
        <div className="lg:w-3/4 p-0 lg:h-[100vh] overflow-auto">
          <div className="p-4">
            
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
