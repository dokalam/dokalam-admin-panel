"use client";

import { Dialog, Transition } from "@headlessui/react";
import React, { Fragment, forwardRef, memo, useImperativeHandle, useState } from "react";
import { ImageModalInterface } from "@/interfaces/ModalInterface";
import Io5Icons from "@/utils/Icons/Io5Icons";
import Image from "next/image";

const ShowImageModal = forwardRef((_, ref) => {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState<string | null>(null);
  const [src, setSrc] = useState<string>("");

  const handleBackBrowserBtn = () => {
    const back = true;
    closeModal(back);
  };
  const handleHistoryPopState: any = () => {
    window.history.back();
  };

  function closeModal(back?: boolean) {
    if (!back) {
      window.dispatchEvent(new PopStateEvent("popstate", handleHistoryPopState()));
    }
    window.removeEventListener("popstate", handleBackBrowserBtn);
    setIsOpen(false);
    setSrc("");
    setTitle(null);
  }

  function openModal(options: ImageModalInterface) {
    window.history.pushState(null, "", window.location.pathname);
    window.addEventListener("popstate", handleBackBrowserBtn);
    setIsOpen(true);
    setTitle(options?.title ? options.title : null);
    setSrc(options.src);
  }

  useImperativeHandle(ref, () => ({
    openModal,
  }));

  return (
    <div className="w-full">
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-[1000] flex justify-center items-center h-[100dvh]"
          onClose={closeModal}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-background6_dark bg-opacity-75 transition-opacity" />
          </Transition.Child>

          <div className="flex justify-center items-center h-[100dvh] fixed inset-0 z-10 w-screen">
            <div className="absolute top-5 right-5 flex items-center gap-4 sm:gap-4">
              <div className="text-2xl z-[500] rounded-md text-[#eee] bg-[#00000070] p-1 pointer-events-none">
                <Io5Icons icon={"IoClose"} />
              </div>
              {title && (
                <p className="font-['iransans-md'] text-[#eee] bg-[#00000085] px-4 py-1 rounded">
                  {title}
                </p>
              )}
            </div>
            <Transition.Child
              as={React.Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="h-full max-h-[80dvh] relative w-full sm:max-w-lg 2xl:max-w-2xl flex justify-center items-center">
                {isOpen && (
                  <Image
                    className={`inset-0 w-fit h-fit rounded-md object-contain`}
                    src={src}
                    alt={""}
                    fill={true}
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                )}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
});

ShowImageModal.displayName = "ShowImageModal";
export default memo(ShowImageModal);
