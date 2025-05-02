import React, { PureComponent } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { ModalInputInterface } from "@/interfaces/ModalInterface";
import Input from "../Input";
import TextAreaInput from "../TextAreaInput";

class ModalInput extends PureComponent {
  state = {
    isOpen: false,
    inputValue: "",
    title: null,
    description: null,
    type: "text-input",
    buttons: [],
    keyboardType: null,
    placeholder: "",
    multiLine: false,
    maxLength: undefined,
    error: null,
    textAreaRows: 3,
    textAreaValue: "",
  };

  constructor(props: any) {
    super(props);
    this.setInputValue = this.setInputValue.bind(this);
  }
  handleBackBrowserBtn = () => {
    const back = true;
    this.close(back);
  };
  handleHistoryPopState: any = () => {
    window.history.back();
  };

  open(options: ModalInputInterface) {
    window.history.pushState(null, "", window.location.pathname);
    window.addEventListener("popstate", this.handleBackBrowserBtn);
    this.setState({
      title: options?.title ? options.title : null,
      description: options?.description ? options.description : null,
      inputValue: options?.inputValue ? options.inputValue : "",
      type: options?.type ? options.type : "text-input",
      buttons: options.buttons,
      keyboardType: options?.options?.keyboardType || null,
      placeholder: options?.options?.placeholder || null,
      multiLine: options?.options?.multiLine || false,
      maxLength: options?.options?.maxLength || undefined,
      isOpen: true,
      textAreaRows: options?.options?.textAreaRows ? options.options.textAreaRows : 3,
    });
  }

  showError(options: string) {
    this.setState({
      error: options,
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
        inputValue: "",
        title: null,
        description: null,
        buttons: [],
        keyboardType: null,
        placeholder: null,
        multiLine: false,
        maxLength: undefined,
        error: null,
        textAreaRows: 3,
        textAreaValue: "",
      });
      clearTimeout(time);
    }, 200);
  }

  setInputValue(e: any) {
    this.setState({
      inputValue: e,
      error: null,
    });
  }

  setTextAreaValue(e: string) {
    this.setState({
      textAreaValue: e,
    });
  }

  render() {
    return (
      <Transition.Root show={this.state.isOpen} as={React.Fragment}>
        <Dialog
          autoFocus={true}
          as="div"
          className="relative z-50"
          onClose={() => this.close()}
          onTouchEnd={(e: any) => {
            e.preventDefault();
          }}
        >
          <Transition.Child
            as={React.Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-background4_dark bg-opacity-80 transition-opacity" />
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
                <Dialog.Panel
                  onTouchEnd={(e: any) => {
                    e.stopPropagation();
                  }}
                  className="relative transform overflow-hidden rounded-lg text-left transition-all sm:my-8 modal-box p-0 bg-background2 dark:bg-background2_dark min-w-[90vw] sm:min-w-96"
                >
                  <div className="px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                    <div className="flex items-center justify-center">
                      <div className="flex-1 mt-3 sm:mt-0 text-right dark:text-text_dark">
                        {this.state.title && (
                          <Dialog.Title
                            as="h3"
                            className="text-text dark:text-text_dark text-base font-['iransans-md'] leading-8"
                          >
                            {this.state.title}
                          </Dialog.Title>
                        )}
                        <div className="mt-2 flex-1">
                          <p className="text-text4 dark:text-text4_dark pb-6 text-sm font-['iransans-light'] text-justify">
                            {this.state.description}
                          </p>
                        </div>

                        <div className="flex-1">
                          {this.state.type == "text-input" ? (
                            <div>
                              <Input
                                inputStyles="!text-sm"
                                autoFocus={true}
                                value={this.state.inputValue}
                                changeState={this.setInputValue}
                                inputMode={this.state.keyboardType}
                                placeholder={this.state.placeholder}
                                maxLength={this.state.maxLength}
                                multiLine={this.state.multiLine}
                              />
                              {this.state.error && (
                                <p className="text-red_error text-sm pt-2 font-['iransans-md']">{this.state.error}</p>
                              )}
                            </div>
                          ) : (
                            <div>
                              <TextAreaInput
                                value={this.state.textAreaValue}
                                changeState={(e: any) => this.setTextAreaValue(e)}
                                autoFocus={true}
                                rows={this.state.textAreaRows}
                                maxLength={this.state.maxLength}
                                placeholder={this.state.placeholder}
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  {this.state.buttons.length > 0 && (
                    <div className="flex justify-end gap-6 px-4 sm:px-6 pt-3 pb-7">
                      {this.state.buttons.length &&
                        this.state.buttons.map(
                          (button: { onClickFn: (val: string) => {}; buttonText?: string; type: string }) => (
                            <button
                              key={button.buttonText}
                              className={`rounded border-border text-sm sm:text-base hover:opacity-80 transition text-primary font-['iransans-md']`}
                              onClick={() => {
                                if (this.state.type == "text-input") {
                                  button.onClickFn(this.state.inputValue);
                                } else {
                                  button.onClickFn(this.state.textAreaValue);
                                }
                              }}
                            >
                              {button.buttonText}
                            </button>
                          )
                        )}
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

export default ModalInput;
