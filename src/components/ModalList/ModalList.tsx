import React, { PureComponent } from "react";
import { Dialog, Transition } from "@headlessui/react";
import ScreenLoading from "../ScreenLoading";
import {
  ModalListResponseLoadingInterface,
  ModalLoadingListInterface,
  ModalNormalListInterface,
} from "@/interfaces/ModalInterface";
import Io5Icons from "@/utils/Icons/Io5Icons";
import CheckBox from "../CheckBox";
import { HiOutlineChevronLeft } from "react-icons/hi";
import { ThreeDots } from "react-loader-spinner";
import Globals from "@/utils/Globals";
import { IoArrowForwardOutline } from "react-icons/io5";
import ImageComponent from "../ImageComponent";

class ModalList extends PureComponent {
  constructor(props: any) {
    super(props);
    this.tryAgainOperation = this.tryAgainOperation.bind(this);
    this.tryAgain = this.tryAgain.bind(this);
  }
  state: any = {
    page: 0,
    bodyLoading: [false],
    bodyGetError: [false],
    bodyNoItem: [false],
    ////////////////////////////////////////
    title: [null],
    description: [null],
    list: [[]],
    type: [""],
    buttons: [[]],
    isOpen: false,
    previousData: [[]],
    dark: false,
    selected: [null],
    buttonLoading0: false,
    buttonLoading1: false,
    replaceImage: null,
    fitHeight: [false],
  };

  tryAgainOperation() {}

  handleBackBrowserBtn = () => {
    const back = true;
    this.close(back);
  };
  handleHistoryPopState: any = () => {
    window.history.back();
  };

  openNormal(options: ModalNormalListInterface) {
    if (!options?.options?.page || options?.options?.page == 0) {
      window.history.pushState(null, "", window.location.pathname);
      window.addEventListener("popstate", this.handleBackBrowserBtn);
    }
    const paginate = options?.options?.page ? options.options.page : this.state.page;
    const val1: any = [...this.state.title];
    val1[paginate] = options.title;
    const val2: any = [...this.state.description];
    val2[paginate] = options.description;
    const val3: any = [...this.state.buttons];
    val3[paginate] = options.buttons ? options.buttons : [];
    const val4: any = [...this.state.list];
    val4[paginate] = options.list ? options.list : [];
    const val5: any = [...this.state.type];
    val5[paginate] = options?.options?.type ? options.options.type : "";
    const val6: any = [...this.state.selected];
    val6[paginate] = options?.options?.selected ? options.options.selected : null;
    let dark = typeof window !== "undefined" && localStorage.getItem("theme") == "dark" ? true : false;
    const val8: any = [...this.state.fitHeight];
    val8[paginate] = options?.options?.fitHeight ? options?.options?.fitHeight : false;
    this.setState({
      title: val1,
      description: val2,
      buttons: val3,
      isOpen: true,
      list: val4,
      type: val5,
      selected: val6,
      page: paginate,
      dark: dark,
      replaceImage: options?.options?.replaceImage ? options?.options?.replaceImage : null,
      fitHeight: val8,
    });
    if (options?.options?.type == "check_box") {
      let previous = [];
      for (let i = 0; i < options.list.length; i++) {
        const element = options.list[i];
        if (element.checked == true) {
          const element2 = {
            _id: options.list[i]._id,
            name: options.list[i].name,
          };
          previous.push(element2);
        }
      }
      const val7: any = [...this.state.previousData];
      val7[paginate] = previous;
      this.setState({
        previousData: val7,
      });
    }
  }

  openLoading(options: ModalLoadingListInterface) {
    if (!options?.options?.page || options?.options?.page == 0) {
      window.history.pushState(null, "", window.location.pathname);
      window.addEventListener("popstate", this.handleBackBrowserBtn);
    }
    const paginate = options?.options?.page ? options.options.page : this.state.page;
    const val1: any = [...this.state.title];
    val1[paginate] = options.title;
    const val2: any = [...this.state.description];
    val2[paginate] = options.description;
    const val3: any = [...this.state.buttons];
    val3[paginate] = options.buttons ? options.buttons : [];
    const val4: any = [...this.state.bodyLoading];
    val4[paginate] = true;
    const val5: any = [...this.state.bodyGetError];
    val5[paginate] = false;
    const val6: any = [...this.state.bodyNoItem];
    val6[paginate] = false;
    const val7: any = [...this.state.type];
    val7[paginate] = options?.options?.type ? options.options.type : "";
    let dark = typeof window !== "undefined" && localStorage.getItem("theme") == "dark" ? true : false;
    this.setState({
      title: val1,
      description: val2,
      buttons: val3,
      isOpen: true,
      bodyLoading: val4,
      bodyGetError: val5,
      bodyNoItem: val6,
      type: val7,
      page: paginate,
      dark: dark,
      replaceImage: options?.options?.replaceImage ? options?.options?.replaceImage : null,
    });
  }

  setResponseLoading(options: ModalListResponseLoadingInterface) {
    const paginate = this.state.page;
    const val1: any = [...this.state.bodyLoading];
    val1[paginate] = options.loading ? options.loading : false;
    const val2: any = [...this.state.bodyGetError];
    val2[paginate] = options.error ? options.error : false;
    const val3: any = [...this.state.bodyNoItem];
    val3[paginate] = options.noItem ? options.noItem : false;
    const val4: any = [...this.state.list];
    val4[paginate] = options?.list ? options.list : [];
    const val5: any = [...this.state.selected];
    val5[paginate] = options?.options?.selected ? options.options.selected : null;
    this.setState({
      bodyLoading: val1,
      bodyGetError: val2,
      bodyNoItem: val3,
      list: val4,
      selected: val5,
    });
    if (options?.buttons) {
      const val6: any = [...this.state.buttons];
      val6[paginate] = options?.buttons ? options.buttons : [...this.state.buttons];
      this.setState({
        buttons: val6,
      });
    }
    if (options?.tryAgain) {
      this.tryAgainOperation = options.tryAgain;
    }
    if (this.state.type[paginate] == "check_box") {
      let previous = [];
      for (let i = 0; i < options.list.length; i++) {
        const element = options.list[i];
        if (element.checked == true) {
          const element2 = {
            _id: options.list[i]._id,
            name: options.list[i].name,
          };
          previous.push(element2);
        }
      }
      const val6: any = [...this.state.previousData];
      val6[paginate] = previous;
      this.setState({
        previousData: val6,
      });
    }
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
        page: 0,
        bodyLoading: [false],
        bodyGetError: [false],
        bodyNoItem: [false],
        title: [""],
        description: [null],
        list: [[]],
        type: [""],
        buttons: [[]],
        previousData: [[]],
        selected: [null],
        buttonLoading0: false,
        buttonLoading1: false,
      });
      clearTimeout(time);
    }, 200);
  }

  tryAgain() {
    const paginate = this.state.page;
    const val1: any = [...this.state.bodyLoading];
    val1[paginate] = true;
    const val2: any = [...this.state.bodyGetError];
    val2[paginate] = false;
    const val3: any = [...this.state.bodyNoItem];
    val3[paginate] = false;
    this.setState({
      bodyLoading: val1,
      bodyGetError: val2,
      bodyNoItem: val3,
    });
    this.tryAgainOperation();
  }

  clickItemCheckBox({ item, index }: { item: any; index: number }) {
    const paginate = this.state.page;
    if (item.checked == true) {
      let x = this.state.previousData[paginate].findIndex((i: any) => i._id == item._id);
      this.state.previousData[paginate].splice(x, 1);
      const newData: any = [...this.state.list];
      newData[paginate][index].checked = false;
      this.setState({
        list: newData,
        previousData: [...this.state.previousData],
      });
      if (item?.onClick2) item?.onClick2();
    } else {
      const newData: any = [...this.state.list];
      newData[paginate][index].checked = true;
      this.state.previousData[paginate].push({ _id: item._id, name: item.name });
      this.setState({
        list: newData,
        previousData: [...this.state.previousData],
      });
      if (item?.onClick1) item?.onClick1();
    }
  }

  clickItemRadioButton({ item, index }: { item: any; index: number }) {
    const paginate = this.state.page;
    const newData: any = [...this.state.selected];
    newData[paginate] = index + 1;
    this.setState({
      selected: newData,
    });
    if (item?.onClick1) item?.onClick1({ selected: newData[paginate] });
  }

  closeSelectedFilter({ item, index }: { item: any; index: number }) {
    const paginate = this.state.page;
    let x = this.state.list[paginate].findIndex((i: any) => i._id == item._id);
    let newData: any = { ...this.state.list };
    newData[paginate][x].checked = false;
    this.state.previousData[paginate].splice(index, 1);
    this.setState({
      previousData: [...this.state.previousData],
      list: [...this.state.list],
    });
  }

  renderCheckBoxType({ item, index }: { item: any; index: number }) {
    return (
      <div
        key={`${item.name}${index}`}
        className="flex pl-4 px-2 sm:px-4 items-center font-['iransans-md'] dark:font-['iransans-light'] hover:sm:dark:bg-background6_dark hover:sm:bg-background6 transition rounded cursor-pointer"
      >
        {item?.image ? (
          <div className="w-8 h-8">
            <ImageComponent alt="" src={item.image} imageClasses="rounded-md" parentclasses="!h-full !w-full" />
          </div>
        ) : item?.icon ? (
          <div className="flex items-center justify-center w-8 h-8 text-2xl">{item?.icon && item.icon}</div>
        ) : this?.state?.replaceImage ? (
          <div className="w-8 h-8 rounded-md flex justify-center items-center text-2xl text-text4 dark:text-text4_dark">
            {this.state.replaceImage}
          </div>
        ) : (
          ""
        )}

        <label
          className={`flex-1 text-right cursor-pointer pr-2 text-[.8rem] flex flex-col ${
            item?.name2 ? "justify-between py-3" : "justify-center items-start py-5"
          } `}
          htmlFor={`${item.name}${index}`}
        >
          <div className="text-text dark:text-text_dark">{item.name}</div>
          <div className="text-[.75rem] text-text5 dark:text-text5_dark">{item?.name2}</div>
        </label>

        <CheckBox
          checked={item.checked}
          id={`${item.name}${index}`}
          onChange={() => {
            this.clickItemCheckBox({ item: item, index: index });
          }}
        />
      </div>
    );
  }

  renderRadioButtonType({ item, index }: { item: any; index: number }) {
    return (
      <div
        key={`${item.name}${index}`}
        className="flex pl-4 px-2 sm:px-4 items-center font-['iransans-md'] dark:font-['iransans-light'] hover:sm:dark:bg-background6_dark hover:sm:bg-background6 transition rounded cursor-pointer"
      >
        {item?.image ? (
          <div className="w-8 h-8">
            <ImageComponent alt="" src={item.image} imageClasses="rounded-md" parentclasses="!h-full !w-full" />
          </div>
        ) : item?.icon ? (
          <div className="w-8 h-8 flex items-center justify-center text-2xl">{item?.icon && item.icon}</div>
        ) : (
          ""
        )}

        <label
          className="flex-1 text-right text-text6 dark:text-text6_dark text-[.85rem] sm:text-[.95rem] cursor-pointer py-3 pr-2"
          htmlFor={`${item.name}${index}`}
        >
          {item.name}
        </label>
        <div
          className="relative w-5 h-5 flex justify-center items-center border-2 border-primary rounded-full"
          onClick={() => this.clickItemRadioButton({ item: item, index: index })}
        >
          <input
            type="radio"
            checked={index + 1 == this.state.selected[this.state.page] ? true : false}
            id={`${item.name}${index}`}
            onChange={() => {}}
            className={`radio-button-input focus:outline-none hidden`}
          />
          <span className="radio-button absolute h-2 w-2 rounded-full bg-primary"></span>
        </div>
      </div>
    );
  }

  renderArrowType({ item, index }: { item: any; index: number }) {
    return (
      <div
        key={`${item.name}${index}`}
        className={`${
          item?.style
        } flex pl-4 px-2 sm:px-4 items-center font-['iransans-md'] dark:font-['iransans-light'] rounded  ${
          (item?.disable == false || item?.disable == undefined) &&
          "hover:dark:bg-background6_dark hover:bg-background6 cursor-pointer transition"
        }`}
        onClick={() => {
          if (item?.arrow == true) {
            item?.onClick1();
          } else {
            item?.onClick1();
            this.close();
          }
        }}
      >
        {item?.icon && item.icon}
        <label
          className={`${
            item?.disable == true ? "text-text5 dark:text-text5_dark" : "text-text dark:text-text_dark"
          } flex-1 text-right text-[.85rem] sm:text-[.95rem] cursor-pointer py-3 pr-2 overflow-clip`}
          htmlFor={`${item.name}${index}`}
        >
          {item.name}
        </label>
        {item.arrow && !item.disable && (
          <div className="text-text6 dark:text-text6_dark">
            <HiOutlineChevronLeft />
          </div>
        )}
      </div>
    );
  }

  renderCenterType({ item, index }: { item: any; index: number }) {
    return (
      <div
        key={`${item.name}${index}`}
        className="flex pl-4 px-2 sm:px-4 items-center font-['iransans-md'] dark:font-['iransans-light'] hover:dark:bg-background6_dark hover:bg-background6 transition rounded cursor-pointer"
        onClick={() => {
          item.onClick1();
          this.close();
        }}
      >
        {item?.icon && item.icon}
        <label
          className="flex-1 text-center text-text6 dark:text-text6_dark text-[.85rem] sm:text-[.95rem] cursor-pointer py-3 pr-2"
          htmlFor={`${item.name}${index}`}
        >
          {item.name}
        </label>
      </div>
    );
  }

  scrollHorizontal = (e: any) => {
    const activeFiltersWrapper = document.getElementById("prevData-wrapper");
    activeFiltersWrapper?.scrollBy({
      left: e.deltaY < 0 ? 200 : -200,
      behavior: "smooth",
    });
  };

  goBack = () => {
    this.setState({
      page: this.state.page - 1,
    });
    const time = setTimeout(() => {
      this.state.bodyLoading.pop();
      this.state.bodyGetError.pop();
      this.state.bodyNoItem.pop();
      this.state.title.pop();
      this.state.description.pop();
      this.state.list.pop();
      this.state.type.pop();
      this.state.buttons.pop();
      this.state.previousData.pop();
      this.state.selected.pop();
      this.setState({
        bodyLoading: [...this.state.bodyLoading],
        bodyGetError: [...this.state.bodyGetError],
        bodyNoItem: [...this.state.bodyNoItem],
        title: [...this.state.title],
        description: [...this.state.description],
        list: [...this.state.list],
        type: [...this.state.type],
        buttons: [...this.state.buttons],
        previousData: [...this.state.previousData],
        selected: [...this.state.selected],
      });
      clearTimeout(time);
    }, 200);
  };

  render() {
    return (
      <Transition.Root show={this.state.isOpen} as={React.Fragment}>
        <Dialog as="div" className="relative z-[1000] selection:select-none" onClose={() => this.close()}>
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
            <div className="flex items-center justify-center text-center sm:p-0 h-screen">
              <Transition.Child
                as={React.Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                enterTo="opacity-100 translate-y-0 sm:scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              >
                <Dialog.Panel className="relative transform overflow-hidden rounded-md text-left shadow-xl transition-all w-[90%] sm:w-full sm:max-w-lg 2xl:max-w-2xl modal-box p-0 bg-background4 dark:bg-background4_dark">
                  <div className="bg-background dark:bg-background5_dark">
                    <div className="w-full">
                      <div className="text-center sm:text-right dark:text-text_dark">
                        <div>
                          {(this.state.title[this.state.page] ||
                            this.state.description[this.state.page] ||
                            this.state.previousData[this.state.page].length > 0) && (
                            <Dialog.Title
                              as="h3"
                              className={`bg-background2 pt-5 dark:bg-background2_dark font-['iransans-md'] w-full ${
                                this.state.type[this.state.page] == "center" ? "text-center" : "text-right"
                              }   border-b border-border2 dark:border-border2_dark pb-2 sm:pb-4 text-lg dark:text-text2_dark text-text2`}
                            >
                              <div
                                className={`${
                                  this.state.type[this.state.page] == "center" ? "justify-center" : "justify-normal"
                                } w-full px-4 sm:px-6 flex items-center`}
                              >
                                {this.state.page > 0 && (
                                  <div
                                    onClick={this.goBack}
                                    className="ml-2 -mr-2 text-xl text-text6 dark:text-text6_dark hover:sm:bg-background6 dark:sm:hover:bg-background6_dark rounded-full p-1 transition cursor-pointer"
                                  >
                                    <IoArrowForwardOutline />
                                  </div>
                                )}
                                <div className={` text-text6 dark:text-text6_dark text-[.9rem] sm:text-[.95rem]`}>
                                  {this.state.title[this.state.page]}
                                </div>
                              </div>
                              {this.state.description[this.state.page] && (
                                <div className="mt-2 px-4 sm:px-6">
                                  <p
                                    className={`${
                                      this.state.type[this.state.page] == "center" ? "text-center" : "text-justify"
                                    } text-text6 dark:text-text6_dark text-[.8rem] font-['iransans-light'] leading-4`}
                                  >
                                    {this.state.description[this.state.page]}
                                  </p>
                                </div>
                              )}
                              {this.state.previousData[this.state.page]?.length > 0 && (
                                <div
                                  id="prevData-wrapper"
                                  onWheel={this.scrollHorizontal}
                                  className="flex font-['iransans-md'] text-xs gap-3 mt-2 overflow-x-auto no-scrollbar px-2"
                                >
                                  {this.state.previousData[this.state.page].map((item: any, index: number) => (
                                    <div
                                      className="flex border items-center gap-2 select-none border-primary py-[.3rem] px-2 rounded-md text-primary shrink-0 bg-rgba4 dark:bg-rgba3"
                                      key={`${item.name}${index}`}
                                    >
                                      {item.name}
                                      <div
                                        className="text-lg cursor-pointer rounded-md text-primary bg-background dark:bg-background_dark hover:bg-border dark:hover:bg-border_dark transition border border-primary"
                                        onClick={() => this.closeSelectedFilter({ item: item, index: index })}
                                      >
                                        <Io5Icons icon={"IoClose"} />
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </Dialog.Title>
                          )}

                          {this.state.bodyLoading[this.state.page] ? (
                            <div className="flex justify-center items-center min-h-[40vh]">
                              <ScreenLoading
                                getError={this.state.bodyGetError[this.state.page]}
                                notItem={this.state.bodyNoItem[this.state.page]}
                                tryAgain={this.tryAgain}
                              />
                            </div>
                          ) : (
                            <div
                              className={
                                this.state.dark == true
                                  ? `overflow-y-auto ${
                                      this.state.fitHeight[this.state.page] == true ? "h-fit" : "min-h-[40vh]"
                                    }  ${
                                      this.state.buttons[this.state.page].length == 0 ? "max-h-[80vh]" : " max-h-[55vh]"
                                    }`
                                  : `overflow-y-auto ${
                                      this.state.fitHeight[this.state.page] == true ? "h-fit" : "min-h-[40vh]"
                                    } ${
                                      this.state.buttons[this.state.page].length == 0 ? "max-h-[80vh]" : " max-h-[55vh]"
                                    } custom-scrollbar`
                              }
                            >
                              {this.state.list[this.state.page]?.map((item: any, index: number) =>
                                this.state.type[this.state.page] == "check_box"
                                  ? this.renderCheckBoxType({ item, index })
                                  : this.state.type[this.state.page] == "radio_button"
                                  ? this.renderRadioButtonType({ item, index })
                                  : this.state.type[this.state.page] == "arrow"
                                  ? this.renderArrowType({ item, index })
                                  : this.state.type[this.state.page] == "center"
                                  ? this.renderCenterType({ item, index })
                                  : ""
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  {this.state.buttons[this.state.page].length > 0 && (
                    <div className="modal-action border-t border-border2 dark:border-border2_dark py-1 px-2 sm:px-4 bg-background2 dark:bg-background2_dark flex gap-3">
                      {this.state.buttons[this.state.page].length &&
                        this.state.buttons[this.state.page].map((button: any, index: number) => (
                          <button
                            key={button.buttonText}
                            className={`flex-1 rounded py-2 sm:py-[0.7rem] h-[34px] sm:h-[45px] px-6 my-2 border-border text-xs sm:text-sm hover:opacity-80 transition text-primary_start focus:outline-none font-['iransans-md']
                  ${
                    button.type == "bold"
                      ? "bg-gradient-to-b from-primary_start to-primary_end text-white"
                      : button.type == "border"
                      ? "text-text dark:text-text_dark border border-border dark:border-border_dark bg-background dark:bg-background_dark hover:bg-background6 dark:hover:bg-background6_dark"
                      : "bg-gradient-to-b from-primary_start to-primary_end text-white"
                  }`}
                            onClick={() => {
                              if (this.state.type[this.state.page] == "check_box") {
                                button.onClickFn(this.state.previousData[this.state.page]);
                              } else if (this.state.type[this.state.page] == "radio_button") {
                                button.onClickFn(this.state.selected[this.state.page]);
                              } else {
                                button.onClickFn;
                              }

                              if (button?.loading == true) {
                                if (index == 0) {
                                  this.setState({ buttonLoading0: true });
                                } else if (index == 1) {
                                  this.setState({ buttonLoading1: true });
                                }
                              } else {
                                if (
                                  this.state.type[this.state.page] == "check_box" &&
                                  this.state.previousData[this.state.page].length == 0 &&
                                  index == 1
                                ) {
                                  null;
                                } else {
                                  this.close();
                                }
                              }
                            }}
                          >
                            {(index == 0 && this.state.buttonLoading0 == true) ||
                            (index == 1 && this.state.buttonLoading1 == true) ? (
                              <ThreeDots
                                visible={true}
                                height={"10"}
                                width="45"
                                color={`${button.type == "border" ? Globals.data.configs.colors.primary_start : "white"}`}
                                radius="9"
                                ariaLabel="three-dots-loading"
                                wrapperStyle={{}}
                                wrapperClass={`py-1 flex justify-center`}
                              />
                            ) : (
                              button.buttonText
                            )}
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

export default ModalList;
