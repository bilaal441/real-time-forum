import View from "./view.js";

class AddPostView extends View {
  parentEl = document.querySelector(".categories");
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
