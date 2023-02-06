let LoginData;
let user;
let currentUser;
let receiver;

let today = Date.now();
let date = new Date(today);

const logform = document.querySelector("#loginform");
let userName = logform.querySelector("#LUserName");
let Lpassword = logform.querySelector("#LPassW");

function setLoginErrorFor(input, message) {
  const loginFormControl = input.parentElement; // .login-form-control
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

// TODO: change from window.onload to start after logging in and exit on log-out
async function chatEventHandler() {
  var conn;
  // var pst = document.getElementById("postList");

  // TODO: change to fit in new details
  var log = document.getElementById("log");
  var usersLog = document.getElementById("usersLog");

  /*
  function appendLog(item) {
    let doScroll;
    console.log(item);
    if (log && log.scrollTop) {
      doScroll = log.scrollTop > log.scrollHeight - log.clientHeight - 1;
      log.appendChild(item);
    }
    if (doScroll) {
      log.scrollTop = log.scrollHeight - log.clientHeight;
    }
  }*/

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
    /*if(item.innerText == "UsersList"){
            item.innerText = " "
        }else{
            item.innerText = item.innerText
        }*/
    var doScroll =
      usersLog.scrollTop > usersLog.scrollHeight - usersLog.clientHeight - 1;
    item.style.color = "white";
    console.log(item);

    // if current user, do not display. (return) because AppendUser() is called in a loop.
    if (item.innerHTML === currentUser) {
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

        // messageBubble.className = "messages-content message"

        // 1. when current user is sender
        if (message.sender === currentUser && message.recipient === receiver) {
          // add class of sender
          messageBubble.className = "sender";

          // append message to div
          messageBubble.innerText = `${"You"}: ${message.chatMessage}`;
          let bubbleWrapper = document.createElement("div");
          bubbleWrapper.className = "messageWrapper";
          dateDiv.innerHTML = `${ConvertDate(message.creationDate)}`;
          messageBubble.appendChild(dateDiv);
          bubbleWrapper.append(messageBubble);
          // bubbleWrapper.appendChild(dateDiv);
          // append to child div of main chat window
          document.querySelector(".messages-content").append(bubbleWrapper);
        } else if (
          message.recipient === currentUser &&
          message.sender === receiver
        ) {
          // 2. when current user is recipient
          // add class of recipient
          messageBubble.className = "recipient";

          // append message to div
          messageBubble.innerText = `${message.sender}: ${message.chatMessage}`;
          dateDiv.innerHTML = `${ConvertDate(message.creationDate)}`;
          messageBubble.appendChild(dateDiv);
          // bubbleWrapper.append(messageBubble);
          // bubbleWrapper.append(dateDiv);

          // append to child div of main chat window
          document.querySelector(".messages-content").append(messageBubble);
        }
      });
    };
  }

  // function to send message to backend to be stored into DB
  document.getElementById("msg-send-btn").onclick = function () {
    var msg = document.getElementById("msg");
    // console.log("checking send button");
    // console.log(msg);
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
      Sender: currentUser,
      Recipient: receiver,
      Content: msg.value.trim(),
      Date: newTime(date.toString()),
    };

    console.log("message.time: ", newTime(date.toString()));

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
      // console.log("CURRENT USER!!!!", currentUser, msg);

      let messageWrapper = document.createElement("div");
      messageWrapper.className = "messageWrapper";
      let newMessage = document.createElement("div");
      let dateDiv = document.createElement("div");
      dateDiv.className = "dateDiv";

      // formatting message
      if (currentUser === msg.Sender) {
        newMessage.className = "sender";
        newMessage.innerHTML = `${"You"}: ${msg.Content}`;
        dateDiv.innerHTML = `${msg.Date}`;
        newMessage.appendChild(dateDiv);
        messageWrapper.append(newMessage);
        // messageWrapper.appendChild(dateDiv);

        document.querySelector(".messages-content").append(messageWrapper);
      } else if (currentUser !== msg.Sender) {
        // let messageWrapper = document.createElement("div");
        // messageWrapper.className = "messageWrapper";
        // let newMessage = document.createElement("div");
        // let dateDiv = document.createElement("div")
        // dateDiv.className = "dateDiv"
        newMessage.className = "recipient";
        newMessage.innerHTML = `${msg.Sender}: ${msg.Content}`;
        dateDiv.innerHTML = `${msg.Date}`;
        newMessage.appendChild(dateDiv);

        document.querySelector(".messages-content").append(newMessage);
      }

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
        }
        //the list of posts starts with a double space
        // } else if (messages[0] == "  ") {
        //   //print all posts
        //   item.innerText = messages[i];
        //   //append posts inside in the main window
        //   AppendPosts(item);
        // } else {
        //   //print list inside 'log' div
        //   // appendLog(item);
        // }
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

// Converts JS time stamp into a string, used when displaying posts
const ConvertDate = (date) => {
  // Seperate year, day, hour and minutes into vars
  let yyyy = date.slice(0, 4);
  let dd = date.slice(8, 10);
  let hh = date.slice(11, 13);
  let mm = date.slice(14, 16);
  // Get int for day of the week (0-6, Sunday-Saturday)
  const d = new Date(date);
  let dayInt = d.getDay();
  let day = "";
  switch (dayInt) {
    case 0:
      day = "Sunday";
      break;
    case 1:
      day = "Monday";
      break;
    case 2:
      day = "Tuesday";
      break;
    case 3:
      day = "Wednesday";
      break;
    case 4:
      day = "Thursday";
      break;
    case 5:
      day = "Friday";
      break;
    case 6:
      day = "Saturday";
      break;
  }
  // Get int for month (0-11, January-December)
  let monthInt = d.getMonth();
  let month = "";
  switch (monthInt) {
    case 0:
      month = "January";
      break;
    case 1:
      month = "February";
      break;
    case 2:
      month = "March";
      break;
    case 3:
      month = "April";
      break;
    case 4:
      month = "May";
      break;
    case 5:
      month = "June";
      break;
    case 6:
      month = "July";
      break;
    case 7:
      month = "August";
      break;
    case 8:
      month = "September";
      break;
    case 9:
      month = "October";
      break;
    case 10:
      month = "November";
      break;
    case 11:
      month = "December";
      break;
  }
  fullDate =
    day + ", " + dd + " " + month + ", " + yyyy + " @ " + hh + ":" + mm;
  return fullDate;
};

function newTime(date) {
  let dateArray = date.split(" ");
  let newDate;
  const days = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];
  const daysShort = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const monthsShort = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  for (let i = 0; i < days.length; i++) {
    if (dateArray[0] == daysShort[i]) {
      newDate = days[i];
    }
  }
  newDate += ", " + dateArray[2];
  for (let i = 0; i < months.length; i++) {
    if (dateArray[1] == monthsShort[i]) {
      newDate += " " + months[i] + ", ";
    }
  }
  newDate += dateArray[3] + " @ ";
  let hour = dateArray[4].split(":");
  newDate += hour[0] + ":" + hour[1];
  return newDate;
}
