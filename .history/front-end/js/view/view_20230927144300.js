class View {
  loginSignupEl = document.querySelector(".login-signup");
  mainsection = document.querySelector(".users");
  render(data) {
    this.parentEl.innerHTML = ``;
    const markup = this.generateMarkUp(data);
    this.parentEl.insertAdjacentHTML("beforeend", markup);
  }

  toggleSignInSignup() {
    this.loginSignupEl.addEventListener("click", (e) => {
      const el = e.target;
      if (el.classList.contains("go-signup")) {
        //show sign up form
        e.currentTarget.querySelector(".sign-in").classList.add("hidden");
        e.currentTarget.querySelector(".sign-up").classList.remove("hidden");
      }

      if (el.classList.contains("go-signin")) {
        // go-signin
        e.currentTarget.querySelector(".sign-up").classList.add("hidden");
        e.currentTarget.querySelector(".sign-in").classList.remove("hidden");
      }
    });
  }

  helperEmtystr(val) {
    return val.trim() === "";
  }
  error(err) {
    this.errEl.classList.remove("hidden");
    this.errEl.textContent = err;
  }

  removeError() {
    this.errEl.classList.add("hidden");
    this.errEl.textContent = "";
  }
  hiddeloginSignupEl() {
    this.loginSignupEl.classList.add("hidden");
  }

  showloginSignupEl() {
    this.loginSignupEl.classList.remove("hidden");
  }

  hiddeMainSection() {
    this.mainsection.classList.add("hidden");
  }

  showMainSection() {
    this.mainsection.classList.remove("hidden");
  }

  toggleTyping(isTyping, indicator, cssClass = "online-indicator-hidden") {
    if (isTyping && indicator?.classList.contains(cssClass)) {
      indicator.classList.remove(cssClass);
    } else if (!isTyping && !indicator?.classList.contains(cssClass)) {
      indicator?.classList.add(cssClass);
    }
  }

  addfadeBody(){
 document.body.classList.add('fade')

 setTimeout(()=>{

  
 })

  }
}

export default View;
