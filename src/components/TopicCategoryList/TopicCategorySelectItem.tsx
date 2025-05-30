"use client";

import React, { useEffect, useState } from "react";
import ImageComponent from "../ImageComponent";
import CheckBox from "../CheckBox";
import Border from "../Border";
import { IoChevronDown, IoChevronUp } from "react-icons/io5";

const TopicCategorySelectItem = ({
  _id,
  title,
  checked,
  deletedItem,
  selectedItem,
  deletedSubItem,
  selectedSubItem,
  numberSelect = 1,
  imageSrc,
  child,
  subCategory,
  extendedState,
  removeSelectProps,
}: {
  _id: any;
  title: any;
  checked: boolean;
  deletedItem: any;
  selectedItem: any;
  deletedSubItem?: (arg: { sub: any }) => any;
  selectedSubItem?: (arg: { sub: any }) => any;
  numberSelect?: number;
  imageSrc?: any,
  child?: boolean;
  subCategory?: any;
  extendedState?: any;
  removeSelectProps?: any;
}) => {
  const [select, setSelect] = useState(checked);
  const [openSub, setOpenSub] = useState(false)
  const [removeSelect, setRemoveSelect] = useState({ id: null, version: 0 })

  useEffect(() => {
    setSelect(checked);
  }, [checked]);

  useEffect(()=> {
    if(removeSelectProps?.id == _id){
      setSelect(false)
    }
  }, [removeSelectProps])

  const selectItem = () => {
    if (select == true) {
      setSelect(false);
      const time = setTimeout(() => {
        deletedItem();
        clearTimeout(time);
      }, 150);
    } else {
      setSelect(true);
      const time = setTimeout(() => {
        if (selectedItem() == false) {
          setSelect(false);
        }
        clearTimeout(time);
      }, 150);
    }
  };

  const deletedSubItemOperation = ({ item }: { item: any }) =>{
    deletedSubItem?.({ sub: item });
  }
  const selectedSubItemOperation = ({ item }: { item: any }) =>{
    if(selectedSubItem?.({ sub: item }) == false){
      setRemoveSelect({ id: item?._id, version: Date.now() })
    }
  }

  const deletedSubItemFunction = ({ sub }: { sub: any }) => {
    deletedSubItem?.({ sub });
  };

  const selectedSubItemFunction = ({ sub }: { sub: any }) => {
    if(selectedSubItem?.({ sub }) == false){
      setRemoveSelect({ id: sub?._id, version: Date.now() })
    }
  };

  return (
    <>
      <div className="py-2 select-none hover:bg-border2 dark:hover:bg-border2_dark " onClick={selectItem}>
        <div>
          <div className="flex items-center py-4">
            <div className="flex w-full items-center justify-between">
              {
                imageSrc&&(
                <ImageComponent
                  parentclasses="w-12 h-12 lg:h-18 lg:w-18 2xl:h-18 2xl:w-18 !rounded-xl"
                  imageClasses="!rounded-xl"
                  src={imageSrc}
                />)
              }
              <div className="flex-1 pr-3 flex flex-col justify-between">
                <div className="flex items-center">
                  <h3 className="text-sm 2xl:text-base font-['iransans-md'] text-text dark:text-text_dark line-clamp-1">
                    {title}
                  </h3>
                </div>
              </div>
            </div>
              
              <div className="flex flex-row items-center gap-4">
                {child === true && (
                  <div
                    onClick={(e) => {
                      e.stopPropagation();
                      setOpenSub(prev => !prev)
                    }}
                    className="p-2 rounded hover:bg-primary dark:hover:bg-primary transition-all"
                  >
                    {openSub ? (
                      <IoChevronDown className="text-2xl text-text dark:text-text_dark hover:text-white" />
                    ) : (
                      <IoChevronUp className="text-2xl text-text dark:text-text_dark hover:text-white" />
                    )}
                  </div>
                )}
                {numberSelect > 1 ? (
                  <CheckBox checked={select} id={_id} onChange={selectItem} />
                ) : (
                  <div className="relative !w-[20px] !h-[20px] !box-border flex justify-center items-center border-2 border-primary rounded-full">
                    <input
                      type="radio"
                      checked={select}
                      id={_id}
                      onChange={selectItem}
                      className={`radio-button-input focus:outline-none hidden`}
                    />
                    <div className="radio-button rounded-full absolute top-0 bottom-0 right-0 left-0 flex items-center justify-center z-[1000]">
                      <span className="bg-primary h-[9.5px] w-[9.5px] rounded-full"></span>
                    </div>
                  </div>
                )}
              </div>
          </div>
        </div>
        <div />
      </div>
      {
        (subCategory && subCategory?.length > 0 && openSub == true) &&(
        <ul role="list" className="flex flex-col pr-12 relative">
          {subCategory?.map((item: any, index: number) => (
            <div key={index.toString()} className="relative pr-4">
              {/* خط عمودی در سمت راست برای RTL */}
              <div className="absolute left-full top-0 h-full border-l-2 border-primary dark:border-primary"></div>

              <Border />
              <TopicCategorySelectItem
                _id={item._id}
                key={index.toString()}
                title={item.title}
                checked={extendedState.find((i: any) => i == item._id) ? true : false}
                numberSelect={numberSelect}
                deletedItem={() => deletedSubItemOperation({ item })}
                selectedItem={() => selectedSubItemOperation({ item })}
                deletedSubItem={deletedSubItemFunction}
                selectedSubItem={selectedSubItemFunction}
                imageSrc={item?.image ?? null}
                child={item.child}
                subCategory={item.sub_category}
                extendedState={extendedState}
                removeSelectProps={removeSelect}
              />
            </div>
          ))}
        </ul>
        )
      }
    </>
  );
};

export default TopicCategorySelectItem;
