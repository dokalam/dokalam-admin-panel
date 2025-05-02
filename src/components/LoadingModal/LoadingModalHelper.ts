let _ref: any;

function setRef(ref: any) {
  _ref = ref;
}

function showDialog(bodyText?: string) {
  _ref.openModal(bodyText);
}

function hideDialog() {
  _ref.closeModal();
}

const exports = {
  setRef: setRef,
  showDialog: showDialog,
  hideDialog: hideDialog,
};

export default exports;
