import {
  TopicCategoryListModalInterface
} from "@/interfaces/ModalInterface";

let _ref: any;

function setRef(ref: any) {
  _ref = ref;
}

function openModal(option?: TopicCategoryListModalInterface) {
  _ref.openModal(option);
}

function closeModal() {
  _ref.closeModal();
}

export default {
  setRef , openModal, closeModal
};
