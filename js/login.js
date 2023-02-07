let user;
let CurrentUser;
let receiver;
let LoginData;
let ShowComments


// showCom = document.getElementById('ShowComments')
// showCom.onclick = (e) => {
//   document.querySelector("#postListExpanded").style.display="block";
// }
  


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

        let userData = JSON.parse(rsp);

        showProfile(userData)

        console.log(userData, "++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++")

        CurrentUser = userData.NickName;
        console.log(CurrentUser);

        var successlogin = document.getElementById("current-user");

        successlogin.innerHTML =
          " 𝕎𝔼𝕃ℂ𝕆𝕄𝔼 " + CurrentUser + " &#128512";
        // if (user) {
        //   var successlogin = document.getElementById("current-user");
        //   successlogin.innerHTML = " Welcome " + CurrentUser;
        // }
      }
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
  console.log("AFTER GETTING ALL DOCUMENTS FROM HMTL @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@")

  console.log(user.Age, user.Gender, user.Email)
  WelMsg.innerHTML = "&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; " + user.NickName;
  console.log("FIRST PART OF DISPLAYING INNERHTML @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@")

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
  

    console.log(
    );
    postsContainer = document.querySelector("#postListAfterLogin");
    postsContainer.innerHTML = "";
    for (let i = posts.length - 1; i >= 0; i--) {
    
      postsContainer.innerHTML +=
        `
            <div class="posts" style.display ="inline-block" id=` +

        `>
         
            
            <p class="post-content" >` +
        "Author: " +  posts[i].Author + `</p>
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
    </div>
            <br>  

           
            <br>  
            </div>
            </div>            
        `;
    }
  };
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
  document.querySelector(".loggedInUsers").style.visibility = "hidden";
  document.querySelector(".chat-private").style.visibility = "hidden";
  document.getElementById("current-user").style.display = "none";
  document.getElementById("postList").style.display = "block";



  console.log(document.cookie);
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
  };

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
  };

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
      Sender: CurrentUser,
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
