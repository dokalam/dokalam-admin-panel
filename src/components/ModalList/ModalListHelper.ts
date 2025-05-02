import {
  ModalListResponseLoadingInterface,
  ModalLoadingListInterface,
  ModalNormalListInterface,
} from "@/interfaces/ModalInterface";

let _ref: any;

function setRef(ref: any) {
  _ref = ref;
}

function showNormal(option: ModalNormalListInterface) {
  _ref.openNormal(option);
}

function showLoading(option: ModalLoadingListInterface) {
  _ref.openLoading(option);
}

function showResponse(option: ModalListResponseLoadingInterface) {
  _ref.setResponseLoading(option);
}

function hideModal() {
  _ref.close();
}

const exports = {
  setRef: setRef,
  showNormal: showNormal,
  showLoading: showLoading,
  showResponse: showResponse,
  hideModal: hideModal,
};

export default exports;
