//This is our functions to open the links for our buttons
function openLogin() {
  closePost();
  document.getElementById("loginModal").style.display = "block";
  document.getElementById("regModal").style.display = "none";
  document.getElementById("regConfirmed").style.display = "none";
}
function openReg() {
  closePost();
  document.getElementById("loginModal").style.display = "none";
  document.getElementById("regModal").style.display = "block";
  document.getElementById("regConfirmed").style.display = "none";
}
function closeBtn() {
  document.getElementById("postBlock").style.display = "flex";
  document.getElementById("regConfirmed").style.display = "none";
}
function closePost() {
  document.getElementById("postBlock").style.display = "none";
  document.getElementById("regConfirmed").style.display = "none";
}


function ChatReturn() {
  document.querySelector(".chat-private").style.visibility = "hidden";
}
