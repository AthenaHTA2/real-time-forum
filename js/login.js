let UserNickName;
let user;
let currentUser;
let receiver;
let LoginData;
let expandPost

const logform = document.querySelector("#loginform");
let userName = logform.querySelector("#LUserName");
let Lpassword = logform.querySelector("#LPassW");

const setLoginErrorFor = (input, message) => {
  const loginFormControl = input.parentElement; // .reg-form-control
  const small = loginFormControl.querySelector("small");
  // add the error class
  loginFormControl.className = "login-form-control error";
  // all the error message inside the small tag
  small.innerHTML = message;
  // small.style.visibilty = "visible";
}

//send user input in the 'Login' form to the 'LoginData' struct in go
// via the 'LoginHandler' handler function in go
const LoginBtn = document.querySelector("#loginBtn");

//console.log("loginBtn id:", LoginBtn.getAttribute("style"))
LoginBtn.onclick = (e) => {
  //stop browser refreshing
  e.preventDefault();
  let UserName = document.querySelector("#LUserName").value;
  let LoginPw = document.querySelector("#LPassW").value;
  
  //make JS object to store login data
  LoginData = {
    LUserName: UserName,
    LPassW: LoginPw,
  };

  console.log({ LoginData });
  //Sending Login form's data with the Fetch API
  //to the 'LoginData' struct in go
  
  let configLogin = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(LoginData),
  };
  
  

  fetch("/login", configLogin)
    .then(function (response) {
      console.log(response);
      if (response.status == 200) {
        console.log("successful login");
        successfulLogin()
        // HS removed this // refreshPosts();
       return response.text();
      } else {
        unsuccessfullLogin();
       return response.text();
      }
    })
    .then((rsp) => {
      if (
        rsp ==
        "ERROR: This username/email doesnt exist, please register to enter this forum"
      ) {
        console.log("on track 1");
        setLoginErrorFor(
          userName,
          "This Username/Email does not exist, please register to enter this forum"
        );
      } else if (rsp == "ERROR: please enter correct password") {
        console.log("on track 2");
        setLoginErrorFor(Lpassword, "Please enter correct password");
      } else {
        let userDetails = JSON.parse(rsp);
        console.log("The user's profile: ----->", userDetails);
        showProfile(userDetails)
        currentUser = userDetails.NickName;
        //to show current user name in comment box, 
        //and to determine if posts should show comments when clicked
        UserNickName = userDetails.NickName;
        var successlogin = document.getElementById("current-user");
        successlogin.innerHTML = " 𝕎𝔼𝕃ℂ𝕆𝕄𝔼 " + currentUser + " &#128512";
        // if (user) {
        //   var successlogin = document.getElementById("current-user");
        //   successlogin.innerHTML = " Welcome " + currentUser;
        // }
      }
    });
};

//print profile data in the left side navigation
function showProfile(user) {
  console.log("showProfile called", user)
  nameContainer = document.querySelector("#current-user")
  nameContainer.innerHTML = "";
  nameContainer.innerHTML = `<p>`+"Welcome " +user.NickName+"!"+ " &#128512"+`</p>`
  profileContainer = document.querySelector("#userProfile")
  profileContainer.innerHTML = "";

  profileContainer.innerHTML = `
    <div class ="loggedUserProfile" style="display: none;">
    <br>
    <br>
    <br>
    <h2 ><u>Profile</u></h2>
    <p >`+ "First Name: " + user.FirstName + `</p>
    <p >`+ "Last Name: " + user.LastName + `</p>
    <p >`+ "Nickname: " + user.NickName + `</p>
    <p >`+ "Gender: " + user.Gender + `</p>
    <p >`+ "Email: " + user.Email + `</p>
    <p >`+ "Age: " + user.Age + `</p>
    </div>
    `
}

//unhide the user profile aftert clicking the 'Profile' hyperlink
//in the left-hand-side navigation
function showHideUserProfile(){
  let profileBlock = document.querySelector(".loggedUserProfile");
  if (profileBlock.style.display === "none") {
    profileBlock.style.display = "block";
  } else {
    profileBlock.style.display = "none";
  }
}





const successfulLogin = () => {
  console.log("STATUS 200 OK");
  console.log("WERE ARE GETTING TO SUCCEDDFUL LOGIN FUNCTION");
  document.getElementById("loginModal").style.display = "none";
  document.getElementById("LoggedOn").style.display = "block";
  document.getElementById("happyFace").style.display = "block";
  document.getElementById("addPost").style.display = "block";
  document.getElementById("login").style.display = "none";
  document.getElementById("register").style.display = "none";
  document.getElementById("welcomemsg").style.display = "none";
  document.getElementById("Offline").style.display = "block";
  document.getElementById("Online").style.display = "block";
  document.getElementById("Messenger").style.display = "block";
  document.getElementById("current-user").style.display = "block";
  document.getElementById("logout").style.display = "block";
  document.getElementById("postBlock").style.display = "block";
  //document.getElementById("postList").style.display = "none";
  document.getElementById("usersLog").style.display = "block";
  document.getElementById("profile").style.display = "block";

  setTimeout(() => {
    console.log("WERE ARE GETTING TO TIMEOUT LOGIN SIDE");
    document.getElementById("LoggedOn").style.display = "none";
    document.getElementById("happyFace").style.display = "none";
  }, 1500);

  postBtn = document.querySelector("#postBlock > button");
  postBtn.style.visibility = "visible";
  document.querySelector(".loggedInUsers").style.display = "block";
  // document.getElementsByClassName('ShowComments').style.display = "none";
  // document.getElementsByClassName('commentBlock').style.display = "block";

  //HTA taken out this //refreshPostsAfterLogin();
  refreshPosts()
  showPost();
  showAddComment()//HTA added. This displays post comment fields and buttons

};

const unsuccessfullLogin = () => {
    
    console.log("failed - not status 200")

    document.getElementById('loginModal').style.display = "none";
    document.getElementById('logRejected').style.display = 'block';
    setTimeout(() => {
        document.getElementById('logRejected').style.display = 'none';
      },1500);
    document.getElementById('postBlock').style.display = 'flex';
}

const Logout = () => {
  console.log("===== Logout called ======")
  document.querySelector(".loggedInUsers").style.visibility = "hidden";
  document.querySelector(".chat-private").style.visibility = "hidden";
  document.getElementById('current-user').style.display ="none"; 
  refreshPosts()
  hideAddComment();
  console.log(document.cookie);
  //show posts without comments
  
}

/* the logout functionality in the client-side  
we handle the logout button click event by sending an
 HTTP request to the server to invalidate the user's session
 we use the fetch API to send a post request to the logout route on the server. 
 The request includes the session cookie, which the server will use to look up the user's session 
 data and delete it. This logs the user out of the real time forum.
*/

const logoutBtn = function logoutUser() {
  // Declare a variable "cookie" and assign it the value of the current cookie
  let cookie = document.cookie;
  
  // Declare a variable "username" and assign it the first element of the array returned by splitting the cookie string at the "=" character
  let username = cookie.split("=")[0];
  
  // Log the value of the "username" variable to the console
  console.log(username);
  
  // Declare an object "logoutData" with a property "ok" set to an empty string
  let logoutData = {
  ok: ""
  };
  
  // Set the value of the "ok" property of the "logoutData" object to the value of the "username" variable
  logoutData.ok = username;
  
  // Declare an object "options" with properties "method", "headers" and "body"
  let options = {
  method: "POST",
  headers: {
  "Content-Type": "application/json"
  },
  body: JSON.stringify(logoutData)
  };
  
  // Declare a variable "fetchRes" and assign it the result of a fetch call to the "/logout" endpoint with the "options" object passed as options
  let fetchRes = fetch("http://localhost:8080/logout", options);
  
  // Handle the response of the fetch call
  fetchRes
  .then((response) => {
  // Check if the response status is 200
  if (response.status === 200) {
  console.log("ok");
  }
  // Parse the response as json
  return response.json();
  })
  .then(function (data) {
  // Check if the "LoggedIn" property of the "User" object in the data is equal to "false"
  if (data.User.LoggedIn === "false") {
  // hide main section of the page
  document.querySelector("main").style.display = "none";
  // show login section of the page
  document.querySelector(".auth-container").style.display = "flex";
  
      // showRegistrationUI()
      notyf.success("Succesfully logged out.");
    }
  })
  .catch(function (err) {
    console.log(err);
  });
// Close the socket connection
socket.close();
};


// ====================================================
window.onload = function () {
  refreshPosts();//HTA: this is the equivalent of the command in my file home.html line 162.
  var conn;
  // var pst = document.getElementById("postList");
  var log = document.getElementById("log");
  var usersLog = document.getElementById("usersLog");

  const appendLog = (item) => {
    var doScroll = log.scrollTop > log.scrollHeight - log.clientHeight - 1;
    log.appendChild(item);
    if (doScroll) {
      log.scrollTop = log.scrollHeight - log.clientHeight;
    }
  }
  
    const AppendUser = (item) => {
    /*if(item.innerText == "UsersList"){
            item.innerText = " "
        }else{
            item.innerText = item.innerText
        }*/
    var doScroll =
      usersLog.scrollTop > usersLog.scrollHeight - usersLog.clientHeight - 1;
    item.style.color = "white";
    console.log(item);
    usersLog.appendChild(item);

    if (doScroll) {
      usersLog.scrollTop = usersLog.scrollHeight - usersLog.clientHeight;
    }
    item.onclick = () => {
      console.log(item.innerHTML);
      receiver = item.innerHTML;
      document.querySelector(".chat-private").style.visibility = "visible";
    };
  }

  document.getElementById("chat-private-btn").onclick = function () {
    var msg = document.getElementById("msg");
    console.log("checking send button");
    console.log(msg);
    if (!conn) {
      console.log("no conn");
      return false;
    }
    if (!msg.value.trim()) {
      console.log("no msg value");
      return false;
    }
    let message = {
      Sender: currentUser,
      Recipient: receiver,
      Content: msg.value.trim(),
    };
    conn.send(JSON.stringify(message));
    msg.value = "";
    return false;
  };

  if (window["WebSocket"]) {
    conn = new WebSocket("ws://" + document.location.host + "/ws");
    conn.onclose = function (evt) {
      var item = document.createElement("div");
      item.innerHTML = "<b>Connection closed.</b>";
      appendLog(item);
    };
    conn.onmessage = function (evt) {
      var messages = evt.data.split("\n");
      for (var i = 0; i < messages.length; i++) {
        var item = document.createElement("div");
        item.style.color = "#80ed99";
        item.innerText = messages[i];
        //if message is a list of chat members, it begins with a space
        if (messages[0] == " ") {
          if (i < messages.length) {
            item.innerText = messages[i];
            //print list inside 'usersLog' div
            AppendUser(item);
          }
          //the list of posts starts with a double space
        } else if (messages[0] == "  ") {
          //print all posts
          item.innerText = messages[i];
          //append posts inside in the main window
          AppendPosts(item);
        } else {
          //print list inside 'log' div
          appendLog(item);
        }
      }
    };

  } else {
    var item = document.createElement("div");
    item.innerHTML = "<b>Your browser does not support WebSockets.</b>";
    appendLog(item);
  }
};

//HTA: to show comments' input texts and buttons
function showAddComment(){
  //console.log("called showAddComment---->")
  let commentLable = document.getElementsByClassName("commentLabel");
  let addCommentField = document.getElementsByClassName("comment-content");
  let addCommentBtnClass = document.getElementsByClassName("commentBtn");
  //console.log("commentLable selected? ---->", commentLable)
  //console.log("addCommentField selected? ---->", addCommentField)
  console.log("addCommentBtnClass selected? ---->", addCommentBtnClass)
  for(let i = 0; i< commentLable.length; i++){
    commentLable[i].style.display = "block";
    addCommentBtnClass[i].style.display = "block";
    addCommentField[i].style.display = "block";
  }

}

//HTA: to hide comments' input texts and buttons after logout
function hideAddComment(){
  //console.log("called hideAddComment---->")
  let commentLable = document.getElementsByClassName("commentLabel");
  let addCommentField = document.getElementsByClassName("comment-content");
  let addCommentBtnClass = document.getElementsByClassName("commentBtn");
  for(let i = 0; i< commentLable.length; i++){
    commentLable[i].style.display = "none";
    addCommentBtnClass[i].style.display = "none";
    addCommentField[i].style.display = "none";
  }

}
