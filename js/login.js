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
      console.log('LogDataSuccess:', response)
      return response.json();
    })
    document.getElementById('loginModal').style.display = "none";
    document.getElementById('LoggedOn').style.display = 'block';

    setTimeout(() => {
        document.getElementById('LoggedOn').style.display = 'none';

      },1500);

    document.getElementById('postBlock').style.display = 'flex';

    document.getElementById('logout').style.display = 'block'
  }
