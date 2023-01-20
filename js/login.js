let LoginData;
let user;
let currentUser;
let receiver;

const logform = document.querySelector("#loginform");
let userName = logform.querySelector("#LUserName");
let Lpassword = logform.querySelector("#LPassW");

function setLoginErrorFor(input, message) {
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
    UserName: UserName,
    LoginPw: LoginPw,
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

  fetch("http://localhost:8080/login", configLogin)
    .then(function (response) {
      console.log(response);
      if (response.status == 200) {
        console.log("successful login");
        successfulLogin();
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
        console.log(rsp);
        currentUser = rsp;
        var successlogin = document.getElementById("current-user");
        successlogin.innerHTML = " Hello " + currentUser + " &#128512";

        // if (user) {
        //   var successlogin = document.getElementById("current-user");
        //   successlogin.innerHTML = " Welcome " + currentUser;
        // }
      }
      return;
    });
};


function successfulLogin() {
  console.log("success - status 200");

  document.getElementById("loginModal").style.display = "none";
  document.getElementById("LoggedOn").style.display = "block";

  setTimeout(() => {
    document.getElementById("LoggedOn").style.display = "none";
  }, 1500);

  document.getElementById("postBlock").style.display = "flex";

  document.getElementById("logout").style.display = "block";

  postBtn = document.querySelector("#postBlock > button");
  postBtn.style.visibility = "visible";
  document.querySelector(".loggedInUsers").style.display = "block";
  // document.querySelector("#formChat").style.visibility = "visible";
}

function unsuccessfulLogin() {
  console.log("failed - not status 200");

  document.getElementById("loginModal").style.display = "none";
  document.getElementById("regRejected").style.display = "block";

  setTimeout(() => {
    document.getElementById("regRejected").style.display = "none";
  }, 1500);

  document.getElementById("postBlock").style.display = "flex";
}

function Logout() {
  document.querySelector(".loggedInUsers").style.visibility = "hidden";
  document.querySelector(".chat-private").style.visibility = "hidden";
  console.log(document.cookie);
}
//
//
// ====================================================

window.onload = function () {
  var conn;
  var pst = document.getElementById("postList");

  var log = document.getElementById("log");
  var usersLog = document.getElementById("usersLog");

  function appendLog(item) {
    var doScroll = log.scrollTop > log.scrollHeight - log.clientHeight - 1;
    log.appendChild(item);
    if (doScroll) {
      log.scrollTop = log.scrollHeight - log.clientHeight;
    }
  }

  function AppendUser(item) {
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
