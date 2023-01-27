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
  let chat = document.querySelector(".chat-private");
  chat.style.visibility = "hidden";
  document.querySelector(".messages-content").innerHTML = "";
}

profileBtn.onclick = (e) => {
e.preventDefault();
//hide other elements
document.querySelector("#postedArticles").classList.add('hidden');
document.querySelector("#postBlock").classList.add('hidden');
document.querySelector("#regModal").classList.add('hidden');
document.querySelector("#loginModal").classList.add('hidden');

//show the profile modal
document.querySelector("#profileMod").classList.remove('hidden');
// update the text content of the placeholders in the template
document.querySelector("#FirstName").textContent = user.FirstName;
document.querySelector("#LastName").textContent = user.LastName;
document.querySelector("#NickName").textContent = user.NickName;
document.querySelector("#Gender").textContent = user.Gender;
document.querySelector("#Email").textContent = user.Email;
document.querySelector("#Age").textContent = user.Age;
};

//this function is for to open the post where needed
const openPosts = () => {
//hide other elements
document.querySelector("#profileMod").classList.add('hidden');
document.querySelector("#regModal").classList.add('hidden');
document.getElementById("postBlock").style.display = "block";
document.getElementById("profileMod").style.display = "none";
document.getElementById("regModal").style.display = "none";
document.getElementById("loginModal").style.display = "none";
document.getElementById("postedAritcles").style.display = "block";
};