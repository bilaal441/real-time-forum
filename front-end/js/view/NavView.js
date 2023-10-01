import View from "./view.js";

class NavView extends View {
  parentEl = document.querySelector(".nav");

  hidde() {
    this.parentEl.classList.add("hidden");
  }
  generateMarkUp(data) {
    this.parentEl.classList.remove("hidden");
    return `<div class="container">
   <div class="nav-container">
     <div class="logo">
       <a href="#">⌛ Realtime </a>
     </div>
     <div>
       <input
         type="checkbox"
         id="hamburger-toggle"
         class="hamburger-toggle"
       />
       <label for="hamburger-toggle" class="hamburger-icon">
         <span></span>
         <span></span>
         <span></span>
       </label>
       <div class="nav-bar">
         <ul class="menu-items">
           <li><button class="logout" type="button">☠️ Logout</button></li>
           <li><span>🦜 ${data.username}</span></li>
         </ul>
       </div>
     </div>
   </div>
 </div>`;
  }

  logoutHandler(callBack) {
    this.parentEl.addEventListener("click", (e) => {
      const el = e.target;
      if (el.classList.contains("logout")) {
        callBack();
      }
    });
  }
}

export default new NavView();
