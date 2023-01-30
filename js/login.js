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
        // refreshPosts();
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
        console.log(rsp);
        currentUser = rsp;
  
        var successlogin = document.getElementById("current-user");
        successlogin.innerHTML = " 𝕎𝔼𝕃ℂ𝕆𝕄𝔼 " + currentUser.nickname + " &#128512";
        // if (user) {
        //   var successlogin = document.getElementById("current-user");
        //   successlogin.innerHTML = " Welcome " + currentUser;
        // }
      }
    });
};

//print profile data in the left side navigation
// function showProfile(user) {
//   console.log("showProfile called", user)
//   nameContainer = document.querySelector("#current-user")
//   nameContainer.innerHTML = "";
//   nameContainer.innerHTML = `<p>`+"Welcome " +user.NickName+"!"+ " &#128512"+`</p>`
//   profileContainer = document.querySelector("#userProfile")
//   profileContainer.innerHTML = "";
//   profileContainer.innerHTML = `
//     <div id="loggedUserProfile" style="display: none;">
//     <br>
//     <br>
//     <br>
//     <h1 ><u>`+ user.NickName +`Profile</u></h1>
//     <p >`+ "First Name: " + user.FirstName + `</p>
//     <p >`+ "Last Name: " + user.LastName + `</p>
//     <p >`+ "Nickname: " + user.NickName + `</p>
//     <p >`+ "Gender: " + user.Gender + `</p>
//     <p >`+ "Email: " + user.Email + `</p>
//     <p >`+ "Age: " + user.Age + `</p>
//     </div>
//     `
// }

// //unhide the user profile aftert clicking the 'Profile' hyperlink
// //in the left-hand-side navigation
// function showHideUserProfile(){
//   let profileBlock = document.querySelector(".loggedUserProfile");
//   if (profileBlock.style.display === "none") {
//     profileBlock.style.display = "block";
//   } else {
//     profileBlock.style.display = "none";
//   }
// }

const refreshPostsAfterLogin = () => {
  fetch("/getPosts", {
    headers : {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    method: "POST",
  })
  .then((response)=> {
    response.text().then(function(data){
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
    console.log("##############################WE ARE NOW IN AFTERLOGING DISPLAYPOST")
    postsContainer = document.querySelector('#postListAfterLogin')
    postsContainer.innerHTML = "";
    for (let i = (posts.length - 1); i >= 0; i--) {
        postsContainer.innerHTML += `
            <div class="posts" style.display ="inline-block" id=` + posts[i].PostID + `>
            <div  style.display="inline-block" &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; 
            &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;&nbsp; &nbsp; &nbsp;&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
            &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
            <button class="button" id="ShowComments" onclick="displayExpandedPosts() ;" style.text-align="center">` + 
            " &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;&nbsp; &nbsp; &nbsp;&nbsp; &nbsp; &nbsp;" + " &nbsp; &nbsp; &nbsp; &nbsp;" +
            " &nbsp; &nbsp; &nbsp; &nbsp;&nbsp; &nbsp; &nbsp;&nbsp; &nbsp;  &nbsp; &nbsp; &nbsp; &nbsp;&nbsp; &nbsp; &nbsp;&nbsp; &nbsp;  Show Comments" + `</button>
            </div>
            
            <p class="post-content" >` + "Author: " + posts[i].Author + `</p>
            <p class="post-content" >` + "Category: " + posts[i].PostCat + `</p>
            <p class="post-content" >` + "Title: " + posts[i].PostTitl + ` </p>
            <p class="post-content" >` + "Content: " + posts[i].PostCont + `</p>
            <p class="post-content" >` + "Created: " + ConvertDate(posts[i].PostTime) + `</p> 
            <br>  
           
            <br>  
            </div>
            </div>            
        `  
    }
  }

  
};



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
  document.getElementById("postList").style.display = "none";
  document.getElementById("usersLog").style.display = "block";
  // document.getElementById("profile").style.display = "block";


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

  refreshPostsAfterLogin();

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
  document.querySelector(".loggedInUsers").style.visibility = "hidden";
  document.querySelector(".chat-private").style.visibility = "hidden";
  document.getElementById('current-user').style.display ="none"; 

  console.log(document.cookie);
}
//
//
// ====================================================
window.onload = function () {
  refreshPosts();
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
