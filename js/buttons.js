//This is our functions to open the links for our buttons

//This function opens Login Modal
const openLogin = () => {
  closePost();
  document.getElementById("loginModal").style.display = "block";
  document.getElementById("regModal").style.display = "none";
  document.getElementById("postList").style.display = "none";
  document.getElementById("regConfirmed").style.display = "none";
};

//this function open Registration Modal
const openReg = () => {
  closePost();
  document.getElementById("postList").style.display = "none";
  document.getElementById("loginModal").style.display = "none";
  document.getElementById("regModal").style.display = "block";
  document.getElementById("regConfirmed").style.display = "none";
};

//this function is for the cancel buttons
const closeBtn = () => {
  document.getElementById("postList").style.display = "block";
  document.getElementById("regConfirmed").style.display = "none";
};

//this function is to make posts not visible where needed
const closePost = () => {
  document.getElementById("postList").style.display = "none";
  document.getElementById("regConfirmed").style.display = "none";
};

//this function is to show posts after login
const showPost = () => {
  document.getElementById("postList").style.display = "block";
  
};

//this function is for the log out button
// const logOut = document.querySelector("#logout");

document.getElementById('logout').onclick = (e) => {
  e.preventDefault();
  document.getElementById("postBlock").style.display = "none";
  document.getElementById("logout").style.display = "none";
  document.getElementById("LoggedOut").style.display = "block";
  document.getElementById("byeFace").style.display = "block";
  document.getElementById("addPost").style.display = "none";
  document.getElementById("login").style.display = "block";
  document.getElementById("register").style.display = "block";
  document.getElementById("Messenger").style.display = "none";
  document.getElementById("usersLog").style.display = "none";
  document.getElementById("Online").style.display = "none";
  document.getElementById("Offline").style.display = "none";
  document.getElementById("welcomemsg").style.display = "block";
  //HTA removed as returned error in browser //expandPost.style.display = "none";
  Logout() //added here as it did not get called from home.html line 35

  setTimeout(() => {
    console.log('SETTIMEOUT WORKS WITH LOGOUT BUTTON WE ARE GETTING HERE')
    document.getElementById("LoggedOut").style.display = "none";
    document.getElementById("byeFace").style.display = "none";
  }, 1500);
  //hide user's profile data and the profile link
  document.querySelector(".loggedUserProfile").style.display = "none";
  document.getElementById("profile").style.display = "none";
  LogoutDeleteCookie()
  hideAddComment()
};

function ChatReturn() {
  document.querySelector(".chat-private").style.visibility = "hidden";
  //hide comment lable, input text and button from posts
  Logout ()
}
