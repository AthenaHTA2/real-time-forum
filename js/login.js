//send user input in the 'Login' form to the 'LoginData' struct in go
// via the 'LoginHandler' handler function in go
const LoginBtn=document.querySelector("#loginBtn")
//console.log("loginBtn id:", LoginBtn.getAttribute("style"))
  LoginBtn.onclick= (e)=>{
  //stop browser refreshing
  e.preventDefault();
  let UserName = document.querySelector("#LUserName").value
  let LoginPw = document.querySelector("#LPassW").value
  //make JS object to store login data
  let LoginData = {
    UserName: UserName,
    LoginPw: LoginPw,
  }
  console.log({LoginData})
  //Sending Login form's data with the Fetch API
  //to the 'LoginData' struct in go
  let configLogin = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json",
    },
    body: JSON.stringify(LoginData)
  };
  
  fetch("http://localhost:8080/login", configLogin)
    .then(function(response) {
      if (response.status == 200) {
        successfulLogin()

        response.text().then(function(data){//Here we get user profile data
          let userDetails = JSON.parse(data);
          console.log("The user's profile:", userDetails);
          //print user data
          showProfile(userDetails)
        });


      } else {
        unsuccessfulLogin()
      }

    })

  }

  //print profile data
  function showProfile(user) {
    console.log("showProfile called", user)
    nameContainer = document.querySelector("#current-user")
    nameContainer.innerHTML = "";
    nameContainer.innerHTML = `<p>`+"Welcome " +user.NickName+"!"+ " &#128512"+`</p>`
    
    profileContainer = document.querySelector("#userProfile")
    profileContainer.innerHTML = "";

    profileContainer.innerHTML = `
      <div class ="profile">
      <br>
      <br>
      <br>
      <h2 class ="profile"><u>Profile</u></h2>
      <p >`+ "First Name: " + user.FirstName + `</p>
      <p >`+ "Last Name: " + user.LastName + `</p>
      <p >`+ "Nickname: " + user.NickName + `</p>
      <p >`+ "Gender: " + user.Gender + `</p>
      <p >`+ "Email: " + user.Email + `</p>
      <p >`+ "Age: " + user.Age + `</p>
      </div>
      `
    
}

  //show list of registered users
  /*function ReadUsers(){
    let configUsersList = {
      method: "GET"
      /*headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      body: JSON.stringify(LoginData)*/
    /*};
    
    fetch("http://localhost:8080/login", configUsersList)
      .then(function(response) {
        if (response.status == 200) {
          console.log("Users showing: \n",response)
        } else {
          console.log("Error showing users")
        }
    
      })
  }*/




  function successfulLogin() {
    //refreshPosts()
    console.log("success - status 200")

    document.getElementById('loginModal').style.display = "none";
    document.getElementById('LoggedOn').style.display = 'block';

    setTimeout(() => {
        document.getElementById('LoggedOn').style.display = 'none';

      },1500);

    document.getElementById('postBlock').style.display = 'flex';

    document.getElementById('logout').style.display = 'block'

    postBtn = document.querySelector("#postBlock > button")
    postBtn.style.visibility = "visible"
    document.querySelector('.loggedInUsers').style.display = "block"
    document.querySelector('#formChat').style.visibility = "visible"
  }

  function unsuccessfulLogin() {
    console.log("failed - not status 200")

    document.getElementById('loginModal').style.display = "none";
    document.getElementById('regRejected').style.display = 'block';

    setTimeout(() => {
        document.getElementById('regRejected').style.display = 'none';

      },1500);

    document.getElementById('postBlock').style.display = 'flex';
  }

  