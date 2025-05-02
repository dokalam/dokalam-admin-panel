import { ModalInputInterface } from "@/interfaces/ModalInterface";

let _ref: any;

function setRef(ref: any) {
  _ref = ref;
}

function showModalInput(option: ModalInputInterface) {
  _ref.open(option);
}

function closeModalInput() {
  _ref.close();
}

function showError(option: string) {
  _ref.showError(option);
}

const exports = {
  setRef: setRef,
  showModalInput: showModalInput,
  closeModalInput: closeModalInput,
  showError: showError,
};

export default exports;
