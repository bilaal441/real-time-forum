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

  renderComments({postId, commemnts}) {
    const postEl = document.querySelector(`[data-id="${postId}"]`);
    const commentContainer = postEl.querySelector(".post-comments");
    commentContainer.innerHTML = "";
    const html = commemnts?.reduce(
      (acc, curr) =>
        (acc += `
      <div class="comment">
        <p class="comment-meta">
          Commented by ${curr.username} | Created ${formatedDate(
          curr.CreatedAt
        )} ${getTime(curr.createdAt)}
        </p>
        <p class="comment-text">${curr.body}</p>

        <div class="comment-status">
          <span class="likes">
            <span class="status-quantity">${curr.likes}</span> Likes</span
          >
          <span class="dislikes">
            <span class="status-quantity">${curr.dislikes}</span>Dislikes</span
          >
        </div>
        <div class="comment-actions">
          <button class="like-button-comment">Like</button>

          <button class="dislike-button-comment">Dislike</button>
        </div>
      </div>
   
      
      `)
    );

    commentContainer.insertAdjacentHTML("beforeend", html);
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
    <p>categories:</p>
        ${
          curr?.categories
            ? curr?.categories?.reduce(
                (acc, curr) => (acc += `<span>${curr}</span>`),
                ""
              )
            : ""
        }
    </div>
    <div class="post-actions">
      <button data-query="post-comment" class="comment-button">Comment</button>
      <button data-query="post-like" class="like-button">Like</button>
      <button data-query="post-dislike" class="dislike-button">Dislike</button>
    </div>
    <div class="post-comments hidden">
       
       
     </div>
    
    </div>`),
      ""
    )}`;
  }

  renderPostReaction(post) {
    const postEl = document.querySelector(`[data-id="${post.id}"]`);

    const postStatus = postEl.querySelector(".post-status");
    postStatus.innerHTML = "";
    const httm = `
<span class="comments"
  ><span class="status-quantity">${
    post?.comments?.length ? post.comments.length : 0
  }</span>Comments</span
>
<span class="likes">
  <span class="status-quantity">${post.likes}</span> Likes</span
>
<span class="dislikes">
  <span class="status-quantity">${post.dislikes}</span>Dislikes</span
>
`;

    postStatus.insertAdjacentHTML("beforeend", httm);
  }

  postActionsHandler(callBack) {
    this.parentEl.addEventListener("click", (e) => {
      const el = e.target;
      const parent = el.closest(".post");

      if (!parent) return;
      const {id: postId} = parent.dataset;
      const {query} = el.dataset;

      if (
        query === "post-comment" ||
        query === "post-like" ||
        query === "post-dislike" ||
        query === "comment-like" ||
        query === "comment-dislike"
      ) {
        if (query.includes("comment-")) {
          const parent = el.closest(".commemnt");
          const {id: commentId} = parent;
          callBack({query, postId, commentId});
        } else {
          callBack({query, postId});
        }
      }
    });
  }
}

export default new PostView();
