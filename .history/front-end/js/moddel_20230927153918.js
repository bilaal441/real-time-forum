import {getJson} from "./helpers.js";

export const state = {
  isLogin: false,
  username: "",
  id: "",
  users: [],
  chatPage: 1,
  chatOpenId: "",
  onlineUserIdsSet: new Set(),
  socket: null,
  typingToUser: {},
  audio1: new Audio("./sound/croworraven1.mp3"),
  audio2: new Audio("./sound/croworraven2.mp3"),
  categories: [],
  posts: [],
};

export const getPostsModel = async () => {
  try {
    const res = await getJson("get-posts", {
      method: "GET",
    });
    state.posts = res;
  } catch (err) {
    throw err;
  }
};

export const getCategoriesModel = async () => {
  try {
    const res = await getJson("get-catogries", {
      method: "GET",
    });
    state.categories = res;
  } catch (err) {
    throw err;
  }
};

const getHeader = () => {
  const headers = new Headers();
  headers.append("user_token", document.cookie);
  return headers;
};

export const signupModel = async (data) => {
  try {
    const res = getJson("newUser", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify(data),
    });
  } catch (err) {
    throw err;
  }
};

export const checkEmailOrNickNameExists = async (fieldName, fieldValue) => {
  try {
    const res = await getJson(`check-${fieldName}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: `${fieldName}=${fieldValue}`,
    });

    return res;
  } catch (err) {
    throw err;
  }
};

export const loginModel = async (data) => {
  try {
    const res = await getJson("login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(data),
    });
    if (res?.success) {
      state.isLogin = true;
      state.username = res.username;
      state.id = res.id;
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const persistLoginModel = async () => {
  try {
    const res = await getJson("checksession", {
      method: "GET",
      credentials: "include",
    });

    if (res?.success) {
      state.isLogin = true;
      state.username = res.username;
      state.id = res.id;
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const getUsers = async () => {
  try {
    const res = await getJson("get-users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({id: state.id}),
      credentials: "include",
    });
    state.users = res;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const getUser = (id) => {
  return state.users.find((user) => user.Id === id);
};

export const getMessages = async (otherUserId) => {
  try {
    const res = await getJson("get-messages", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
        user_token: document.cookie,
      },
      body: JSON.stringify({
        page: state.chatPage,
        currUser: state.id,
        otherUser: otherUserId,
      }),
      credentials: "include",
    });

    state.chatPage++;

    return res.messages.map((el) => {
      const {FirstName, LastName} = state.users.find(
        (user) => user.Id === el.sender_id
      );
      return {
        id: el.id,
        message: el.message,
        created: formatedDate(el.created),
        username: `${FirstName} ${LastName}`,
        sender_id: el.sender_id,
        recipient_id: el.recipient_id,
      };
    });
  } catch (err) {
    throw err;
  }
};

export const resetChatPage = () => {
  state.chatPage = 1;
  state.chatOpenId = "";
};

export const formatedDate = (date) => {
  const createdDate = new Date(date);
  return ` ${createdDate.getDate() < 10 ? 0 : ""}${createdDate.getDate()}/0${
    createdDate.getMonth() + 1
  }/${createdDate.getFullYear()}`;
};

export const setOpenChat = (id) => {
  state.chatOpenId = id;
};

export const logoutModdel = async () => {
  try {
    const res = await getJson("logout", {
      method: "POST",
      headers: getHeader(),
      credentials: "include",
    });
    console.log(res);
  } catch (err) {
    throw err;
  }
};

export const sortLastMessage = (id) => {
  const first = state.users.find((el) => el.Id === id);
  const rest = state.users.filter((el) => el.Id !== id);
  const result = [first, ...rest];
  state.users = result;
  return result.filter((el) => el.Id !== state.id);
};

export function throttle(callback, delay) {
  let previousTime = 0;
  return function () {
    const currentTime = new Date().getTime();
    if (currentTime - previousTime > delay) {
      previousTime = currentTime;
      callback.apply(this, arguments);
    }
  };
}

export const setOnlineUsersId = (data) => {
  state.onlineUserIdsSet = new Set(data);
};

export const addPost = async function (data) {
  try {
    let cats = Object.keys(data).filter(
      (el) => el !== "body" && el !== "title"
    );
    console.log(cats);
    const res = await getJson("add-post", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      credentials: "include",
      body: JSON.stringify({
        title: data.title,
        body: data.body,
        categories: cats,
      }),
    });
    console.log(res, "post return from server");
    state.posts = [res.post, ...state.posts];
  } catch (err) {
    throw err;
  }
};
const findPostHelper = (id) => state.posts.find((el) => el.id === id);
export const likeDislikePostModdel = async (data) => {
  try {
    const res = await getJson("react-Post-like-dislike", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      credentials: "include",
      body: JSON.stringify(data),
    });

    state.posts = state.posts.map((post) => {
      if (post.id === res.id) {
        const {
          title,
          body,
          categories,
          comments,
          created_at,
          username,
          ...rest
        } = post;

        return {
          title,
          body,
          categories,
          comments,
          created_at,
          username,
          ...res,
        };
      } else {
        return post;
      }
    });
    return findPostHelper(res.id);
  } catch (err) {
    throw err;
  }
};

export const likeAndDislikeComment = async (data) => {
  try {
    const res = await getJson("react-comment-like-dislike", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      credentials: "include",
      body: JSON.stringify(data),
    });
    console.log("res", res, "state");
  } catch (err) {
    throw err;
  }
};

export const addCommentModdel = async (data) => {
  try {
    const res = await getJson("add-Comment", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      credentials: "include",
      body: JSON.stringify(data),
    });
    state.posts = state.posts.map((el) => {
      if (el.id === res.id) {
        if (el.comment) {
          return {...el, comments: [res.comment, ...el.comments]};
        } else {
          return {...el, comments: [res.comment]};
        }
      } else {
        return el;
      }
    });
    return [res.id, res.comments];
  } catch (err) {
    throw err;
  }
};
