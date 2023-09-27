import View from "./view.js";
class LoginView extends View {
  parentEl = document.querySelector(".sign-in");
  form = this.parentEl.querySelector("form");
  errEl = this.form.querySelector(".error-el");
  loginSubmissionHandler(callBack) {
    this.form.addEventListener("submit", (e) => {
      e.preventDefault();

      const formData = new FormData(e.target);
      const formValues = Object.fromEntries(formData.entries());
      callBack(formValues);
    });
  }

  clear() {
    this.parentEl.querySelectorAll("input").forEach((el) => (el.value = ""));
  }



  
}

export default new LoginView();
