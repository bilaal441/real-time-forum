import View from "./view.js";

const formatedDate = (date) => {
  const createdDate = new Date(date);
  return ` ${createdDate.getDate() < 10 ? 0 : ""}${createdDate.getDate()}/${
    createdDate.getMonth() < 9 ? 0 : ""
  }${createdDate.getMonth() + 1}/${createdDate.getFullYear()}`;
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

  generateCommentMarkUp(data) {
    return data?.reduce(
      (acc, curr) =>
        (acc += `
  <div class="comment" data-id="${curr.id}">
    <p class="comment-meta">
      Commented by ${curr.username} | Created ${formatedDate(
          curr.created_at
        )} ${getTime(curr.created_at)}
    </p>
    <p class="comment-text">${curr.body}</p>

    <div class="comment-status">
      <span class="likes">
        <span class="status-quantity">${curr?.likes}</span> Likes</span
      >
      <span class="dislikes">
        <span class="status-quantity">${curr?.dislikes}</span>Dislikes</span
      >
    </div>
    <div class="comment-actions">
      <button data-query="comment-like" class="like-button-comment">Like</button>

      <button data-query="comment-dislike" class="dislike-button-comment">Dislike</button>
    </div>
  </div>

  
  `),
      ""
    );
  }

  renderComments(postId, commemnts) {
    const postEl = document.querySelector(`[data-id="${postId}"]`);
    const commentContainer = postEl.querySelector(".comments-container");
    postEl.querySelector(".post-comments").classList.remove("hidden");
    commentContainer.innerHTML = "";
    if (commemnts?.length > 0) {
      console.log(postId, commemnts);
      const html = this.generateCommentMarkUp(commemnts);
      commentContainer.insertAdjacentHTML("beforeend", html);
    }
  }

  renderOneComment(postId, commemnt) {
    const html = this.generateCommentMarkUp([commemnt]);
    const postEl = document.querySelector(`[data-id="${postId}"]`);
    const commentContainer = postEl.querySelector(".comments-container");
    commentContainer.insertAdjacentHTML("afterbegin", html);
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
      <button data-query="post-comment" class="comment-button">💬 Comment</button>
      <button data-query="post-like" class="like-button">👍 Like</button>
      <button data-query="post-dislike" class="dislike-button">👎 Dislike</button>
    </div>
    <div class="post-comments hidden">
    <form class="addcomment-form">
    <input placeholder="type comment"  required type="text" name="comment" id="${
      curr.id
    }">
    <button  class="btn" type="submit">
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" 
    fill="none" class="icon-sm m-1 md:m-0">
    <path d="M.5 1.163A1 1 0 0 1 1.97.28l12.868 6.837a1 1 0 0 1 0 1.766L1.969 15.72A1 1 0 0 1 .5 14.836V10.33a1 1 0 0 1 .816-.983L8.5 8 1.316 6.653A1 1 0 0 1 .5 5.67V1.163Z" fill="currentColor"></path></svg>
    </button>
  </form>
       <div class="comments-container"> 
       
       
       
       </div>
     </div>
    
    </div>`),
      ""
    )}`;
  }

  renderCommentReaction(comment) {
    const commentEl = document.querySelector(`[data-id="${comment.id}"]`);

    const commentStatus = commentEl.querySelector(".comment-status");
    commentStatus.innerHTML = "";
    const html = `<span class="likes">
    <span class="status-quantity">${comment?.likes}</span> Likes</span
  >
  <span class="dislikes">
    <span class="status-quantity">${comment?.dislikes}</span>Dislikes</span
  >`;
    commentStatus.insertAdjacentHTML("beforeend", html);
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
      const { id: postId } = parent.dataset;
      const { query } = el.dataset;
      if (
        query === "post-comment" ||
        query === "post-like" ||
        query === "post-dislike" ||
        query === "comment-like" ||
        query === "comment-dislike"
      ) {
        if (query.includes("comment-")) {
          const parent = el.closest(".comment");
          const { id: commentId } = parent.dataset;
          callBack({ query: query, postId, commentId });
        } else {
          callBack({ query, postId });
        }
      }
    });
  }

  addCommentHandler(callBack, postId) {
    const postEl = document.querySelector(`[data-id="${postId}"]`);
    const addCommentForm = postEl.querySelector(".addcomment-form");
    addCommentForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const formData = new FormData(e.target);
      const formValues = Object.fromEntries(formData.entries());
      if (formValues.comment === "") {
        return;
      }
      callBack({ body: formValues.comment, post_id: postId });
      addCommentForm.reset();
    });
  }
}

export default new PostView();
