import { CalendarModalInterface } from "@/interfaces/ModalInterface";

let _ref: any;

function setRef(ref: any) {
  _ref = ref;
}

function openModal(option: CalendarModalInterface) {
  _ref.openModal(option);
}

function hideModal() {
  _ref.close();
}

const exports = {
  setRef: setRef,
  openModal: openModal,
  hideModal: hideModal,
};

export default exports;
