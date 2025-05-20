import {
  PackageListModalInterface
} from "@/interfaces/ModalInterface";

let _ref: any;

function setRef(ref: any) {
  _ref = ref;
}

function showModal(option?: PackageListModalInterface) {
  _ref.openModal(option);
}

function hideModal() {
  _ref.closeModal();
}

export default {
  setRef , showModal, hideModal
};
