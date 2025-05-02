import { DialogInterface } from "@/interfaces/ModalInterface";

let _ref: any;

function setRef(ref: any) {
  _ref = ref;
}

function showDialog(option: DialogInterface) {
  _ref.open(option);
}
function hideDialog() {
  _ref.close();
}

const exports = {
  setRef: setRef,
  showDialog: showDialog,
  hideDialog: hideDialog,
};

export default exports;
