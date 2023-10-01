import View from "./view.js";

class FilterView extends View {
  parentEl = document.querySelector(".filter-posts");
  generateMarkUp(data) {
    return `
  
                 <div>
                 <label for="filter-posts-label">Filter Posts</label><br>
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
      callback(e.target.value);
      console.log(e.target.value);
    });
  }
}

export default new FilterView();
