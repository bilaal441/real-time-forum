import View from "./view.js";

class FilterView extends View {
  parentEl = document.querySelector(".filter-posts");
  generateMarkUp(data) {
    return `
  
    <label for="filter-posts-label">filter posts:</label>
                 <div>
                <select name="posts" id="filter-posts">
                  <option value="all">all</option>
                  <option value="created posts">created posts</option>
                  <option value="liked posts">liked posts</option>
                  ${data.reduce(
                    (acc, curr) =>
                      (acc += `<option value="${curr.name}">${curr.name}</option>`)
                  )}
                </select>
                </div>
   
    `;
  }

  filterHandler(callback) {
    const selectElement = document.getElementById("filter-posts");
    console.log("selectElement", selectElement);
    selectElement.addEventListener("change", (e) => {
      console.log(e.target.value);
      callback(e.target.value));
    });
  }
}

export default new FilterView();
