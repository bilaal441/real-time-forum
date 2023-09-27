import View from "./view.js";

const formatedDate = (date) => {
  const createdDate = new Date(date);
  return ` ${createdDate.getDate() < 10 ? 0 : ""}${createdDate.getDate()}/0${
    createdDate.getMonth() + 1
  }/${createdDate.getFullYear()}`;
};

const getTime = (date) => {
  const createdDate = new Date(date);
  return createdDate.getHours() + ":" + createdDate.getMinutes();
};

class PostView extends View {
  parentEl = document.querySelector(".posts");

  renderOnePost(data) {
    const markup = this.generateMarkUp([data]);
    this.parentEl.insertAdjacentHTML("afterbegin", markup);
  }
  generateMarkUp(data) {
    return `${data.reduce(
      (acc, curr) =>
        (acc += `<div class="post" data-id="${curr.id}">
    <h1 class="post-title">${curr.title}</h1>
    <p class="post-meta">Posted by ${curr.username} | Created ${formatedDate(
          curr.created_at
        )} ${getTime(curr.created_at)}</p>
    <p class="post-body">
      ${curr.body}
    </p>

    <div class="post-status">
      <span class="comments"
        ><span class="status-quantity">${
          curr?.comments?.length ? curr.comments.length : 0
        }</span>Comments</span
      >
      <span class="likes">
        <span class="status-quantity">${curr.likes}</span> Likes</span
      >
      <span class="dislikes">
        <span class="status-quantity">${curr.dislikes}</span>Dislikes</span
      >
    </div>
    <div class="post-categories">
        ${curr?.categories?.reduce(
          (acc, curr) => (acc += `<span>${curr}</span>`),
          ""
        )}
    </div>
    <div class="post-actions">
      <button data-quary="post-comment" class="comment-button">Comment</button>
      <button data-quary="post-like" class="like-button">Like</button>
      <button data-quary="post-dislike" class="dislike-button">Dislike</button>
    </div></div>`),
      ""
    )}`;
  }

  postActionsHandler(callBack) {
    this.parentEl.addEventListener("click", (e) => {
      const el = e.target;
      const parent = el.closest(".post");

      if (!parent) return;
      const {postId} = parent.dataset;
      const {quary} = el.dataset;

      if (
        quary === "post-comment" ||
        quary === "post-like" ||
        quary === "post-dislike" ||
        quary == "comment-like" ||
        quary == "comment-dislike"
      ) {
        if (quary.includes("comment")) {
          const parent = el.closest(".commemnt");
          const {idcommentId} = 
        } else {
          callBack({quary, postId});
        }
      }
    });
  }
}

export default new PostView();
