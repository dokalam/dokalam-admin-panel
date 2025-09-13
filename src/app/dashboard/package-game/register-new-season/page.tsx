"use client";

import React, { useRef, useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { FaCamera, FaMusic, FaPlay, FaRegSquarePlus, FaVideo } from "react-icons/fa6";
import DialogHelper from "@/components/Dialog/DialogHelper";
import { BiEditAlt, BiTrash } from "react-icons/bi";
import { IoIosVideocam } from "react-icons/io";
import { secondsToTime } from "@/utils/SecondToTime";
import ImageComponent from "@/components/ImageComponent";
import ShowVideoModalHelper from "@/components/ShowMediaModal/ShowVideoModalHelper";
import ShowImageModalHelper from "@/components/ShowMediaModal/ShowImageModalHelper";
import ModalInputHelper from "@/components/ModalInput/ModalInputHelper";
import ShowVideoModal from "@/components/ShowMediaModal/ShowVideoModal";
import ShowImageModal from "@/components/ShowMediaModal/ShowImageModal";
import ModalInput from "@/components/ModalInput/ModalInput";
import Input from "@/components/Input";
import TextAreaInput from "@/components/TextAreaInput";
import { priceDigitSeperator } from "@/utils/PriceDigitSeparator";
import { numberToWords } from "@persian-tools/persian-tools";
import { MdDelete } from "react-icons/md";
import { IoClose } from "react-icons/io5";
import Footer from "@/components/Footer/Footer";
import Border from "@/components/Border";
import { Switch, Listbox, Transition } from "@headlessui/react";
import SelectInput from "@/components/SelectInput";
import GradientButton from "@/components/GradientButton";
import PackageListHelper from "@/components/PackageList/PackageListHelper";
import PackageList from "@/components/PackageList/PackageList";


type SelectedOption = {
  value: any;
  label: string;
};
const PublicationStatus:SelectedOption[] = [
  {value:null, label:"انتخاب وضعیت انتشار محتوا"},
  {value:"draft", label:"پیشنویس"},
  {value:"ready", label:"آماده انتشار"},
  {value:"published", label:"منتشر شده"},
  {value:"archived", label:"آرشیو شده، غیرفعال"},
  {value:"rejected", label:"رد شده"},
]
const CompletionStatus:SelectedOption[] = [
  {value:null, label:"انتخاب وضعیت کامل بودن محتوا"},
  {value:"incomplete", label:"ناقص (نیاز به بخش‌هایی بیشتر)"},
  {value:"in_progress", label:"در حال کار و بازبینی"},
  {value:"complete", label:"کامل‌شده ولی قابل به‌روزرسانی"},
  {value:"finalized", label:"نهایی‌شده، بدون نیاز به تغییر"},
]
type ContentSourceType = {
  selected: string | null;
  list:SelectedOption[]
}
type PackageSelectedInfo = {
  _id: string;
  title: string;
  image: string;
}
const Page = () => {
  const inputImageRef: any = useRef();
  const inputVideoRef: any = useRef();
  const inputMusicRef: any = useRef();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [visible, setVisible] = useState(false);
  const [active, setActive] = useState(false);
  const [badg, setBadg] = useState("");
  const [language, setLanguage] = useState<string | null>(null)
  const [languageList, setLanguageList] = useState([])
  const [loading, setLoading] = useState(false);
  const [seasonNumber, setSeasonNumber] = useState("")
  const [stageNumberFrom, setStageNumberFrom] = useState("")
  const [stageNumberTo, setStageNumberTo] = useState("")
  const [numberStage, setNumberStage] = useState("")
  const [contentSourceType, setContentSourceType] = useState<ContentSourceType>({
    selected: null,
    list: [{value:null, label:"انتخاب نوع محتوا"}, {value:"original", label:"محتوا اختصاصی و اورجینال"}, {value:"derived", label:"محتوا مشتق شده از منبع دیگر"}, {value:"copy", label:"محتوا کپی از منبع دیگر"}]
  })
  const [publicationStatus, setPublicationStatus] = useState<string | null>(null)
  const [completionStatus, setCompletionStatus] = useState<string | null>(null)
  const [image, setImage] = useState<any>([]);
  const [video, setVideo] = useState<any>([]);
  const media = video.concat(image);
  const [music, setMusic] = useState<any>(null)
  const [packageSelected, setPackageSelected] = useState<PackageSelectedInfo | null>(null)
  

  useEffect(()=>{
    getAllLanguage()
  }, [])
  const getAllLanguage = async()=>{
    const data = {
      query: `
        query getAllLanguageForAdmin($filter_visible : Boolean, $filter_active : Boolean){
          getAllLanguageForAdmin(filter_visible : $filter_visible, filter_active : $filter_active) {
            _id,
            name,
          }
        }
        `,
      variables: {
        filter_visible: false,
        filter_active: false,
      },
    };
    await axios({
      url: "/",
      method: "post",
      data: data,
    }).then(async (response) => {
        const data = response.data.data.getAllLanguageForAdmin;
        if (data.length > 0) {
          const items = data.map((item: any) => ({
            label: item.name,
            value: item._id,
          }));
          items.unshift({
            label: "انتخاب زبان",
            value: null,
          })
          setLanguageList(items);
        }
      })
      .catch(() => {
        setLanguageList([])
      });
  }
  const registerAndConfirm = ()=>{
    if(title.length == 0 || !language || numberStage.length == 0 || contentSourceType.selected == null || !publicationStatus || !completionStatus ){
      toast.error("ابتدا موارد الزامی را وارد کنید", {
        position: "top-center",
        autoClose: 4000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: typeof window !== "undefined" && localStorage.getItem("theme") == "dark" ? "dark" : "light",
      });
    } else if(media.length == 0){
      toast.error("برای تعریف فصل جدید، حداقل یک عکس یا فیلم لازم است.", {
        position: "top-center",
        autoClose: 4000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: typeof window !== "undefined" && localStorage.getItem("theme") == "dark" ? "dark" : "light",
      });
    } else if(!packageSelected){
      toast.error("مشخص کنید این فصل را برای کدام پکیج ایجاد میکنید.", {
        position: "top-center",
        autoClose: 4000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: typeof window !== "undefined" && localStorage.getItem("theme") == "dark" ? "dark" : "light",
      });
    } else {
      checkedAndRegister()
    }
  }
  const checkedAndRegister = async()=>{
    setLoading(true)
    let data = {
      query: `
          mutation newSeasonDefinitionForPackageGame(
              $package : ID!,
              $title : String!,
              $description : String,
              $language_ref : ID!,
              $media : [FileInput!]!,
              $music : FileInput,
              $badg : String,
              $season_number : Int!,
              $stage_number_from : Int!,
              $stage_number_to : Int!,
              $number_stage : Int!,
              $is_visible : Boolean!,
              $is_active : Boolean!,
              $content_source_type : String!,
              $publication_status : String!,
              $completion_status : String!,
          ){
            newSeasonDefinitionForPackageGame(
                package : $package,
                title : $title,
                description : $description,
                language_ref : $language_ref,
                media : $media,
                music : $music,
                badg : $badg,
                season_number : $season_number,
                stage_number_from : $stage_number_from,
                stage_number_to : $stage_number_to,
                number_stage : $number_stage,
                is_visible : $is_visible,
                is_active : $is_active,
                content_source_type : $content_source_type,
                publication_status : $publication_status,
                completion_status : $completion_status,
            ) {
              status,
              message,
            }
          }
          `,
      variables: {
        package:packageSelected?._id,
        title: title,
        description: description?.length > 2?description:undefined,
        language_ref: language,
        media: media.map((item:any, index:number) => ({
          file: null,
          order: (index+1),
          duration: item.duration??undefined,
        })),
        music : (music?.file && music?.duration) ? { file: null, duration: music.duration } : undefined,
        badg: badg?.length > 0?badg:undefined,
        season_number : Number(seasonNumber),
        stage_number_from : Number(stageNumberFrom),
        stage_number_to : Number(stageNumberTo),
        number_stage: Number(numberStage),
        is_visible: visible,
        is_active: active,
        content_source_type: contentSourceType.selected,
        publication_status: publicationStatus,
        completion_status: completionStatus
      },
    };
    let map: any = {};
    let fileIndex = 0;
    media.forEach((item: any, index: number) => {
      map[fileIndex] = [`variables.media.${index}.file`];
      fileIndex++;
    });
    if (music?.file && music?.duration) {
      map[fileIndex] = [`variables.music.file`];
    }
    let formD = new FormData();
    formD.append("operations", JSON.stringify(data));
    formD.append("map", JSON.stringify(map));
    media.forEach((item: any, index: number) => {
      formD.append(`${index}`, item.file);
    });
    if (music?.file && music?.duration) {
      formD.append(`${fileIndex}`, music.file);
    }
    await axios({
      url: "/",
      method: "post",
      data: formD,
      headers: {
        Accept: "*/*",
        "Content-Type": "multipart/form-data",
      },
    })
      .then(async (response) => {
        setLoading(false);
        console.log(response)
        if (response.data?.data?.newSeasonDefinitionForPackageGame?.status == 200) {
            toast.success(response.data?.data?.newSeasonDefinitionForPackageGame?.message, {
              position: "top-center",
              autoClose: 6000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: typeof window !== "undefined" && localStorage.getItem("theme") == "dark" ? "dark" : "light",
            });
            setTitle("")
            setDescription("")
            setBadg("")
            setImage([])
            setVideo([])
            setNumberStage("")
            setSeasonNumber("")
            setStageNumberFrom("")
            setStageNumberTo("")
            setPackageSelected(null)
        } else {
          toast.error((response.data?.errors[0]?.data[0]?.message || "مشکلی پیش آمد دوباره تلاش کنید"), {
            position: "top-center",
            autoClose: 6000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: typeof window !== "undefined" && localStorage.getItem("theme") == "dark" ? "dark" : "light",
          });
        }
      })
      .catch(() => {
        toast.error("مشکلی پیش آمد دوباره تلاش کنید", {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: typeof window !== "undefined" && localStorage.getItem("theme") == "dark" ? "dark" : "light",
        });
        setLoading(false);
      });
  }

  const handleAddPhotos = (e: any) => {
    const photos = e.target.files;
    if (photos.length > 10) {
      toast.warning("بیشتر از 10 عکس نمی‌توانید برای فصل انتخاب کنید.", {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: typeof window !== "undefined" && localStorage.getItem("theme") == "dark" ? "dark" : "light",
      });
    } else {
      if (image.length + photos.length > 10) {
        toast.warning("بیشتر از 10 عکس نمی‌توانید برای فصل انتخاب کنید.", {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: typeof window !== "undefined" && localStorage.getItem("theme") == "dark" ? "dark" : "light",
        });
      } else {
        const newData: any = [...image];
        for (let index = 0; index < photos.length; index++) {
          const data = {
            file: photos[index],
            preview: URL.createObjectURL(photos[index]),
          };
          newData.push(data);
        }
        setImage(newData);
      }
      inputImageRef.current.value = "";
    }
  };

  const handleAddVideos = (e: any) => {
    const uri = URL.createObjectURL(e.target.files[0]);
    var videoElement = document.createElement("video");
    videoElement.preload = "metadata";
    videoElement.src = URL.createObjectURL(e.target.files[0]);
    videoElement.onloadedmetadata = function () {
      const videos = e.target.files;
      window.URL.revokeObjectURL(videoElement.src);
      const duration = videoElement.duration;
      if (duration < 30) {
        toast.warning("ویدیوی انتخابی نمیتواند کمتر از 30 ثانیه باشد.", {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: typeof window !== "undefined" && localStorage.getItem("theme") == "dark" ? "dark" : "light",
        });
      } else if (duration > 120) {
        toast.warning("ویدیوی انتخابی نمیتواند بیشتر از 120 ثانیه باشد.", {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: typeof window !== "undefined" && localStorage.getItem("theme") == "dark" ? "dark" : "light",
        });
      } else {
        const items: any = [];
        const data = {
          file: videos[0],
          preview: uri,
          duration: duration.toFixed(0).toString(),
        };
        items.push(data);
        setVideo(items);
        inputVideoRef.current.value = "";
      }
    };
  };
  
  const handleAddMusic = (e: any) => {
    const uri = URL.createObjectURL(e.target.files[0]);
    var musicElement = document.createElement("audio");
    musicElement.preload = "metadata";
    musicElement.src = URL.createObjectURL(e.target.files[0]);
    musicElement.onloadedmetadata = function () {
      const audios = e.target.files;
      window.URL.revokeObjectURL(musicElement.src);
      const duration = musicElement.duration;
      if (duration < 3) {
        toast.warning("موزیک متن نمیتواند کمتر از 3 ثانیه باشد", {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: typeof window !== "undefined" && localStorage.getItem("theme") == "dark" ? "dark" : "light",
        });
      } else if (duration > 180) {
        toast.warning("موزیک متن نمیتواند بیشتر از 180 ثانیه باشد.", {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: typeof window !== "undefined" && localStorage.getItem("theme") == "dark" ? "dark" : "light",
        });
      } else {
        const data = {
          file: audios[0],
          preview: uri,
          duration: duration.toFixed(0).toString(),
        };
        setMusic(data);
        inputMusicRef.current.value = "";
      }
    };
  };

  const deleteMediaItem = (item: any) => {
    if (item?.file?.type.includes("video") == true) {
      setVideo([]);
    } else {
      let index = image.findIndex((i: any) => i.preview == item.preview);
      const newData = [...image];
      newData.splice(index, 1);
      setImage(newData);
    }
  };

  const moveImage = (fromMediaIndex: number, toMediaIndex: number) => {
    const videoOffset = video.length === 1 ? 1 : 0;
    if (
      fromMediaIndex < videoOffset ||
      toMediaIndex < videoOffset ||
      fromMediaIndex >= media.length ||
      toMediaIndex >= media.length
    ) {
      toast.warning("در صورت وجود ویدیو، باید در اولین آیتم لیست، ویدیو قرار گیرد.", {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: typeof window !== "undefined" && localStorage.getItem("theme") == "dark" ? "dark" : "light",
      });
      return;
    }
    const fromImageIndex = fromMediaIndex - videoOffset;
    const toImageIndex = toMediaIndex - videoOffset;
    const newImageArray = [...image];
    const [movedItem] = newImageArray.splice(fromImageIndex, 1);
    newImageArray.splice(toImageIndex, 0, movedItem);
    setImage(newImageArray);
  };
  const setOrderForMediaItem = ({item, index}:{item:any, index:number}) => {
    if(item?.file?.type.includes("video") == true){
      toast.warning("ترتیب نمایش ویدیو همیشه در اولین آیتم است و قابل تغییر نمیباشد.", {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: typeof window !== "undefined" && localStorage.getItem("theme") == "dark" ? "dark" : "light",
      });
    } else {
      let title = `ترتیب نمایش عکس = (${index + 1})`;
      ModalInputHelper.showModalInput({
        title: title,
        description: "میتوانید ترتیب نمایش این عکس را تغییر دهید.",
        inputValue: `${index + 1}`,
        buttons:[
                {
                  buttonText: "تایید",
                  onClickFn: (call) => {
                    const value = Number(call)
                    if(typeof value === 'number' && Number.isFinite(value) && value < 12 && value > 0){
                      const fromMediaIndex = index
                      const toMediaIndex = value - 1
                      moveImage(fromMediaIndex, toMediaIndex)
                      ModalInputHelper.closeModalInput();
                    } else {
                      toast.warning("مقدار وارد شده معتبر نمیباشد", {
                          position: "top-center",
                          autoClose: 3000,
                          hideProgressBar: false,
                          closeOnClick: true,
                          pauseOnHover: true,
                          draggable: true,
                          progress: undefined,
                          theme: typeof window !== "undefined" && localStorage.getItem("theme") == "dark" ? "dark" : "light",
                      });
                    }
                  },
                },
                {
                  buttonText: "انصراف",
                  onClickFn: () => {
                    ModalInputHelper.closeModalInput();
                  },
                },
              ],
        options: {
          maxLength: 2,
        },
      });
    }
  };
  const selectPackages = ()=>{
    const previousSelected = packageSelected?{
      _id: [packageSelected?._id],
      title: [packageSelected?.title],
      image: [packageSelected?.image],
    }:undefined;
    PackageListHelper.openModal({
      previousSelected:previousSelected,
      numberSelected: 8,
      buttons: [
        {
          buttonText: "لغو",
          type: "border",
          onClickFn: () => {
            PackageListHelper.closeModal();
          },
        },
        {
          buttonText: "انتخاب بسته‌ها",
          type: "bold",
          onClickFn: ({ data }: { data: any }) => {
            setPackageSelected({
              _id: data._id[0],
              title: data.title[0],
              image: data.image[0],
            })
            PackageListHelper.closeModal();
          },
        },
      ],
    });
  }
  const deletePackageItem = () => {
    setPackageSelected(null);
  };

  return (
    <div className="flex flex-col justify-between w-full lg:w-[600px] 2xl:w-[750px] mt-10 mb-28 px-4 sm:mx-auto">
      
      <div className="flex gap-6 justify-center font-['iransans-md'] mt-1">
        <label
          className="text-text6 dark:text-text6_dark border-2 border-dashed border-text5 dark:border-text5_dark py-6 text-lg flex-1 rounded-md cursor-pointer transition sm:hover:bg-border2 sm:dark:hover:bg-border2_dark flex flex-col justify-center items-center gap-y-2"
          htmlFor="upload_file_photos"
          tabIndex={0}
        >
          <div className="text-4xl">
            <FaCamera />
          </div>
          <p className="text-xs 3xs:text-sm text-center">افزودن عکس</p>
          <input
            ref={inputImageRef}
            autoComplete="off"
            tabIndex={-1}
            className="hidden"
            id="upload_file_photos"
            type="file"
            accept="image/*"
            multiple
            onChange={handleAddPhotos}
          />
        </label>
        <label
          className="text-text6 dark:text-text6_dark border-2 border-dashed border-text5 dark:border-text5_dark py-6 text-lg flex-1 rounded-md cursor-pointer transition sm:hover:bg-border2 sm:dark:hover:bg-border2_dark flex flex-col justify-center items-center gap-y-2"
          htmlFor="upload_file_video"
        >
          <div className="text-4xl">
            <FaVideo />
          </div>
          <p className="text-xs 3xs:text-sm text-center">افزودن ویدیو</p>
          <input
            ref={inputVideoRef}
            className="hidden"
            id="upload_file_video"
            type="file"
            accept="video/*"
            onChange={handleAddVideos}
          />
        </label>
        <label
          className="text-text6 dark:text-text6_dark border-2 border-dashed border-text5 dark:border-text5_dark py-6 text-lg flex-1 rounded-md cursor-pointer transition sm:hover:bg-border2 sm:dark:hover:bg-border2_dark flex flex-col justify-center items-center gap-y-2"
          htmlFor="upload_file_audio"
        >
          <div className="text-4xl">
            <FaMusic />
          </div>
          <p className="text-xs 3xs:text-sm text-center">افزودن موزیک</p>
          <input
            ref={inputMusicRef}
            className="hidden"
            id="upload_file_audio"
            type="file"
            accept=".mp3,audio/mpeg"
            onChange={handleAddMusic}
          />
        </label>
      </div>

      {(media.length > 0 || music)&& (
        <div className="border-2 border-dashed border-primary dark:border-primary rounded-md py-2 mt-4">
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-y-4 sm:gap-y-4 my-4 ">
            {media.map((item: any, index: number) => (
              <div key={`${index.toString()}`} className="w-full h-20 3xs:h-24 sm:h-28 flex justify-center items-center">
                <div
                  className="relative w-20 h-20 3xs:w-24 3xs:h-24 sm:w-28 sm:h-28 cursor-pointer"
                  onClick={() => {
                    if (item?.file?.type.includes("video") == true) {
                      ShowVideoModalHelper.showModal({
                        src: item.preview,
                        title: item?.title ? item.title : null,
                      });
                    } else {
                      ShowImageModalHelper.showModal({
                        src: item.preview,
                        title: item?.title ? item.title : null,
                      });
                    }
                  }}
                >
                  {item?.file?.type.includes("video") == true ? (
                    <div className="relative h-full w-full">
                      <video src={item.preview} className="inset-0 h-full w-full rounded-md object-cover" />
                      <div className="absolute top-[26%] right-[26%] text-xl sm:text-2xl text-primary bg-background6 bg-opacity-30 rounded-full p-3">
                        <FaPlay />
                      </div>
                      <div className="absolute bottom-1 left-1 flex items-center gap-2 bg-[#00000099] rounded px-1">
                        <p className="text-xs font-['iransans-light'] text-white">{secondsToTime(item.duration)}</p>
                        <div className="text-sm text-white">
                          <IoIosVideocam />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <ImageComponent
                      src={item.preview}
                      alt={"file_photos"}
                      baseURI={false}
                      parentclasses="h-full w-full cursor-pointer"
                    />
                  )}
                  <div className="absolute top-0 w-full flex justify-between px-1 pt-1">
                    <div
                      onClick={(e: any) => {
                        e.stopPropagation();
                        setOrderForMediaItem({item, index});
                      }}
                      className={`flex justify-center items-center rounded transition text-red_color bg-[#00000099] sm:hover:bg-[#33333370] text-lg w-6 h-6`}
                    >
                      <p className="text-xs 3xs:text-sm text-center font-['iransans-md']">{index + 1}</p>
                    </div>
                    <div
                      onClick={(e: any) => {
                        e.stopPropagation();
                        deleteMediaItem(item);
                      }}
                      className="flex justify-center items-center rounded transition text-white bg-[#00000099] sm:hover:bg-[#33333370] text-lg w-6 h-6"
                    >
                      <BiTrash />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {music && (
            <div className="relative bg-primary rounded-lg p-4 w-full max-w-xs mx-auto mb-2">
              <audio
                src={music.preview}
                controls
                className="w-full rounded-md"
              />
              <div className="absolute top-2 left-2">
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    setMusic(null)
                  }}
                  className="w-6 h-6 bg-black/50 text-white hover:bg-black/70 rounded flex items-center justify-center"
                >
                  <BiTrash size={14} />
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      <div className="mt-6">
        <label
          className="font-['iransans-md'] flex-1 text-right text-text6 dark:text-text6_dark text-[.85rem] sm:text-[.95rem] cursor-pointer py-3"
          htmlFor="name"
        >
          زبان فصل
          <span className="text-red-500 px-1">*</span>
          <div className={`mt-1 flex-1 gap-2 w-full items-center justify-between`}>
            <SelectInput
              name="stage-game-language"
              options={languageList}
              onChange={(value) => setLanguage(value || null)}
            />
          </div>
        </label>
      </div>
      <div className="mt-6">
        <label
          className="font-['iransans-md'] flex-1 text-right text-text6 dark:text-text6_dark text-[.85rem] sm:text-[.95rem] cursor-pointer py-3"
          htmlFor="name-stage-season"
        >
          عنوان فصل
          <span className="text-red-500 px-1">*</span>
          <div className={`mt-1 flex gap-2 w-full items-center justify-between`}>
            <Input id="name-stage-season" value={title} changeState={setTitle} classes="flex-1" inputStyles="!text-base" />
          </div>
        </label>
      </div>
      <div className="mt-12">
        <GradientButton
          buttonText={"انتخاب بسته و پکیج فصل"}
          onClickFn={selectPackages}
          loading={false}
          classes="!text-sm !flex-none !px-8 sm:!w-[300px] !w-full"
        />
      </div>
      {packageSelected && (
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-y-12 gap-x-2 sm:gap-y-12 sm:gap-x-2 mt-4 border-2 border-dashed border-primary dark:border-primary rounded-md p-4">

            <div className="flex flex-col items-center gap-2 bg-background3 dark:bg-background3_dark border border-dashed border-info dark:border-info rounded-md py-4">
              <div
                className="relative w-[90%] h-22 3xs:h-24 sm:h-32 cursor-pointer"
              >

                  <ImageComponent
                    src={packageSelected.image}
                    alt={"file_photos"}
                    parentclasses="h-full w-full cursor-pointer"
                  />
                <div className="absolute top-0 w-full flex justify-between px-1 pt-1">
                  <div
                    onClick={(e: any) => {
                      e.stopPropagation();
                      deletePackageItem();
                    }}
                    className="flex justify-center items-center rounded transition text-white bg-[#00000099] sm:hover:bg-[#33333370] text-lg w-6 h-6"
                  >
                    <BiTrash />
                  </div>
                </div>
              </div>
              <p className="text-xs text-center font-['iransans-md'] text-text dark:text-text_dark w-22 sm:w-32 3xs:w-24 h-8">{packageSelected.title}</p>
            </div>

        </div>
      )}
      <div className="mt-6">
        <label
          className="font-['iransans-md'] flex-1 text-right text-text6 dark:text-text6_dark text-[.85rem] sm:text-[.95rem] cursor-pointer py-3"
          htmlFor="number-season-stage-season"
        >
          شماره فصل
          <span className="text-red-500 px-1">*</span>
          <div className={`mt-1 flex gap-2 w-full items-center justify-between`}>
            <Input type="number" id="number-season-stage-season" value={seasonNumber} changeState={setSeasonNumber} classes="flex-1" inputStyles="!text-base" />
          </div>
        </label>
      </div>
      <div className="mt-6">
        <label
          className="font-['iransans-md'] flex-1 text-right text-text6 dark:text-text6_dark text-[.85rem] sm:text-[.95rem] cursor-pointer py-3"
          htmlFor="number-stage-season"
        >
          تعداد مراحل فصل
          <span className="text-red-500 px-1">*</span>
          <div className={`mt-1 flex gap-2 w-full items-center justify-between`}>
            <Input type="number" id="number-stage-season" value={numberStage} changeState={setNumberStage} classes="flex-1" inputStyles="!text-base" />
          </div>
        </label>
      </div>
      <div className="mt-6">
        <label
          className="font-['iransans-md'] flex-1 text-right text-text6 dark:text-text6_dark text-[.85rem] sm:text-[.95rem] cursor-pointer py-3"
          htmlFor="stage_number_from"
        >
          شروع مرحله از
          <span className="text-red-500 px-1">*</span>
          <div className={`mt-1 flex gap-2 w-full items-center justify-between`}>
            <Input type="number" id="stage_number_from" value={stageNumberFrom} changeState={setStageNumberFrom} classes="flex-1" inputStyles="!text-base" />
          </div>
        </label>
      </div>
      <div className="mt-6">
        <label
          className="font-['iransans-md'] flex-1 text-right text-text6 dark:text-text6_dark text-[.85rem] sm:text-[.95rem] cursor-pointer py-3"
          htmlFor="stage_number_to"
        >
          پایان مرحله تا
          <span className="text-red-500 px-1">*</span>
          <div className={`mt-1 flex gap-2 w-full items-center justify-between`}>
            <Input type="number" id="stage_number_to" value={stageNumberTo} changeState={setStageNumberTo} classes="flex-1" inputStyles="!text-base" />
          </div>
        </label>
      </div>
      <div className="mt-6">
        <label
          className="font-['iransans-md'] flex-1 text-right text-text6 dark:text-text6_dark text-[.85rem] sm:text-[.95rem] cursor-pointer py-3"
          htmlFor="number-stage-season"
        >
          تعداد مراحل فصل
          <span className="text-red-500 px-1">*</span>
          <div className={`mt-1 flex gap-2 w-full items-center justify-between`}>
            <Input type="number" id="number-stage-season" value={numberStage} changeState={setNumberStage} classes="flex-1" inputStyles="!text-base" />
          </div>
        </label>
      </div>
       <div className="mt-6">
        <label
          className="font-['iransans-md'] flex-1 text-right text-text6 dark:text-text6_dark text-[.85rem] sm:text-[.95rem] cursor-pointer py-3"
          htmlFor="name"
        >
          نوع محتوا
          <span className="text-red-500 px-1">*</span>
          <div className={`mt-1 flex-1 gap-2 w-full items-center justify-between`}>
            <SelectInput
              name="stage-game-language"
              options={contentSourceType.list}
              onChange={(value) => setContentSourceType(prev =>({
                ...prev,
                selected:value
              }))}
            />
          </div>
        </label>
      </div>
      <div className="mt-6">
        <label
          className="font-['iransans-md'] flex-1 text-right text-text6 dark:text-text6_dark text-[.85rem] sm:text-[.95rem] cursor-pointer py-3"
          htmlFor="name"
        >
          وضعیت انتشار فصل
          <span className="text-red-500 px-1">*</span>
          <div className={`mt-1 flex-1 gap-2 w-full items-center justify-between`}>
            <SelectInput
              name="stage-game-language"
              options={PublicationStatus}
              onChange={(value) => setPublicationStatus(value)}
            />
          </div>
        </label>
      </div>
      <div className="mt-6">
        <label
          className="font-['iransans-md'] flex-1 text-right text-text6 dark:text-text6_dark text-[.85rem] sm:text-[.95rem] cursor-pointer py-3"
          htmlFor="name"
        >
          وضعیت کامل بودن فصل
          <span className="text-red-500 px-1">*</span>
          <div className={`mt-1 flex-1 gap-2 w-full items-center justify-between`}>
            <SelectInput
              name="stage-game-language"
              options={CompletionStatus}
              onChange={(value) => setCompletionStatus(value)}
            />
          </div>
        </label>
      </div>
      <div className="mt-6">
        <label
          className="font-['iransans-md'] flex-1 text-right text-text6 dark:text-text6_dark text-[.85rem] sm:text-[.95rem] cursor-pointer py-3"
          htmlFor="badg-stage-season"
        >
          نشان ( مثل جدید یا به‌زودی )
          <div className={`mt-1 flex gap-2 w-full items-center justify-between`}>
            <Input id="badg-stage-season" value={badg} changeState={setBadg} classes="flex-1" inputStyles="!text-base" />
          </div>
        </label>
      </div>
      <div className="mt-6">
        <label
          className="text-right lg:w-2/3 w-5/6 xl:w-3/5 2xl:w-1/2 text-text6 dark:text-text6_dark cursor-pointer font-iransans-md text-sm"
          htmlFor="description-stage-season"
        >
          توضیحات فصل
          <TextAreaInput
            id={"description-stage-season"}
            value={description}
            changeState={(e: any) => setDescription(e)}
            textAreaStyles="!text-sm mt-1"
            rows={4}
          />
        </label>
      </div>
      <div
        className="py-4 cursor-pointer sm:hover:bg-border2 dark:sm:hover:bg-border2_dark transition select-none"
        onClick={() => setVisible((last) => !last)}
      >
        <div className="flex items-center justify-between w-full h-[42px] pl-2 rounded">
          <label className={`text-sm font-['iransans-md'] cursor-pointer`}>
            <h3 className="text-text dark:text-text_dark font-['iransans-md'] text-[15px]">
              قابل نمایش شود
            </h3>
          </label>
          <Switch
            checked={visible}
            onChange={() => setVisible((last) => !last)}
            onClick={(e) => e.stopPropagation()}
            className={`${visible ? "bg-rgba2" : "bg-border dark:bg-border_dark"}
relative h-[19px] w-[33px] shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out flex items-center`}
          >
            <span
              aria-hidden="true"
              className={`${
                visible
                  ? "translate-x-2 bg-primary"
                  : "-translate-x-[16px] bg-text5 dark:bg-text5_dark"
              }
pointer-events-none inline-block h-[22px] w-[22px] transform rounded-full shadow-lg ring-0 transition duration-200 ease-in-out`}
            />
          </Switch>
        </div>
        <p className="text-justify font-['iransans-md'] text-text5 dark:text-text5_dark text-[12px] sm:text-[14px] mb-1">
          با فعال بودن این گزینه، آیتم قابل نمایش برای کاربران ثبت خواهد شد.
        </p>
      </div>
      <Border />
      <div
        className="py-4 cursor-pointer sm:hover:bg-border2 dark:sm:hover:bg-border2_dark transition select-none"
        onClick={() => setActive((last) => !last)}
      >
        <div className="flex items-center justify-between w-full h-[42px] pl-2 rounded">
          <label className={`text-sm font-['iransans-md'] cursor-pointer`}>
            <h3 className="text-text dark:text-text_dark font-['iransans-md'] text-[15px]">
              فعال شود
            </h3>
          </label>
          <Switch
            checked={active}
            onChange={() => setActive((last) => !last)}
            onClick={(e) => e.stopPropagation()}
            className={`${active ? "bg-rgba2" : "bg-border dark:bg-border_dark"}
relative h-[19px] w-[33px] shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out flex items-center`}
          >
            <span
              aria-hidden="true"
              className={`${
                active
                  ? "translate-x-2 bg-primary"
                  : "-translate-x-[16px] bg-text5 dark:bg-text5_dark"
              }
pointer-events-none inline-block h-[22px] w-[22px] transform rounded-full shadow-lg ring-0 transition duration-200 ease-in-out`}
            />
          </Switch>
        </div>
        <p className="text-justify font-['iransans-md'] text-text5 dark:text-text5_dark text-[12px] sm:text-[14px] mb-1">
          با فعال بودن این گزینه، آیتم به عنوان فعال شده ثبت خواهد شد.
        </p>
      </div>
      <Border />
      <Footer buttonFn={registerAndConfirm} buttonText="ثبت فصل" loadingButton={loading} classes="md:!mr-72 !justify-end" />
     
      
      <ShowVideoModal
        ref={(Ref) => {
          ShowVideoModalHelper.setRef(Ref);
        }}
      />
      <ShowImageModal
        ref={(Ref) => {
          ShowImageModalHelper.setRef(Ref);
        }}
      />
      <ModalInput
        ref={(Ref) => {
          ModalInputHelper.setRef(Ref);
        }}
      />
      <PackageList
        ref={(Ref) => {
          PackageListHelper.setRef(Ref);
        }}
      />
    </div>
  );
};
type ValidationResult = {
  message: string;
  status: number;
};

export default Page;
