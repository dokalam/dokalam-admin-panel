"use client";

import React, { useRef, useState, useEffect } from "react";
import axios from "axios";
import { FaUserLarge } from "react-icons/fa6";
import ImageComponent from "@/components/ImageComponent";
import { priceDigitSeperator } from "@/utils/PriceDigitSeparator";
import ScreenLoading from "@/components/ScreenLoading";
import { useParams } from "next/navigation";
import { getTime } from "@/utils/GetTime";
import GradientButton from "@/components/GradientButton";
import { HiOutlineEyeOff, HiOutlineTrash } from "react-icons/hi";
import moment from "moment-jalaali";
import Charts from "@/components/Charts";
import CountUp from "react-countup";
moment.locale('fa');
moment.loadPersian({ usePersianDigits: false, dialect: "persian-modern" });


const gradients = [
  "from-blue-500 to-purple-600",
  "from-emerald-500 to-teal-600",
  "from-orange-500 to-red-500",
  "from-cyan-500 to-blue-600",
  "from-pink-500 to-rose-600",
  "from-violet-500 to-fuchsia-600",
  "from-amber-500 to-orange-600",
  "from-green-500 to-lime-600",
];



const Page = () => {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [getError, setGetError] = useState(false)

  const groupedNumbers = Object.entries(
    (data?.numbers || []).reduce((acc: any, item: any) => {
      if (!acc[item.group]) acc[item.group] = [];
      acc[item.group].push(item);
      return acc;
    }, {})
  );

  useEffect(()=>{
    getData()
  }, [])

  const getData = async()=>{
    await axios({
      url: "/",
      method: "post",
      data: {
        query: `
            query getAdminDashboardData(
              $_id : ID,
            ){
                getAdminDashboardData(
                  _id : $_id,
                ) {
                    numbers{
                        _id,
                        group,
                        number,
                        title,
                        description
                    },
                    charts{
                        title,
                        x_axis,
                        y_axis,
                        total
                    }
                }
            }
            `,
        variables: {
          _id : null
        },
      },
    }).then(async (response) => {
        const data = response.data.data.getAdminDashboardData;
        console.log(data)
        if (data) {
          setData(data)
          setLoading(false)
          
        } else {
          setGetError(true)
        }
      })
      .catch(() => {
        setGetError(true)
      });
  }
  const tryAgain = ()=>{
    setLoading(true)
    setGetError(false)
    getData()
  }
  
  return (
    loading == true?
    <div className="flex items-center justify-center w-full h-[calc(100dvh-60px)]">
      <ScreenLoading
        getError={getError}
        notItem={false}
        tryAgain={tryAgain}
      />
    </div>
    :
    (
      <div className="mt-20 px-4 lg:px-16 2xl:px-32 mb-10 sm:mb-8">
        <div className="flex flex-col gap-8">
          {groupedNumbers.map(([groupName, items]: any, groupIndex) => {
            const gradient = gradients[groupIndex % gradients.length];
            return (
              <div key={groupName} className="flex flex-col gap-4">
                <div className="flex items-center gap-3">
                  <div className={`h-2 w-12 rounded-full bg-gradient-to-r ${gradient}`} />
                  <h2 className="text-lg font-['iransans-black'] text-text dark:text-text_dark">
                    {groupName}
                  </h2>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 2xl:gap-6">
                  {items.map((item: any) => (
                    <div key={item._id} className="group relative overflow-hidden rounded-2xl bg-white dark:bg-background5_dark border border-border/50 dark:border-border_dark/50 shadow-sm hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
                      <div className={`h-1.5 w-full bg-gradient-to-r ${gradient}`} />
                      <div className="p-6 relative">
                        <p className="text-right text-sm text-text2 dark:text-text2_dark font-['iransans-md']">
                          {item.title}
                        </p>
                        <p className={`mt-5 text-center text-3xl sm:text-4xl font-['iransans-black'] bg-gradient-to-r ${gradient} bg-clip-text text-transparent`}>
                          <CountUp start={0} end={Number(item.number)} duration={2.5} delay={0.2} useEasing preserveValue />
                        </p>
                        {item.description && (
                          <p className="mt-4 text-center text-xs text-text4 dark:text-text4_dark leading-6 font-['iransans-light']">
                            {item.description}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 2xl:gap-x-16 gap-y-14 mt-12">
          {data?.charts?.map((item: any, index: number) => (
            <div key={`${index.toString()}`} className="">
              <div className="w-full h-full">
                <Charts
                  chartType={"bar"}
                  data1={item.y_axis}
                  data2={item.x_axis}
                  chartName="تعداد بازدید"
                  title={item.title}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  );
};

export default Page;
