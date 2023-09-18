import { getJson } from "./helpers.js";

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
};

export const getCategoriesModel = async () => {
  try {
    const res = await getJson("get-catogries", {
      method: "GET",
    });
    state.categories = res;
    console.log(state.categories);
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
      headers: { "Content-Type": "application/json" },
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
      body: JSON.stringify({ id: state.id }),
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
      const { FirstName, LastName } = state.users.find(
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

function generateRandomId() {
  return Math.floor(Math.random() * 1000);
}

export const houses = [
  {
    id: generateRandomId(),
    name: "House Stark",
    description:
      "House Stark of Winterfell is one of the Great Houses of Westeros. Their sigil is a grey direwolf on a white background.",
    saying: "Winter is Coming",
  },
  {
    id: generateRandomId(),
    name: "House Lannister",
    description:
      "House Lannister of Casterly Rock is one of the Great Houses of Westeros. Their sigil is a golden lion on a crimson background.",
    saying: "A Lannister always pays his debts",
  },
  {
    id: generateRandomId(),
    name: "House Targaryen",
    description:
      "House Targaryen is a noble family of Valyrian descent, known for their dragons. Their sigil is a red three-headed dragon on a black background.",
    saying: "Fire and Blood",
  },
  {
    id: generateRandomId(),
    name: "House Baratheon",
    description:
      "House Baratheon is a noble house that originated from the Stormlands. Their sigil is a crowned black stag on a gold background.",
    saying: "Ours is the Fury",
  },
  {
    id: generateRandomId(),
    name: "House Greyjoy",
    description:
      "House Greyjoy of Pyke is known for their naval prowess. Their sigil is a golden kraken on a black background.",
    saying: "We Do Not Sow",
  },
  {
    id: generateRandomId(),
    name: "House Tyrell",
    description:
      "House Tyrell of Highgarden is known for their wealth and agriculture. Their sigil is a golden rose on a green background.",
    saying: "Growing Strong",
  },
  {
    id: generateRandomId(),
    name: "House Martell",
    description:
      "House Martell of Sunspear hails from the deserts of Dorne. Their sigil is a red sun pierced by a gold spear.",
    saying: "Unbowed, Unbent, Unbroken",
  },
  {
    id: generateRandomId(),
    name: "House Bolton",
    description:
      "House Bolton of the Dreadfort is known for their cruel and ruthless nature. Their sigil is a flayed man, red on pink.",
    saying: "Our Blades Are Sharp",
  },
  {
    id: generateRandomId(),
    name: "House Tully",
    description:
      "House Tully of Riverrun is associated with rivers and fishing. Their sigil is a silver trout leaping on a blue and white striped background.",
    saying: "Family, Duty, Honor",
  },
  {
    id: generateRandomId(),
    name: "House Arryn",
    description:
      "House Arryn of the Eyrie is known for its impregnable mountain fortress. Their sigil is a white falcon and crescent moon on a blue background.",
    saying: "As High as Honor",
  },
];
