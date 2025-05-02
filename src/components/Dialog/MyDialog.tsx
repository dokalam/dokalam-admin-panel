import React, { PureComponent } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { DialogInterface } from "@/interfaces/ModalInterface";
import { IoAlertCircleOutline, IoCheckmarkCircleOutline, IoWarningOutline } from "react-icons/io5";
import { BsQuestionCircle } from "react-icons/bs";

class MyDialog extends PureComponent {
  state = {
    titleText: "",
    bodyText: "",
    closeButtonText: "لغو",
    showCloseButton: true,
    buttons: [],
    isOpen: false,
    dialogType: "",
    textBodyJustify: false,
    boldBtnClasses: "",
    borderBtnClasses: "",
  };

  constructor(props: any) {
    super(props);
  }

  handleBackBrowserBtn = () => {
    const back = true;
    this.close(back);
  };
  handleHistoryPopState: any = () => {
    window.history.back();
  };

  open(options: DialogInterface) {
    window.history.pushState(null, "", window.location.pathname);
    window.addEventListener("popstate", this.handleBackBrowserBtn);
    this.setState({
      titleText: options.titleText,
      bodyText: options.bodyText,
      closeTextButton: options.closeTextButton ? options.closeTextButton : "لغو",
      showCloseButton: options.showCloseButton ? options.showCloseButton : true,
      buttons: options.buttons ? options.buttons : [],
      isOpen: true,
      dialogType: options?.dialogType ? options.dialogType : "",
      textBodyJustify: options?.textBodyJustify == true ? true : false,
    });
  }

  close(back?: boolean) {
    if (!back) {
      window.dispatchEvent(new PopStateEvent("popstate", this.handleHistoryPopState()));
    }
    window.removeEventListener("popstate", this.handleBackBrowserBtn);
    this.setState({
      isOpen: false,
    });
    const time = setTimeout(() => {
      this.setState({
        titleText: "",
        bodyText: "",
        closeButtonText: "لغو",
        showCloseButton: true,
        buttons: [],
        dialogType: "",
      });
      clearTimeout(time);
    }, 50);
  }

  render() {
    return (
      <Transition.Root show={this.state.isOpen} as={React.Fragment}>
        <Dialog as="div" className="relative z-[2000]" onClose={() => this.close()}>
          <Transition.Child
            as={React.Fragment}
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
            <div className="flex min-h-full items-center justify-center p-4 text-center sm:items-center sm:p-0">
              <Transition.Child
                as={React.Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                enterTo="opacity-100 translate-y-0 sm:scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              >
                <Dialog.Panel className="relative transform overflow-hidden rounded-lg text-left shadow-xl transition-all sm:my-8 w-[85dvh] sm:w-full sm:max-w-lg modal-box p-0 bg-background4 dark:bg-background4_dark">
                  <div className="bg-background dark:bg-background5_dark px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                    {this.state.dialogType && (
                      <div
                        className={`${
                          this.state.dialogType == "warning"
                            ? "text-warn_end"
                            : this.state.dialogType == "error"
                            ? "text-red_error"
                            : this.state.dialogType == "success"
                            ? "text-green_color"
                            : "text-primary"
                        } flex justify-center text-8xl`}
                      >
                        {this.state.dialogType == "warning" ? (
                          <IoWarningOutline />
                        ) : this.state.dialogType == "error" ? (
                          <IoAlertCircleOutline />
                        ) : this.state.dialogType == "success" ? (
                          <IoCheckmarkCircleOutline />
                        ) : this.state.dialogType == "question" ? (
                          <BsQuestionCircle />
                        ) : (
                          ""
                        )}
                      </div>
                    )}
                    <div className="sm:flex sm:items-center w-full">
                      <div className="mt-3 text-center sm:mt-0 sm:text-right dark:text-text_dark w-full">
                        {this.state.titleText && (
                          <Dialog.Title
                            as="h3"
                            className="text-text dark:text-text_dark sm:text-lg text-sm font-['iransans-md'] px-2 leading-8 text-center"
                          >
                            {this.state.titleText}
                          </Dialog.Title>
                        )}
                        <div className="mt-2">
                          <p
                            className={`${
                              this.state.textBodyJustify == true ? "text-justify" : "text-center"
                            } text-text6 dark:text-text6_dark pb-6 pt-4 sm:text-lg text-sm font-['iransans-md'] sm:leading-8 whitespace-pre-wrap`}
                          >
                            {this.state.bodyText}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* footer modal */}
                  {this.state.buttons.length > 0 && (
                    <div className="modal-action border-t border-border2 dark:border-border2_dark py-1 px-4 sm:px-6 bg-background2 dark:bg-background2_dark flex gap-3">
                      {this.state.buttons.length &&
                        this.state.buttons.map((button: any) => (
                          <button
                            key={button.buttonText}
                            className={`flex-1 rounded py-2 sm:py-[0.7rem] h-[34px] sm:h-[45px] px-6 my-2 border-border text-xs sm:text-sm hover:opacity-80 transition text-primary_start focus:outline-none  font-['iransans-md']
                  ${
                    button.type == "bold"
                      ? `${button.boldBtnClasses} bg-gradient-to-b from-primary_start to-primary_end text-white`
                      : button.type == "border"
                      ? `${button.borderBtnClasses} text-text dark:text-text_dark border border-border dark:border-border_dark bg-background dark:bg-background_dark hover:bg-background6 dark:hover:bg-background6_dark`
                      : "bg-gradient-to-b from-primary_start to-primary_end text-white"
                  }`}
                            onClick={async () => {
                              this.close();
                              const time = setTimeout(() => {
                                if (button?.onClickFn) button.onClickFn();
                                clearTimeout(time);
                              }, 50);
                            }}
                          >
                            {button.buttonText}
                          </button>
                        ))}
                    </div>
                  )}
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
    );
  }
}

export default MyDialog;
