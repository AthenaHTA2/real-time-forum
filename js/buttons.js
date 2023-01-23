//This is our functions to open the links for our buttons

//This function opens Login Modal
const openLogin = () => {
  closePost();
  document.getElementById("postedArticles").style.display = "none";
  document.getElementById("loginModal").style.display = "block";
  document.getElementById("regModal").style.display = "none";
  document.getElementById("regConfirmed").style.display = "none";
  // document.getElementById("profileMod").style.display = "none";
};

//this function open Registration Modal
const openReg = () => {
  closePost();
  document.getElementById("postedArticles").style.display = "none";
  // document.getElementById("profileMod").style.display = "none";
  document.getElementById("loginModal").style.display = "none";
  document.getElementById("regModal").style.display = "block";
  document.getElementById("regConfirmed").style.display = "none";
};

//this function is for the cancel buttons
const closeBtn = () => {
  document.getElementById("postBlock").style.display = "flex";
  document.getElementById("regConfirmed").style.display = "none";
  // document.getElementById("profileMod").style.display = "none";
  document.getElementById("postedArticles").style.display = "none";
};

//this function is to make posts not visible where needed
const closePost = () => {
  document.getElementById("postBlock").style.display = "none";
  document.getElementById("regConfirmed").style.display = "none";
  // document.getElementById("profileMod").style.display = "none";
  document.getElementById("postedArticles").style.display = "none";
};

//this function is for the log out button
const logOut = document.querySelector("#logout");

logOut.onclick = (e) => {
  e.preventDefault();
  document.getElementById("postedArticles").style.display = "none";
  // document.getElementById("profileMod").style.display = "none";
  document.getElementById("logout").style.display = "none";
  document.getElementById("LoggedOut").style.display = "block";
  document.getElementById("byeFace").style.display = "block";
  document.getElementById("addPost").style.display = "none";
  document.getElementById("login").style.display = "block";
  document.getElementById("register").style.display = "block";
  document.getElementById("Messenger").style.display = "none";
  document.getElementById("Users").style.display = "none";
  document.getElementById("Online").style.display = "none";
  document.getElementById("Offline").style.display = "none";
  document.getElementById("welcomemsg").style.display = "block";

  setTimeout(() => {
    document.getElementById("LoggedOut").style.display = "none";
    document.getElementById("byeFace").style.display = "none";
  }, 1500);
};

//this function is to show the user profile
// const profileBtn = document.querySelector("#profile");

// profileBtn.onclick = (e) => {
//   e.preventDefault();
//   const showProfile = (user) => {

//     document.getElementByclass("profileMod").style.display = "block";

//     profileMod.innerHTML = "";

//     profileMod.innerHTML +=
//       `
      
//       <div class="profModal">
//           <br>
//           <br>
//           <br>
//           <br>
//           <br>
//           <h2>🆄🆂🅴🆁-🅿🆁🅾🅵🅸🅻🅴</h2>
//           <p> ` +
//       "FirstName: " +
//       user.FirstName +
//       `</p>
//           <p> ` +
//       "LastName: " +
//       user.LastName +
//       `</p>
//           <p> ` +
//       "NickName: " +
//       user.NickName +
//       `</p>
//           <p> ` +
//       "Gender: " +
//       user.Gender +
//       `</p>
//           <p> ` +
//       "Email: " +
//       user.Email +
//       `</p>
//           <p> ` +
//       "Age: " +
//       user.Age +
//       `</p>
//       </div>
//       `;
//   };

//   document.getElementById("postedArticles").style.display = "none";
//   document.getElementById("postBlock").style.display = "none";
//   document.getElementById("profileMod").style.display = "block";
//   document.getElementById("regModal").style.display = "none";
//   document.getElementById("loginModal").style.display = "none";
// };

//this function is for to open the post where needed
const openPosts = () => {
  document.getElementById("postBlock").style.display = "block";
  // document.getElementById("profileMod").style.display = "none";
  document.getElementById("regModal").style.display = "none";
  document.getElementById("loginModal").style.display = "none";
  // document.getElementById("postedAritcles").style.display.visibility = "visible";
};
