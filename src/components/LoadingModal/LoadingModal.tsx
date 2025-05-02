"use client";

import { Dialog, Transition } from "@headlessui/react";
import React, { Fragment, useImperativeHandle, useState } from "react";
import { ThreeDots } from "react-loader-spinner";
import Globals from "@/utils/Globals";

const LoadingModal = React.forwardRef((_, ref) => {
  const [isOpen, setIsOpen] = useState(false);
  const [bodyText, setBodyText] = useState<string | undefined | null>(null);

  const handleBackBrowserBtn = () => {
    closeModal();
  };
  function closeModal() {
    window.removeEventListener("popstate", handleBackBrowserBtn);
    setIsOpen(false);
    setBodyText(null);
  }

  function openModal(bodyText?: string) {
    window.addEventListener("popstate", handleBackBrowserBtn);
    setIsOpen(true);
    setBodyText(bodyText ? bodyText : null);
  }

  useImperativeHandle(ref, () => ({
    openModal,
    closeModal,
  }));

  return (
    <div className="w-full pointer-events-none">
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-[1000]" onClose={() => {}}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-background6_dark bg-opacity-70 transition-opacity" />
          </Transition.Child>

          <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
            <div className="flex items-center justify-center text-center sm:p-0 !h-[100dvh]">
              <Transition.Child
                as={React.Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                enterTo="opacity-100 translate-y-0 sm:scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              >
                <Dialog.Panel className="h-fit py-10 relative transform overflow-hidden rounded-md text-left shadow-xl transition-all w-full mx-4 sm:max-w-xs 2xl:max-w-md modal-box p-0 bg-background3 dark:bg-background3_dark">
                  {isOpen == true && (
                    <div className="flex flex-col items-center justify-center gap-3">
                      <ThreeDots
                        visible={true}
                        height="30"
                        width="70"
                        color={Globals.data.configs.colors.primary_start}
                        radius="9"
                        ariaLabel="three-dots-loading"
                        wrapperStyle={{}}
                        wrapperClass="py-1 flex justify-center"
                      />
                      {bodyText && <p className="font-['iransans-md'] text-sm">{bodyText}</p>}
                    </div>
                  )}
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
});

LoadingModal.displayName = "LoadingModal";
export default React.memo(LoadingModal);
