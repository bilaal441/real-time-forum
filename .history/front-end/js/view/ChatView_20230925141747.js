import View from "./view.js";

class ChatView extends View {
  parentEl = document.querySelector(".chat-container");
  onlineUsers = document.querySelector(".users-container");
  timeout;
  hiddeChat() {
    this.parentEl.classList.remove("open");
  }
  closeChat(callBack) {
    this.parentEl.addEventListener("click", (e) => {
      if (e.target.classList.contains("close-chat")) {
        this.hiddeChat();
        this.onlineUsers.classList.remove("hidden");
        this.#clearInput();

        callBack();
      }
    });
  }
  showUsersContainer() {
    this.onlineUsers.classList.remove("hidden");
  }

  #clearInput() {
    document.querySelector(".input").value = "";
  }

  loadMoreMessagesOnScroll(callBack, state) {
    // console.log(this.parentEl);
    const chatContainer = document.querySelector(`.id${state.chatOpenId}`);
    let prevScrollPos = chatContainer.scrollTop;

    chatContainer.addEventListener("scroll", (event) => {
      const el = event.target;
      const containerHeight = el.scrollHeight;
      const scrollTop = el.scrollTop;

      const percentageScrolledUp = (scrollTop / containerHeight) * 100;

      if (percentageScrolledUp <= 10 && scrollTop < prevScrollPos) {
        callBack(state.chatOpenId);
      }

      prevScrollPos = scrollTop;
    });
  }

  scrollToBottom(id) {
    const chatContainer = document.querySelector(`.id${id}`);
    chatContainer.scrollTop = chatContainer.scrollHeight;
  }

  sendMessageHandler(callBack) {
    this.parentEl.addEventListener("submit", (event) => {
      event.preventDefault();
      const el = event.target;
      if (!el.classList.contains("input-container")) return;
      const {userid: SenderID, otheruserid: RecipientID} = el.dataset;
      const message = document.querySelector(".input");
      if (message?.value.length < 1) return;
      callBack({
        sender_id: SenderID,
        recipient_id: RecipientID,
        message: message.value,
        id: "",
        created: "",
        type: "message",
        typing: false,
      });
      this.#clearInput();
    });
  }

  updateOnlineStatusChat(data, id) {
    const chatOnlineIdicator = document.querySelector(".chat-indicator ");
    if (!chatOnlineIdicator) return;
    chatOnlineIdicator.classList.remove("online-indicator");
    if (data.has(id)) chatOnlineIdicator.classList.add("online-indicator");
  }

  renderMessage([data, currUserId], isScroll = false) {
    if (!data.length) return;

    const html = `${data.reduce(
      (acc, curr) =>
        (acc += `<div class="message">
            <div class="message-header ${
              curr.sender_id === currUserId ? "message-userTextalign" : ""
            } ">
              <span class="date"> ${curr.created} </span>
              <span class="username"> ${curr.username} </span>
            </div>
            <div class="${
              curr.sender_id === currUserId ? "message-userTextalign" : ""
            }">
              <span class="message-content ${
                curr.sender_id === currUserId
                  ? "message-content-current-user"
                  : ""
              }"> ${curr.message.replace(/\n/g, "<br>")} </span>
            </div>
          </div>`),
      ""
    )}`;

    document
      ?.querySelector(".message-container")
      ?.insertAdjacentHTML(`${isScroll ? "afterbegin" : "beforeend"}`, html);
  }

  generateMarkUp([data, user, currUserId, otherUserId, online]) {
    return ` 
    <button class="close-chat">
    <svg xmlns="http://www.w3.org/2000/svg" width="100" height="24" viewBox="0 0 24 24" class="close-icon">
    <line x1="8" y1="8" x2="16" y2="16" stroke="black" stroke-width="2"/>
    <line x1="8" y1="16" x2="16" y2="8" stroke="black" stroke-width="2"/>
</svg>
</button>
   <div class="user-card" >
   <div class="profile">
     <img src="http://localhost:8000/images/${user.Img}" alt="User profile">
     <div class=" chat-indicator ${online ? "online-indicator" : ""}"></div>
   </div>
   <div class="name" >
     ${user.FirstName} ${user.LastName}
   </div>
 </div>

 <div class="message-container id${otherUserId}">
      ${data?.reduce(
        (acc, curr) =>
          (acc += `
        <div class="message">
        <div class="message-header ${
          curr.sender_id === currUserId ? "message-userTextalign" : ""
        } ">
         <span  class="date"> ${curr.created} </span>
         <span  class="username"> ${curr.username} </span>
        </div>
        <div  class="${
          curr.sender_id === currUserId ? "message-userTextalign" : ""
        }">
        <span class="message-content ${
          curr.sender_id === currUserId ? "message-content-current-user" : ""
        } "> ${curr.message.replace(/\n/g, "<br>")} </span>
      </div>
        </div>
      
      `),
        ""
      )}
       </div>
       <div class="typing-indicator online-indicator-hidden">
       <span class="typing-indicator-span"></span>
       <span class="typing-indicator-span"></span>
       <span class="typing-indicator-span"></span>
   </div>
       <form class="input-container" data-userid="${currUserId}" data-otheruserid="${otherUserId}" >
       <input class="input" type="text" placeholder="Type your message...">
       <button type="submit">Send Raven</button>
   </form>


 
 `;
  }

  inputOninputHandler(callBack) {
    const input = document.querySelector(".input");
    input.addEventListener("input", () => {
      const form = input.closest(".input-container");
      const {otheruserid: id} = form.dataset;
      callBack(true, id);
      clearTimeout(this.timeout);
      this.timeout = setTimeout(() => {
        callBack(false, id);
      }, 2000);
    });
  }

  toggleTypingChat(isTyping) {
    const container = document.querySelector(`.chat-container.open`);
    if (!container) return;
    const indicator = container.querySelector(".typing-indicator");

    this.toggleTyping(isTyping, indicator);
  }
}

export default new ChatView();
