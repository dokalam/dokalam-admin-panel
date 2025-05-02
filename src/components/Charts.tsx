"use client";

import Globals from "@/utils/Globals";
import FaIcons from "@/utils/Icons/FaIcons";
import { useTheme } from "next-themes";
import React, { useEffect, useState } from "react";
import ModalListHelper from "./ModalList/ModalListHelper";
import dynamic from "next/dynamic";

const Charts = ({
  chartType,
  data1,
  data2,
  chartName,
  title,
  maxXaxis = 7,
}: {
  chartType?: any;
  data1: [];
  data2: [];
  chartName: string;
  title: string;
  maxXaxis?: number;
}) => {
  const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });
  const { theme } = useTheme();

  const dynamicWidth = data2.length * 100;
  const chartWidth = dynamicWidth < window.innerWidth ? "100%" : dynamicWidth;

  // const [x_axisPage, setX_axisPage] = useState(1);
  // const [x_axis, setX_axis] = useState(null);

  const [options, setOptions] = useState<any>({
    scroller: {
      enabled: true,
    },
    dataLabels: {
      enabled: true,
      offsetY: chartType == "area" ? -10 : chartType == "bar" ? 5 : chartType == "scatter" && -10,
      style: {
        fontSize: "11px",
        fontFamily: "iransans-light",
        // fontWeight: 'bold',
        colors: [Globals.data.configs.colors.green_color, "#fff"],
      },
    },
    grid: {
      borderColor: "#99999960",
      strokeDashArray: 5,
      xaxis: {
        lines: {
          show: true,
        },
      },
      yaxis: {
        lines: {
          show: true,
        },
      },
    },
    markers: {
      size: 6,
    },
    chart: {
      type: chartType,
      height: "100%",
      fontFamily: "iransans-md",
      width: chartWidth,
      toolbar: {
        autoSelected: "pan",
        tools: {
          zoom: false,
          pan: true,
        },
        export: {
          csv: {
            filename: "داده آماری منوملک",
          },
          svg: {
            filename: "داده آماری منوملک",
          },
          png: {
            filename: "داده آماری منوملک",
          },
        },
      },
    },
    xaxis: {
      categories: data2,
      tickPlacement: "on",
      scrollbar: {
        enabled: true,
      },
      max: maxXaxis,
      labels: {
        style: {
          colors: theme === "dark" ? "#F6F9FC" : "#434343",
          fontSize: "9px",
        },
      },
    },
    yaxis: {
      labels: {
        formatter: (val: any) => {
          return val.toFixed(0);
        },
        offsetX: -10,
        style: {
          colors: theme === "dark" ? "#F6F9FC" : "#434343",
        },
      },
    },
    stroke: {
      show: true,
      curve: "smooth",
      lineCap: "butt",
      colors: undefined,
      width: 1,
      dashArray: 0,
    },
  });

  const series = [
    {
      name: chartName,
      data: data1,
    },
  ];

  useEffect(() => {
    setOptions((last: any) => {
      return {
        ...last,
        dataLabels: {
          ...last.dataLabels,
          offsetY: chartType == "area" ? -10 : chartType == "bar" ? 5 : chartType == "scatter" && -10,
          style: {
            ...last.style,
            colors: [
              chartType == "area"
                ? Globals.data.configs.colors.green_color
                : chartType == "bar"
                ? theme === "dark"
                  ? "#F6F9FC"
                  : "#434343"
                : chartType == "scatter" && Globals.data.configs.colors.green_color,
              "#fff",
            ],
          },
        },
        xaxis: {
          ...last.xaxis,
          labels: {
            ...last.xaxis.labels,
            style: {
              ...last.xaxis.labels.style,
              colors: theme === "dark" ? "#F6F9FC" : "#434343",
            },
          },
        },
        yaxis: {
          ...last.yaxis,
          labels: {
            ...last.yaxis.labels,
            style: {
              ...last.yaxis.labels.style,
              colors: theme === "dark" ? "#F6F9FC" : "#434343",
            },
          },
        },
      };
    });
  }, [theme]);

  const handleChangeChartType = () => {
    ModalListHelper.showNormal({
      title: "نوع نمودار",
      description: title,
      list: [
        {
          _id: "0",
          name: "نمودار خطی",
        },
        {
          _id: "1",
          name: "نمودار میله‌ای",
        },
        {
          _id: "2",
          name: "نمودار نقطه‌ای",
        },
      ],
      buttons: [
        {
          buttonText: "لغو",
          onClickFn: () => {},
          type: "border",
        },
        {
          buttonText: "تایید",
          onClickFn: (selected: number) => {
            setOptions((last: any) => {
              return {
                ...last,
                chart: {
                  ...last.chart,
                  type: selected == 1 ? "area" : selected == 2 ? "bar" : selected == 3 && "scatter",
                },
                dataLabels: {
                  ...last.dataLabels,
                  offsetY: selected == 1 ? -10 : selected == 2 ? 5 : selected == 3 && -10,
                  style: {
                    ...last.style,
                    colors: [
                      selected == 1
                        ? Globals.data.configs.colors.green_color
                        : selected == 2
                        ? theme === "dark"
                          ? "#F6F9FC"
                          : "#434343"
                        : selected == 3 && Globals.data.configs.colors.green_color,
                      "#fff",
                    ],
                  },
                },
              };
            });
          },
        },
      ],
      options: {
        type: "radio_button",
        selected:
          options.chart.type == "area" ? 1 : options.chart.type == "bar" ? 2 : options.chart.type == "scatter" ? 3 : 0,
        fitHeight: true,
      },
    });
  };

  return (
    <div>
      <div
        className="flex select-none rounded-md cursor-pointer justify-between px-2 py-3 transition items-center hover:bg-border2 dark:hover:bg-border2_dark"
        onClick={handleChangeChartType}
      >
        <p className="text-right font-['iransans-md'] text-text6 dark:text-text6_dark text-xs sm:text-sm">{title}</p>
        <div className="text-primary ">
          <FaIcons icon="FaRegChartBar" />
        </div>
      </div>
      <div className="border border-dashed border-border dark:border-border_dark rounded-xl pt-5 bg-background5 dark:bg-background5_dark">
        {typeof window !== "undefined" && <Chart options={options} series={series} type={options.chart.type} />}
      </div>
    </div>
  );
};

export default Charts;
