import LoginView from "./view/LoginView.js";
import SignupView from "./view/SignupView.js";
import NavView from "./view/NavView.js";
import OnlineUsers from "./view/OnlineUsers.js";
import ChatView from "./view/ChatView.js";
import PostView from "./view/PostView.js";

import {
  signupModel,
  checkEmailOrNickNameExists,
  loginModel,
  state,
  persistLoginModel,
  getUsers,
  getMessages,
  getUser,
  resetChatPage,
  formatedDate,
  setOpenChat,
  throttle,
  logoutModdel,
  sortLastMessage,
  setOnlineUsersId,
  getCategoriesModel,
  addPost,
  getPostsModel,
  likeDislikePostModdel,
  likeAndDislikeComment,
  addCommentModdel,
} from "./moddel.js";
import moddleView from "./view/moddleView.js";
import addPostView from "./view/addPostView.js";
import filterView from "./view/filterView.js";

const controllAddPost = async (data) => {
  try {
    await addPost(data);
    PostView.renderOnePost(state.posts[0]);
  } catch (err) {
    console.log(err);
  }
};

const controllSignUp = async (data) => {
  try {
    const isEmailTaken = await checkEmailOrNickNameExists("email", data.email);
    SignupView.addErrorEmail(isEmailTaken);

    const isNickNameTaken = await checkEmailOrNickNameExists(
      "nickname",
      data.nickname
    );
    SignupView.addErrorNickName(isNickNameTaken);
    if (isEmailTaken.exists || isNickNameTaken.exists) {
      return;
    }
    signupModel(data);
    SignupView.clearInputs();
    SignupView.showLogin();
  } catch (err) {
    console.log("Error in signing", err);
  }
};

const controllSignIn = async (data) => {
  try {
    await loginModel(data);
    if (state.isLogin) {
      LoginView.clear();
      NavView.render({username: state.username});
      LoginView.hiddeloginSignupEl();
      LoginView.showMainSection();
      await getUsers();
      OnlineUsers.render(state.users.filter((el) => el.Id !== state.id));
      ChatView.showUsersContainer();
      await getCategoriesModel();
      filterView.render(state.categories);
      await getPostsModel();
      PostView.render(state.posts);
      ws();
    }
  } catch (err) {
    LoginView.error(err.message);
    console.log("Error in signing", err);
  }
};

const controllpersist = async () => {
  try {
    await persistLoginModel();
    if (state.isLogin) {
      LoginView.clear();
      await getCategoriesModel();
      NavView.render({username: state.username});
      filterView.render(state.categories);
      LoginView.hiddeloginSignupEl();
      LoginView.showMainSection();
      await getUsers();
      OnlineUsers.render(state.users.filter((el) => el.Id !== state.id));
      await getPostsModel();
      PostView.render(state.posts);
      ws();
    } else {
      LoginView.showloginSignupEl();
    }
  } catch (err) {
    console.log(err);
  }
};

function ws() {
  state.socket = new WebSocket(`ws://localhost:8000/ws`);

  state.socket.addEventListener("open", (event) => {
    state.socket.send("Hello, server!");
    controlClearTypingInDicator();
    console.log("WebSocket connection opened", event.data);
  });

  state.socket.addEventListener("message", (event) => {
    const data = JSON.parse(event.data);

    if (data.type === "online-user") {
      setOnlineUsersId(data.data);
      OnlineUsers.updateOnlineStatusUsers(state.onlineUserIdsSet);
      ChatView.updateOnlineStatusChat(new Set(data.data), state.chatOpenId);
    } else if (data.type === "message") {
      const {message, created, sender_id} = data.data;
      const {LastName, FirstName} = getUser(sender_id);
      OnlineUsers.render(sortLastMessage(sender_id));
      OnlineUsers.updateOnlineStatusUsers(state.onlineUserIdsSet);

      state.audio1.currentTime = 0;
      state.audio1.play();
      ChatView.addfadeBody();
      if (state.chatOpenId !== sender_id) return;
      ChatView.renderMessage([
        [
          {
            message,
            created: formatedDate(created),
            username: `${FirstName}${LastName}`,
          },
        ],
        state.id,
      ]);
      ChatView.scrollToBottom(state.chatOpenId);
    } else if (data.type === "logout") {
      controllLogout();
    } else {
      console.log(data);
      const {sender_id, typing: isTyping} = data.data;
      OnlineUsers.toggleTypingUsers(sender_id, isTyping);
      ChatView.toggleTypingChat(isTyping);
    }
  });

  state.socket.onclose = (event) => {
    console.log("WebSocket connection closed.", event.data);
  };
}

async function controllLoadMore(id) {
  try {
    let loadedMessages = await getMessages(id);

    if (loadedMessages.length === 0) return;

    ChatView.renderMessage([loadedMessages, state.id], true);
  } catch (err) {
    console.log(err);
  }
}

const controllInputTyping = (value, id) => {
  const obg = {
    sender_id: state.id,
    recipient_id: id,
    message: "",
    id: "",
    created: "",
    type: "typing",
  };

  if (value) {
    state.socket.send(JSON.stringify({typing: true, ...obg}));
    localStorage.setItem("typingIndicator", JSON.stringify(obg));
  } else {
    localStorage.clear("typingIndicator");
    state.socket.send(JSON.stringify({typing: false, ...obg}));
  }
};

const controllShowChat = async (id, isOnline) => {
  try {
    setOpenChat(id);
    console.log();
    ChatView.render([
      await getMessages(id),
      getUser(id),
      state.id,
      id,
      isOnline,
    ]);

    ChatView.loadMoreMessagesOnScroll(throttle(controllLoadMore, 1000), state),
      ChatView.scrollToBottom(state.chatOpenId);

    ChatView.inputOninputHandler(controllInputTyping);
  } catch (err) {
    console.log(err);
    ChatView.render([[], getUser(id), state.id, id]);
  }
};

const controllSendMessage = (obg) => {
  const {LastName, FirstName} = getUser(state.id);
  ChatView.renderMessage([
    [
      {
        message: obg.message,
        username: `${FirstName}${LastName}`,
        sender_id: obg.sender_id,
        created: formatedDate(new Date().toString()),
      },
    ],
    state.id,
  ]);

  ChatView.scrollToBottom(state.chatOpenId);
  OnlineUsers.render(sortLastMessage(obg.recipient_id));
  OnlineUsers.updateOnlineStatusUsers(state.onlineUserIdsSet);
  state.socket.send(`${JSON.stringify(obg)}`);
  state.audio2.currentTime = 0;
  state.audio2.play();
};

function controlClearTypingInDicator() {
  const typingUser = JSON.parse(localStorage.getItem("typingIndicator"));
  if (!typingUser) return;
  state?.socket?.send(JSON.stringify({typing: false, ...typingUser}));
}

const controllAddPostForm = () => {
  addPostView.render(state.categories);
};

export const controllLogout = async () => {
  try {
    controlClearTypingInDicator();
    state.socket.send(
      JSON.stringify({
        sender_id: state.id,
        recipient_id: state.id,
        message: "",
        id: "",
        created: "",
        type: "logout",
      })
    );
    state.socket.close();
    await logoutModdel();
    NavView.hidde();
    LoginView.showloginSignupEl();
    LoginView.hiddeMainSection();
    resetChatPage();
    ChatView.hiddeChat();
  } catch (err) {
    throw err;
  }
};

const controllAddComment = async (data) => {
  try {
    const fetchData = await addCommentModdel(data);
    PostView.renderOneComment(...fetchData);
  } catch (err) {
    console.log(err);
  }
};

const controllPostActions = async (data) => {
  try {
    const helperLikeDislike = async () => {
      const post = await likeDislikePostModdel({
        query: data.query.split("-")[1],
        postid: data.postId,
      });
      PostView.renderPostReaction(post);
    };

    // query === "comment-like" ||
    // query === "comment-dislike"
    switch (data.query) {
      case "post-like":
        helperLikeDislike();
        break;
      case "post-dislike":
        helperLikeDislike();
        break;
      case "comment-like":
        await likeAndDislikeComment(data);
        break;
      case "post-comment":
        const {comments} = state.posts.find((el) => {
          return el.id === data.postId;
        });
        PostView.renderComments(data.postId, comments);
        PostView.addCommentHandler(controllAddComment, data.postId);
        break;
    }
  } catch (err) {
    console.log(err);
  }
};

(() => {
  controllpersist();
  LoginView.toggleSignInSignup();
  SignupView.signupSubmissionHandler(controllSignUp);
  LoginView.loginSubmissionHandler(controllSignIn);
  OnlineUsers.handleUserCardClick(controllShowChat);
  ChatView.closeChat(resetChatPage);
  ChatView.sendMessageHandler(controllSendMessage);
  NavView.logoutHandler(controllLogout);
  moddleView.openModalHandler(controllAddPostForm);
  addPostView.addPostFormForSubmissionHandler(controllAddPost);
  PostView.postActionsHandler(controllPostActions);
})();
