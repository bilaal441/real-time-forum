import View from "./view.js";

class OnlineUsers extends View {
  parentEl = document.querySelector(".users-container");
  chatContainer = document.querySelector(".chat-container");

  handleUserCardClick(callBack) {
    this.parentEl.addEventListener("click", (event) => {
      const userCard = event.target.closest("#user-card");
      const isOnline = userCard
        .querySelector(".indicator")
        ?.classList.contains("online-indicator");
      if (!userCard) return;
      this.chatContainer.classList.add("open");
      const userId = userCard.dataset.userid;
      this.parentEl.classList.add("hidden");
      callBack(userId, isOnline);
    });
  }

  updateOnlineStatusUsers(data) {
    // console.log(data, "data pass to online status");
    document.querySelectorAll(".user-card").forEach((el) => {
      el.querySelector(`.indicator`)?.classList.remove("online-indicator");
    });

    data.forEach((el) => {
      const userCard = document.querySelector(`[data-userid="${el}"]`);
      userCard?.querySelector(".indicator")?.classList.add("online-indicator");
    });
  }

  generateMarkUp(data) {
    return data?.reduce(
      (acc, curr) =>
        (acc += `
        <div class="user-card-container">
   <div class="user-card " id="user-card"  data-userid="${curr.Id}">
     <div class="profile">
       <img src="http://localhost:8000/images/${curr.Img}" alt="User profile">
       <div class="indicator  "></div>
     </div>
     <div class="name">
       ${curr.FirstName} ${curr.LastName}
     </div>
   </div>

   <div class="user-notification-container">
    <span>  <
   
   </div>
   <div class="user-typing-container hidden">
   <span>Typing...</span>
   <div class="user-typing">
   <span class="typing-indicator-span"></span>
   <span class="typing-indicator-span"></span>
   <span class="typing-indicator-span"></span>
   </div>
   </div>
   
   </div>
   `),
      ""
    );
  }

  toggleTypingUsers(id, isTyping) {
    const userCard = document.querySelector(`[data-userid="${id}"]`);
    const indicator = userCard?.nextElementSibling;
    this.toggleTyping(isTyping, indicator, "hidden");
  }
}

export default new OnlineUsers();
