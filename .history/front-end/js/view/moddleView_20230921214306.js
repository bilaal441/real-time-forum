import View from "./view.js";

class ModdleView extends View {
  openModalBtn = document.getElementById("openModalBtn");
  closeModalBtn = document.getElementById("closeModalBtn");
  modal = document.getElementById("myModal");
  constructor() {
    super();
    window.addEventListener(
      "click",
      function (event) {
        if (event.target === this.modal) {
          this.modal.style.display = "none";
        }
      }.bind(this)
    );

    this.closeModalBtn.addEventListener(
      "click",
      function () {
        this.modal.style.display = "none";
      }.bind(this)
    );
  }

  openModalHandler(callback) {
    this.openModalBtn.addEventListener(
      "click",
      function (e) {
        this.modal.style.display = "block";
        callback();
      }.bind(this)
    );
  }
}

export default new ModdleView();
