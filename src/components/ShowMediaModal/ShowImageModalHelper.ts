import { ImageModalInterface } from "@/interfaces/ModalInterface";

let _ref: any;

function setRef(ref: any) {
  _ref = ref;
}

function showModal(option: ImageModalInterface) {
  _ref.openModal(option);
}

const exports = {
  setRef: setRef,
  showModal: showModal,
};

export default exports;
