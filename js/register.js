//This is our functions to open the links for our buttons
function openLogin() {
    closePost()
    document.getElementById('loginModal').style.display = "block";
    document.getElementById('regModal').style.display = "none";
    document.getElementById('regConfirmed').style.display = 'none';

  }


  function openReg() {
    closePost()
    document.getElementById('loginModal').style.display ="none";
    document.getElementById('regModal').style.display = "block";
    document.getElementById('regConfirmed').style.display = 'none';

  }
  function closeBtn() {
    document.getElementById('postBlock').style.display = 'flex';
    document.getElementById('regConfirmed').style.display = 'none';

  }
  function closePost() {
    document.getElementById('postBlock').style.display = "none";
    document.getElementById('regConfirmed').style.display = 'none';

  }

  function validation() {
    let form = document.getElementById('form')
    let email = document.getElementById('Email').value
    let text = document.getElementById('text')
    let pattern = /^[^ ]+@[^ ]+\.[a-z]{2,3}$/
  
    if (email.match(pattern)) {
      form.classList.add('valid')
      form.classList.remove('invalid')
      text.innerHTML = "Email Address is valid"
      text.style.color = '#00ff00'
    } else {
      form.classList.remove('valid')
      form.classList.add('invalid')
      text.innerHTML = "Email Address Not Valid"
      text.style.color = '#ff0000'
    }
  
    if (email == '') {
      form.classList.remove('valid')
      form.classList.remove('invalid')
      text.innerHTML = ""
      text.style.color = '#00ff00'
    }
  }

  //Put register data into a JS object if user clicks 'Register' button
const registerBtn=document.querySelector("#registerBtn")
registerBtn.onclick= (e)=>{
  //stop browser refreshing
  e.preventDefault();
  //grab user data
  let FirstName = document.querySelector("#FirstName").value
  let LastName = document.querySelector("#LastName").value
  let NickName = document.querySelector("#NickName").value
  let Age = document.querySelector("#Age").value
  let Gender =  document.querySelector("#Gender").value
  let Email = document.querySelector("#Email").value
  let PassWord = document.querySelector("#PassWord").value
  //populate JS object with user data
  let RegisterData = {
    FirstName: FirstName,
    LastName: LastName,
    NickName: NickName,
    Age: Age,
    Gender: Gender,
    Email: Email,
    PassWord: PassWord,
  }
    console.log({RegisterData})

    
    
//send user input in the 'Register' form to the 'RegData' struct in go
// via the 'Register' handler function in go
    let configRegister = {
      method: "POST",
      headers: {
       "Content-Type": "application/json",
        "Accept": "application/json",
      },
      body: JSON.stringify(RegisterData)
    };
    
    fetch("http://localhost:8080/register", configRegister)
      .then(function(response) {
        console.log('RegDataSuccess:', response)
        return response.json();
        
      })

      document.getElementById('regModal').style.display = "none";
      document.getElementById('regConfirmed').style.display = 'block';


      setTimeout(() => {
        document.getElementById('regConfirmed').style.display = 'none';

      },2000);

      document.getElementById('postBlock').style.display = 'flex';

      document.getElementById('logout').style.display = 'block'


    }


  
    
 
//send user input in the 'Login' form to the 'LoginData' struct in go
// via the 'LoginHandler' handler function in go
const LoginBtn=document.querySelector("#loginBtn")
//console.log("loginBtn id:", LoginBtn.getAttribute("style"))
  LoginBtn.onclick= (e)=>{
  //stop browser refreshing
  e.preventDefault();
  let UserName = document.querySelector("#UserName").value
  let LoginPw = document.querySelector("#LoginPw").value
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
    document.getElementById('homePage').style.display = 'block'
  }
