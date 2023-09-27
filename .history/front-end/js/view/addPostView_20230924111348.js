import View from "./view.js";

class AddPostView extends View {
  parentEl = document.querySelector(".categories");
  addPostForm = document.querySelector("#postForm");
  #clear() {
    this.addPostForm.reset();
  }
  addPostFormForSubmissionHandler(callback) {
    this.addPostForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const formData = new FormData(e.target);
      const formValues = Object.fromEntries(formData.entries());
      for (const value of Object.entries(formValues)) {
        if (value[1] === "") {
          return;
        }
      }
      if (formValues.title.length > 64 || formValues.body.length > 1024) {
        return;
      }
      callback(formValues);
      this.#clear();
    });
  }
  generateMarkUp(data) {
    return `
    <label class="main-label">Categories:</label>
    <br>
    ${data.reduce(
      (acc, curr) =>
        (acc += ` <input
    type="checkbox"
    id="${curr.id}"
    name="${curr.name}"
    value="${curr.id}"
  />
  <label for="${curr.name}">${curr.name}</label>`),
      ""
    )}
    `;
  }
}

export default new AddPostView();
