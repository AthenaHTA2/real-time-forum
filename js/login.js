let LoginData;
let user;
let CurrentUser;
let CurUserNoti;
let notifdiv;
let today = Date.now();
let date = new Date(today);

// Create an instance of Notyf
var notyf = new Notyf();

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
        notyf.success("Logged in");
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

        let userData = JSON.parse(rsp);
        console.log(userData);
        CurrentUser = userData.NickName;
        CurUserNoti = userData.Notifications;

        var successlogin = document.getElementById("current-user");
        successlogin.innerHTML = " Hello " + CurrentUser + " &#128512";

        // if (user) {
        //   var successlogin = document.getElementById("current-user");
        //   successlogin.innerHTML = " Welcome " + CurrentUser;
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

const Logout = () => {
  document.querySelector(".loggedInUsers").style.visibility = "hidden";
  document.querySelector(".chat-private").style.visibility = "hidden";
  document.getElementById("current-user").style.display = "none";
  document.getElementById("postList").style.display = "block";
  console.log(document.cookie);
};
//remove cookie from browser when logout
function LogoutDeleteCookie() {
  let deleteCookie = GetCookie("user_session");
  console.log({ deleteCookie });
  let objDeleteCookie = {
    toDelete: deleteCookie,
  };
  console.log({ objDeleteCookie });
  let configLogout = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(objDeleteCookie),
  };
  fetch("/logout", configLogout).then(function (response) {
    console.log(response);
    if (response.status == 200) {
      console.log("successful logout");
    } else {
      console.log("unccessful logout");
    }
  });
}
// ===================================================================
//                              CHATS
// ===================================================================
async function chatEventHandler() {
  var conn;
  var log = document.getElementById("log");
  var usersLog = document.getElementById("usersLog");

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

  // TODO: 1. NOTIFICATIONS : ADD (add notifictions if user is online but chat is not open, or user is offline),
  // TODO:                    DISPLAY(check notification, get notication),
  // TODO:                    DELETE(remove notification)
  // TODO: 2. using THROTTLE / DEBOUNCE on scrolling event to display 10 message in reverse order
  // TODO: 3. arrange users with chat(according to most recent descending order)
  function AppendUser(item) {
    console.log(item.innerHTML);
    var doScroll =
      usersLog.scrollTop > usersLog.scrollHeight - usersLog.clientHeight - 1;

    // if current user, do not display. (return) because AppendUser() is called in a loop.
    if (item.innerHTML === CurrentUser) {
      return;
    }

    //notification after logging in if new messages are present
    if (CurUserNoti != null) {
      for (let i = 0; i < CurUserNoti.length; i++) {
        if (item.innerHTML == CurUserNoti[i].notificationsender) {
          let notiItem = CurUserNoti[i].notificationsender;
          item.classList.add("notification");

          // notyf.success("Logged in");
        }
      }
    }
    let chatModal = document.createElement("div");
    chatModal.className = "chat-modal";
    console.log(item.innerHTML);
    chatModal.id = "chat-modal-" + item.innerHTML;
    let chatTitleBox = document.createElement("div");
    chatTitleBox.className = "chat-title-box-" + item.innerHTML;
    let but = document.createElement("button");
    but.setAttribute("value", "closeBtn");
    but.addEventListener("click", ChatReturn);
    but.className = "message-close";
    but.id = "btn-" + item.innerHTML;
    let h2 = document.createElement("h2");
    h2.className = "chat-title";
    h2.id = "recipient-" + item.innerHTML;
    chatTitleBox.append(but);
    chatTitleBox.append(h2);

    let messageHtml = document.createElement("div");
    messageHtml.className = "messages-" + item.innerHTML;
    let messageHtml2 = document.createElement("div");
    messageHtml2.className = "messages-content";
    messageHtml2.id = "log-" + item.innerHTML;
    let messageBox = document.createElement("div");
    messageBox.className = "message-box";
    messageBox.id = "message-box-" + item.innerHTML;
    let mesInput = document.createElement("input");
    mesInput.setAttribute("type", "text");
    mesInput.id = "msg-" + item.innerHTML;
    mesInput.className = "message-input";
    mesInput.setAttribute("placeholder", "Type message...");
    let but2 = document.createElement("button");
    but2.className = "message-submit";
    but2.id = "msg-send-btn-" + item.innerHTML;
    but2.innerText = "Send";
    messageBox.append(mesInput);
    messageBox.append(but2);
    messageHtml.append(messageHtml2, messageBox);
    chatModal.append(chatTitleBox, messageHtml);
    chatModal.style.display = "none";

    let chat = document.querySelector(".chat-private");

    chat.append(chatModal);
    console.log("append", chatModal);
    usersLog.appendChild(item);
    item.innerHTML = item.innerHTML;
    if (doScroll) {
      usersLog.scrollTop = usersLog.scrollHeight - usersLog.clientHeight;
    }
    // opening private chat window on clicking on selected users

    // Show main chat window

    // **filter** and append correct messages to chat window

    messages.forEach((message) => {
      // create new div for message
      let messageBubble = document.createElement("div");
      let dateDiv = document.createElement("div");
      dateDiv.className = "dateDiv";

      // 1. when current user is sender
      if (
        message.sender === CurrentUser &&
        message.recipient === item.innerHTML
      ) {
        // add class of sender
        messageBubble.className = "sender";
        messageBubble.innerText = `${"You"}: ${message.chatMessage}`;
        let bubbleWrapper = document.createElement("div");
        bubbleWrapper.classList.add("messageWrapper"), "sender";
        dateDiv.innerHTML = `${ConvertDate(message.creationDate)}`;
        messageBubble.appendChild(dateDiv);
        bubbleWrapper.append(messageBubble);
        // append to child div of main chat window
        console.log(messageHtml2);
        messageHtml2.append(bubbleWrapper);
        // document.querySelector(".messages-content").append(bubbleWrapper);
      } else if (
        message.recipient === CurrentUser &&
        message.sender === item.innerHTML
      ) {
        // 2. when current user is recipient
        // add class of recipient
        messageBubble.className = "recipient";
        messageBubble.innerText = `${message.sender}: ${message.chatMessage}`;
        dateDiv.innerHTML = `${ConvertDate(message.creationDate)}`;
        messageBubble.appendChild(dateDiv);
        messageHtml2.append(messageBubble);

        // document.querySelector(".messages-content").append(messageBubble);
      }
    });
    item.onclick = () => {
      chat.style.visibility = "visible";
      let chosenId = "#chat-modal-" + item.innerHTML;
      let receiverChatbox = document.querySelector(chosenId);
      receiverChatbox.style.display = "block";
      h2.innerHTML = "Messaging - " + item.innerHTML;

      // if condition for removing notification
      if (item.classList.contains("notification")) {
        // object to message to send to front end
        let notification = {
          NotificationSender: item.innerHTML,
          NotificationRecipient: CurrentUser,
          NotificationSeen: "seen",
        };

        conn.send(JSON.stringify(notification));

        item.classList.remove("notification");
      }
    };
  }

  // function to send message to backend to be stored into DB
  function onclickFun(item) {
    if (item.innerHTML === CurrentUser) {
      return;
    }
    console.log(item.innerHTML);
    document.getElementById("msg-send-btn-" + item.innerHTML).onclick =
      function () {
        var msg = document.getElementById("msg-" + item.innerHTML);

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
          Recipient: item.innerHTML,
          Content: msg.value.trim(),
          Date: newTime(date.toString()),
        };

        conn.send(JSON.stringify(message));
        msg.value = "";
        return false;
      };
  }

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
        console.log(msg);
        let messageWrapper = document.createElement("div");
        messageWrapper.className = "messageWrapper";
        let newMessage = document.createElement("div");
        let dateDiv = document.createElement("div");
        dateDiv.className = "dateDiv";

        if (CurrentUser === msg.Sender) {
          newMessage.className = "sender";
          newMessage.innerHTML = `${"You"}: ${msg.Content}`;
          dateDiv.innerHTML = `${msg.Date}`;
          newMessage.appendChild(dateDiv);
          messageWrapper.append(newMessage);
          document
            .querySelector("#log-" + msg.Recipient)
            .appendChild(messageWrapper);
        } else if (CurrentUser !== msg.Sender) {
          // let senderuser = document.querySelector("#usersLog").children;
          // console.log(senderuser.senderuser.length);
          newMessage.className = "recipient";
          newMessage.innerHTML = `${msg.Sender}: ${msg.Content}`;
          dateDiv.innerHTML = `${msg.Date}`;
          newMessage.appendChild(dateDiv);
          console.log(
            document.querySelector("#log-" + msg.Sender).children.length
          );
          document.querySelector("#log-" + msg.Sender).append(newMessage);
          console.log(
            document.querySelector("#log-" + msg.Sender).children.length
          );
          // let log = document.querySelector("#log-" + msg.Sender);
          // log.insertBefore(newMessage, log.firstChild);
          let allChatbox = Array.from(document.querySelectorAll(".chat-modal"));
          allChatbox.forEach((element) => {
            let chatBoxId = "chat-modal-" + msg.Sender;
            if (chatBoxId == element.id) {
              // NOTIFICATION to show while already being online and receiving new message
              if (element.style.display == "none") {
                element.classList.add("notification");
              }
            }
          });
        }
      }

      // formatting message

      var messages = evt.data.split("\n");
      console.log(messages, messages.length);
      for (var i = 1; i < messages.length; i++) {
        var item = document.createElement("div");
        item.innerHTML = messages[i];

        //! CHECK: IF NEEDED---------------------------------
        if (CurUserNoti != null) {
          for (let k = 0; k < CurUserNoti.length; k++) {
            if (messages[i] == CurUserNoti[k].notificationsender) {
              // alert("notification", messages[i]);
            }
          }
        }
        // !--------------------------------------------

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
            //print list of registered users inside 'usersLog' div
            AppendUser(item);
            console.log("-----------------------");
            onclickFun(item);
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
function ChatReturn() {
  let chat = document.querySelector(".chat-private");
  chat.style.visibility = "hidden";

  let chosenChatbox = Array.from(document.querySelectorAll(".chat-modal"));
  if (chosenChatbox != null) {
    chosenChatbox.forEach((element) => {
      element.style.display = "none";
    });
  }
  // document.querySelector(".messages-content").innerHTML = "";
}
