"use client";

import React, { forwardRef, useImperativeHandle, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { CalendarModalInterface } from "@/interfaces/ModalInterface";
import { Calendar, CalendarProvider } from "zaman";
import Globals from "@/utils/Globals";

const CalendarModal = forwardRef((_, ref) => {
  const [isOpen, setIsOpen] = useState(false);

  const [callBack, setCallBackC] = useState<any>(null);
  const [maxDate, setMaxDate] = useState(undefined);
  const [minDate, setMinDate] = useState(undefined);
  const [calendarValue, setCalendarValue] = useState(new Date());
  const [hideButtons, setHideButtons] = useState(false)

  const openModal = (options: CalendarModalInterface) => {
    window.history.pushState(null, "", window.location.pathname);
    window.addEventListener("popstate", handleBackBrowserBtn);

    setIsOpen(true);
    if (options) {
      setCallBackC(options.callBack);
      if (options.maxDate) {
        setMaxDate(options.maxDate);
      }
      if (options.minDate) {
        setMinDate(options.minDate);
      }
      if (options.selectedDate) {
        setCalendarValue(options.selectedDate);
      }
      if (options?.hideButtons == true) {
        setHideButtons(options.hideButtons)
      }
    }
  };

  const handleBackBrowserBtn = () => {
    const back = true;
    closeModal(back);
  };
  const handleHistoryPopState: any = () => {
    window.history.back();
  };

  const closeModal = (back?: boolean) => {
    if (!back) {
      window.dispatchEvent(new PopStateEvent("popstate", handleHistoryPopState()));
    }
    window.removeEventListener("popstate", handleBackBrowserBtn);
    setIsOpen(false);
    setTimeout(() => {
      setCalendarValue(new Date())
      setCallBackC(null);
      setMaxDate(undefined);
      setMinDate(undefined);
      setHideButtons(false)
    }, 200)
  };

  useImperativeHandle(ref, () => ({
    openModal,
    closeModal,
  }));

  return (
    <Transition.Root show={isOpen} as={React.Fragment}>
      <Dialog as="div" className="relative z-[1000] selection:select-none" onClose={() => closeModal()}>
        <Transition.Child as={React.Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
          <div className="fixed inset-0 bg-background6_dark bg-opacity-70 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div className="flex items-center justify-center text-center sm:p-0 h-screen">
            <Transition.Child as={React.Fragment} enter="ease-out duration-300" enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95" enterTo="opacity-100 translate-y-0 sm:scale-100" leave="ease-in duration-200" leaveFrom="opacity-100 translate-y-0 sm:scale-100" leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95">
              <Dialog.Panel className="relative transform overflow-hidden rounded-md text-left shadow-xl transition-all sm:max-w-lg 2xl:max-w-2xl modal-box p-0 bg-background4 dark:bg-background4_dark">
                <div className="bg-background dark:bg-background5_dark">
                  <div className="w-full">
                    <div className="text-center sm:text-right dark:text-text_dark">
                      <div className="font-iransans-md bg-background5 dark:bg-background5_dark text-text dark:text-text_dark">
                        <CalendarProvider locale="fa" accentColor={Globals.data.configs.colors.primary}>
                          <Calendar
                            defaultValue={calendarValue}
                            onChange={(e) => {
                              if (minDate && maxDate) {
                                if (new Date(e.value).getTime() > new Date(minDate).getTime() && new Date(e.value).getTime() < new Date(maxDate).getTime()) {
                                  setCalendarValue(new Date(e.value));
                                }
                              } else if (minDate && !maxDate) {
                                if (new Date(e.value).getTime() > new Date(minDate).getTime()) {
                                  setCalendarValue(new Date(e.value));
                                }
                              } else if (maxDate && !minDate) {
                                if (new Date(e.value).getTime() < new Date(maxDate).getTime()) {
                                  setCalendarValue(new Date(e.value));
                                }
                              } else {
                                setCalendarValue(new Date(e.value));
                              }
                            }}
                          />
                        </CalendarProvider>
                      </div>
                    </div>
                  </div>
                </div>
                {
                  hideButtons == true ? <div />
                    :
                    <div className="modal-action border-t border-[rgba(179,229,255)] py-[3px] px-2 sm:px-4 bg-[rgb(229,240,255)] flex gap-3">
                      <button
                        className={`flex-1 rounded py-3 sm:py-[0.7rem] px-6 my-2 text-xs sm:text-sm transition focus:outline-none font-['iransans-md'] text-primary border border-primary hover:opacity-75
                      `}
                        onClick={() => closeModal()}
                      >
                        {`لغو`}
                      </button>
                      <button
                        className={`flex-1 rounded py-3 sm:py-[0.7rem] px-6 my-2 border-border text-xs sm:text-sm hover:opacity-80 transition focus:outline-none font-['iransans-md'] bg-gradient-to-b from-primary_start to-primary_end text-white
                  `}
                        onClick={() => {
                          callBack.callBackCalendar(calendarValue);
                          closeModal();
                        }}
                      >
                        {`انتخاب تاریخ`}
                      </button>
                    </div>
                }
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
});

CalendarModal.displayName = "CalendarModal";
export default CalendarModal;
