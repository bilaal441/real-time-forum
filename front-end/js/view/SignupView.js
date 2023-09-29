import View from "./view.js";
class Signup extends View {
  parentEl = document.querySelector(".sign-up");
  firstName = this.parentEl.querySelector(`input[name="firstName"]`);
  lastName = this.parentEl.querySelector(`input[name="lastName"]`);
  ageInput = this.parentEl.querySelector(`input[name="age"]`);
  genderInput = this.parentEl.querySelector(`input[name="gender"]`);
  nickNameInput = this.parentEl.querySelector(`input[name="nickname"]`);
  passwordInput = this.parentEl.querySelector(`input[name="password"]`);
  emailInput = this.parentEl.querySelector(`input[name="email"]`);

  constructor() {
    super();
    this.parentEl
      .querySelectorAll("input")
      .forEach((el) =>
        el.addEventListener("focus", this.inputOnfocusHandler.bind(this))
      );
  }

  inputOnfocusHandler(event) {
    this.selectLabel(event.target.name).classList.add("hidden");
    event.target.classList.remove("input-error");
  }

  isValidPassword(password) {
    const regex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[\-!\"#\$%\&()\*,./:;?@\[\]\^_`\{\|\}~+<=>])(?=.{8,})/;

    return !regex.test(password);
  }

  validateEmail(email) {
    // console.log(email);
    var re =
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    return !re.test(String(email).toLowerCase());
  }
  onInputLastName(event) {
    this.selectLabel("last").classList.add("hidden");
    event.target.classList.remove("input-error");
  }

  selectLabel(val) {
    return document.querySelector(`label[for="${val}"]`);
  }

  addErrorInput(label, input) {
    this.selectLabel(label).classList.remove("hidden");
    input.classList.add("input-error");
  }

  validateFormFields(label, input, callback) {
    if (callback(input.value)) {
      this.addErrorInput(label, input);
      return false;
    }

    return true;
  }

  signupSubmissionHandler(callback) {
    this.parentEl.querySelector("form").addEventListener("submit", (e) => {
      e.preventDefault();
      const formData = new FormData(e.target);
      const formValues = Object.fromEntries(formData.entries());

      const firstNameIsValid = this.validateFormFields(
        "firstName",
        this.firstName,
        this.helperEmtystr
      );
      const lastNameIsValid = this.validateFormFields(
        "lastName",
        this.lastName,
        this.helperEmtystr
      );

      const ageIsValid = this.validateFormFields(
        "age",
        this.ageInput,
        this.helperEmtystr
      );
      const genederIsValid = this.validateFormFields(
        "gender",
        this.genderInput,
        this.helperEmtystr
      );

      const nicknameIsValid = this.validateFormFields(
        "nickname",
        this.nickNameInput,
        this.helperEmtystr
      );

      const emailIsValid = this.validateFormFields(
        "email",
        this.emailInput,
        this.validateEmail
      );
      console.log(this.emailInput);
      const passIsValid = this.validateFormFields(
        "password",
        this.passwordInput,
        this.isValidPassword
      );

      const formIsvalid =
        firstNameIsValid &&
        lastNameIsValid &&
        ageIsValid &&
        genederIsValid &&
        nicknameIsValid &&
        emailIsValid &&
        passIsValid;

      if (!formIsvalid) {
        console.log("form is not valid", emailIsValid, passIsValid);
        return;
      }

      callback(formValues);
    });
  }

  clearInputs() {
    // clear the input fields after successful submission of data to server
    this.parentEl.querySelectorAll("input").forEach((el) => {
      el.value = "";
      el.classList.remove("input-error");
    });

    this.parentEl.querySelectorAll("label").forEach((el) => {
      el.classList.add("hidden");
    });
    this.selectLabel("email").textContent =
      "please enter a valid email address.";

    this.selectLabel("nickname").textContent = "input nickname is required";
  }

  addErrorEmail(flag) {
    if (!flag) return;
    this.selectLabel("email").textContent =
      "Email already exists. Please use a different email";
    this.addErrorInput("email", this.emailInput);
  }

  addErrorNickName(flag) {
    if (!flag) return;
    this.selectLabel("nickname").textContent =
      "nickname  already exists. Please use a different nickname";
    this.addErrorInput("nickname", this.emailInput);
  }

  showLogin() {
    this.parentEl.classList.add("hidden");
    document.querySelector(".sign-in").classList.remove("hidden");
  }
}

export default new Signup();
