window.onload = function () {
  var conn;
  var msg = document.getElementById("msg");
  var log = document.getElementById("log");

  function AppendLog(item) {
      var doScroll = log.scrollTop > log.scrollHeight - log.clientHeight - 1;
      log.appendChild(item);
      if (doScroll) {
          log.scrollTop = log.scrollHeight - log.clientHeight;
      }
  }

  document.getElementById("form").onsubmit = function () {
      if (!conn) {
          return false;
      }
      if (!msg.value) {
          return false;
      }
      conn.send(msg.value);
      msg.value = "";
      return false;
  };

  if (window["WebSocket"]) {
      conn = new WebSocket("ws://" + document.location.host + "/ws");
      conn.onclose = function (evt) {
          var item = document.createElement("div");
          item.innerHTML = "<b>Connection closed.</b>";
          AppendLog(item);
      };
      conn.onmessage = function (evt) {
          var messages = evt.data.split('\n');
          for (var i = 0; i < messages.length; i++) {
              //var item = document.createElement("div");
             // item.style.color = '#80ed99'
             // item.innerText = messages[i];
             AppendMessage(messages[i], UserName)
              //AppendLog(item);
          }
      };
  } else {
      var item = document.createElement("div");
      item.innerHTML = "<b>Your browser does not support WebSockets.</b>";
      AppendLog(item);
  }
};

/*Question to https://chat.openai.com/chat:
I am building a chat application using javascript for the front end 
and golang for the back end. So far I have managed using websockets 
to allow users to have conversations with each other using different browsers.
I have a problem. I would like the messages in the chat to have 
a different bubble for each user's individual message. The sender's bubble 
should be on the right and the receiver's bubble should be on the left. 
Write some code that does this.*/

//Answer from https://chat.openai.com/chat:


// First, let's define a function that takes a message and a username,
// and returns the appropriate HTML for the message bubble.
function CreateMessageBubble(message, username) {
  // If the username matches the current user's username,
  // the message bubble should be on the right side of the chat window.
  if (username === LoginData.userName) {
    return '<div class="message-bubble-container right">' +
      '<p class="message-bubble">' + message + '</p>' +
      '</div>';
  }
  // Otherwise, the message bubble should be on the left side of the chat window.
  else {
    return '<div class="message-bubble-container left">' +
      '<p class="message-bubble">' + message + '</p>' +
      '</div>';
  }
}

// Now, let's define a function that takes a message and a username,
// and appends the message bubble to the chat window.
function AppendMessage(message, username) {
  // First, create the message bubble HTML using the createMessageBubble function.
  var messageBubble = CreateMessageBubble(message, username);

  // Then, append the message bubble to the chat window.
  //$('#chat-window').append(messageBubble);
  AppendLog(messageBubble)
}

// Now, let's say we have a chat message and the username of the sender.
// We can use the appendMessage function to add the message to the chat window.
//var message = "Hello, world!";
//var username = "User123";
//appendMessage(message, username);
