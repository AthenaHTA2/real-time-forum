let user;
let CurrentUser;
let receiver;
let LoginData;

let today = Date.now();
let date = new Date(today);

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
};

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
        successfulLogin();
        refreshPostsAfterLogin();
        chatEventHandler();
        return response.text();
      } else {
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

        let userData = JSON.parse(rsp);
        CurrentUser = userData.NickName;

        showProfile(userData)

        var successlogin = document.getElementById("current-user");
        successlogin.innerHTML =
          CurrentUser + " &#128512";
        // if (user) {
        //   var successlogin = document.getElementById("current-user");
        //   successlogin.innerHTML = " Welcome " + CurrentUser;
        // }
      }
      return;
    });
};

// print profile data in the left side navigation
const showProfile = (user) => {
  console.log("showProfile called", user)
  WelMsg = document.getElementById('WelMsg');
  FName = document.getElementById('firstName');
  LName = document.getElementById('lastName');
  NName = document.getElementById('nickName');
  Age = document.getElementById('age');
  Gender = document.getElementById('gender');
  Email = document.getElementById('email');

  console.log(user.Age, user.Gender, user.Email)
  WelMsg.innerHTML = "&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; " + user.NickName;

  FName.innerHTML = "First Name :" + user.FirstName;
  LName.innerHTML = "Last Name :" + user.LastName;
  NName.innerHTML = "Nick Name :" + user.NickName;
  Age.innerHTML = "Age :" + user.Age;
  Gender.innerHTML = "Gender :" + user.Gender;
  Email.innerHTML = "Email :" + user.Email;

};

//unhide the user profile aftert clicking the 'Profile' hyperlink
//in the left-hand-side navigation
const showHideUserProfile = () => {
  let profileBlock = document.querySelector("#profileMod");
  if (profileBlock.style.display === "none") {
    profileBlock.style.display = "block";
    document.getElementById("postBlock").style.display = "none";
    document.getElementById("postListAfterLogin").style.display = "none";
    document.getElementById("postList").style.display = "none";
  } else {
    profileBlock.style.display = "none";
    document.getElementById("postBlock").style.display = "block";
    document.getElementById("postListAfterLogin").style.display = "block";

  }
}

const refreshPostsAfterLogin = () => {
  fetch("/getPosts", {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    method: "POST",
  })
    .then((response) => {
      response.text().then(function (data) {
        let posts = JSON.parse(data);
        console.log("posts:", posts);
        //post shows all latest posts from database
        displayPostsAfterLog(posts);
      });
    })
    .catch((error) => {
      console.log(error);
    });
  

  const displayPostsAfterLog = (posts) => {
  
    postsContainer = document.querySelector("#postListAfterLogin");
    postsContainer.innerHTML = "";
    for (let i = posts.length - 1; i >= 0; i--) {
    
      postsContainer.innerHTML +=
        `
            <div class="posts" style.display ="inline-block" id=` +

        `>
         
            
            <p class="post-content" >` + "Author: " +  posts[i].Author + `</p>
            <p class="post-content" >` +  "Category: " + posts[i].PostCat + `</p>
            <p class="post-content" >` +  "Title: " + posts[i].PostTitl + ` </p>
            <p class="post-content" >` + "Content: " + posts[i].PostCont + `</p>
            <p class="post-content" >` + "Created: " + ConvertDate(posts[i].PostTime) + `</p> 

    
            <div  style.display="inline-block" &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; 
            &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;&nbsp; &nbsp; &nbsp;&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
            &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;

            <button class="button" id="ShowComments" onclick="ShowCommentsBlock(${posts[i].PostID}) ;" style.text-align="center">` +
            " &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;&nbsp; &nbsp; &nbsp;&nbsp; &nbsp; &nbsp;" +
            " &nbsp; &nbsp; &nbsp; &nbsp;" +
            " &nbsp; &nbsp; &nbsp; &nbsp;&nbsp; &nbsp; &nbsp;&nbsp; &nbsp;  &nbsp; &nbsp; &nbsp; &nbsp;&nbsp; &nbsp; &nbsp;&nbsp; &nbsp;  Show Comments" +
            `</button>
      </div>

      <div id="c${posts[i].PostID}" class="commentBlock" style='z-index: 1;', >
      <button class="button hideCommentBtn" id="button${posts[i].PostID}"  onclick= 'CloseComments(${posts[i].PostID}) ;'> ` + "Close" + `</button>
      /div>
            <br>  
            <br>  
            </div>
            </div> `;
    }
  };
};

const successfulLogin = () => {
  console.log("STATUS 200 OK");
  console.log("WERE ARE GETTING TO SUCCEDDFUL LOGIN FUNCTION");
  document.getElementById("wName").style.display = "block";
  document.getElementById("loginModal").style.display = "none";
  document.getElementById("LoggedOn").style.display = "block";
  document.getElementById("homePage").style.display = "none";
  document.getElementById("happyFace").style.display = "block";
  document.getElementById("addPost").style.display = "block";
  document.getElementById("login").style.display = "none";
  document.getElementById("register").style.display = "none";
  document.getElementById("welcomemsg").style.display = "none";
  // document.getElementById("Offline").style.display = "block";
  // document.getElementById("Online").style.display = "block";
  // document.getElementById("Messenger").style.display = "block";
  document.getElementById("current-user").style.display = "block";
  document.getElementById("logout").style.display = "block";
  document.getElementById("postBlock").style.display = "block";
  document.getElementById("postList").style.display = "none";
  document.getElementById("usersLog").style.display = "block";
  document.getElementById("profile").style.display = "block";
  document.getElementById("Select User").style.display = "block";

  setTimeout(() => {
    console.log("WERE ARE GETTING TO TIMEOUT LOGIN SIDE");
    document.getElementById("LoggedOn").style.display = "none";
    document.getElementById("happyFace").style.display = "none";
    document.getElementById("happyFace").style.display = "none";

  }, 1500);


  postBtn = document.querySelector("#postBlock > button");
  postBtn.style.visibility = "visible";
  document.querySelector(".loggedInUsers").style.display = "block";
  // document.getElementsByClassName('ShowComments').style.display = "none";
  // document.getElementsByClassName('commentBlock').style.display = "block";

  refreshPostsAfterLogin();
};

const unsuccessfullLogin = () => {
  console.log("failed - not status 200");

  document.getElementById("loginModal").style.display = "none";
  document.getElementById("logRejected").style.display = "block";
  setTimeout(() => {
    document.getElementById("logRejected").style.display = "none";
  }, 1500);
  document.getElementById("postList").style.display = "block";
  document.getElementById("postBlock").style.display = "none";

};

const Logout = () => {
  // document.querySelector(".loggedInUsers").style.visibility = "hidden";
  document.querySelector(".chat-private").style.visibility = "hidden";
  document.getElementById("current-user").style.display = "none";
  document.getElementById("postList").style.display = "block";
  document.getElementById("homePage").style.display = "block";
  document.getElementById("wName").style.display = "none";
  document.getElementById("usersLog").style.display = "none";

};

//remove cookie from browser when logout
function LogoutDeleteCookie(){
	let deleteCookie = GetCookie("user_session");
  console.log({deleteCookie})
  let objDeleteCookie = {
    toDelete: deleteCookie,
  }
  console.log({objDeleteCookie})
  let configLogout = {
    method: "POST",
    headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
    },
   body: JSON.stringify(objDeleteCookie)

};

fetch("/logout", configLogout)
.then(function (response) {
  console.log(response);
  if (response.status == 200) {
    console.log("successful logout");

  } else {
    console.log("unccessful logout");

  }
})
}

//
//
// ====================================================
window.onload = function () {
  refreshPosts();
  ChatReturn()
}

async function chatEventHandler() {
  var conn;
  //redundant code commented out by gowseny.
  var log = document.getElementById("log");
  var usersLog = document.getElementById("usersLog");

  console.log('++++++++++++++++++++++++++++++++++++++++++were are in async function')

  let configMsg = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  };

  // fetch messages from back end
  let messages = await fetch("/messagesAPI", configMsg);
  messages = await messages.json();

  // TODO: change section to display online and offline users
  function AppendUser(item) {
    var doScroll =
      usersLog.scrollTop > usersLog.scrollHeight - usersLog.clientHeight - 1;

    // if current user, do not display. (return) because AppendUser() is called in a loop.
    if (item.innerHTML === CurrentUser) {
      return;
    }

    usersLog.appendChild(item);
    if (doScroll) {
      usersLog.scrollTop = usersLog.scrollHeight - usersLog.clientHeight;
    }
    // opening private chat window on clicking on selected users
    item.onclick = () => {
      receiver = item.innerHTML;
      // Show main chat window
      let chat = document.querySelector(".chat-private");
      chat.style.visibility = "visible";

      let chatfriend = document.querySelector(".chat-title");
      chatfriend.innerHTML = "Messaging - " + receiver;

      // **filter** and append correct messages to chat window
      messages.forEach((message) => {

        // create new div for message
        let messageBubble = document.createElement("div");
        let dateDiv = document.createElement("div");
        dateDiv.className = "dateDiv";

        // 1. when current user is sender
        if (message.sender === CurrentUser && message.recipient === receiver) {

          // add class of sender
          messageBubble.className = "sender";

          messageBubble.innerText = `${"You"}: ${message.chatMessage}`;

          let bubbleWrapper = document.createElement("div");

          bubbleWrapper.className = "messageWrapper";

          dateDiv.innerHTML = `${ConvertDate(message.creationDate)}`;

          messageBubble.appendChild(dateDiv);

          bubbleWrapper.append(messageBubble);

          // append to child div of main chat window
          document.querySelector(".messages-content").append(bubbleWrapper);
        } else if (

          message.recipient === CurrentUser &&
          message.sender === receiver
        ) {

          // 2. when current user is recipient
          // add class of recipient
          messageBubble.className = "recipient";
          messageBubble.innerText = `${message.sender}: ${message.chatMessage}`;
          dateDiv.innerHTML = `${ConvertDate(message.creationDate)}`;
          messageBubble.appendChild(dateDiv);
          document.querySelector(".messages-content").append(messageBubble);
        }
      });
    };
  }

  // function to send message to backend to be stored into DB
  document.getElementById("msg-send-btn").onclick = function () {

    var msg = document.getElementById("msg");

    if (!conn) {
      console.log("no conn");
      return false;
    }

    if (!msg.value.trim()) {
      console.log("no msg value");
      return false;
    }

    // object to message to send to front end
    let message = {
      Sender: CurrentUser,
      Recipient: receiver,
      Content: msg.value.trim(),
      Date: newTime(date.toString()),
    };

    conn.send(JSON.stringify(message));
    msg.value = "";
    return false;

  };
  // websocket activity for chats
  if (window["WebSocket"]) {
    conn = new WebSocket("ws://" + document.location.host + "/ws");
    conn.onclose = function (evt) {
      var item = document.createElement("div");
      item.innerHTML = "<b>Connection closed.</b>";
      appendLog(item);
    };

    conn.onmessage = function (evt) {

      let msg = evt.data;

      if (IsJsonString(msg)) {
        msg = JSON.parse(msg);
      }

      let messageWrapper = document.createElement("div");
      messageWrapper.className = "messageWrapper";
      let newMessage = document.createElement("div");
      let dateDiv = document.createElement("div");
      dateDiv.className = "dateDiv";

      // formatting message
      if (CurrentUser === msg.Sender) {
        newMessage.className = "sender";
        newMessage.innerHTML = `${"You"}: ${msg.Content}`;
        dateDiv.innerHTML = `${msg.Date}`;
        newMessage.appendChild(dateDiv);
        messageWrapper.append(newMessage);
        document.querySelector(".messages-content").append(messageWrapper);
      } else if (CurrentUser !== msg.Sender) {
        newMessage.className = "recipient";
        newMessage.innerHTML = `${msg.Sender}: ${msg.Content}`;
        dateDiv.innerHTML = `${msg.Date}`;
        newMessage.appendChild(dateDiv);
        document.querySelector(".messages-content").append(newMessage);
      }

      var messages = evt.data.split("\n");

      for (var i = 0; i < messages.length; i++) {
        var item = document.createElement("div");

        item.innerText = messages[i];
        //if message is a list of chat members, it begins with a space
        if (messages[0] == " ") {
          if (i < messages.length) {
            if (messages[i].includes("-online")) {
              messages[i] = messages[i].replace("-online", "");
              item.className = "onlineUser";
            } else {
              item.className = "offlineUser";
            }
            item.innerText = messages[i];
            //print list inside 'usersLog' div
            AppendUser(item);
          }
        }
      }
    };
  } else {
    var item = document.createElement("div");
    item.innerHTML = "<b>Your browser does not support WebSockets.</b>";
    appendLog(item);
  }
}
function IsJsonString(str) {
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }
  return true;
}
