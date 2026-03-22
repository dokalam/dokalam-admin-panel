import {
  UserListModalInterface
} from "@/interfaces/ModalInterface";

let _ref: any;

function setRef(ref: any) {
  _ref = ref;
}

function openModal(option?: UserListModalInterface) {
  _ref.openModal(option);
}

function closeModal() {
  _ref.closeModal();
}

export default {
  setRef , openModal, closeModal
};
