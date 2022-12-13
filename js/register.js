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

  // function validation() {
  //   let form = document.getElementById('form')
  //   let email = document.getElementById('Email').value
  //   let text = document.getElementById('text')
  //   let pattern = /^[^ ]+@[^ ]+\.[a-z]{2,3}$/
  
  //   if (email.match(pattern)) {
  //     form.classList.add('valid')
  //     form.classList.remove('invalid')
  //     text.innerHTML = "Email Address is valid"
  //     text.style.color = '#00ff00'
  //   } else {
  //     form.classList.remove('valid')
  //     form.classList.add('invalid')
  //     text.innerHTML = "Email Address Not Valid"
  //     text.style.color = '#ff0000'
  //   }
  
  //   if (email == '') {
  //     form.classList.remove('valid')
  //     form.classList.remove('invalid')
  //     text.innerHTML = ""
  //     text.style.color = '#00ff00'
  //   }
  // }

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
        console.log('Success:', response)
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


  
    
 
// send user input in the 'Login' form to the 'LoginData' struct in go
// via the 'LoginHandler' handler function in go
const LoginBtn=document.querySelector("#LoginBtn")
LoginBtn.onclick= (e)=>{
  //stop browser refreshing
  e.preventDefault();
  //console.log("event:", e)
  let UserName = document.querySelector("#UserName").value
  let LoginPw = document.querySelector("#LoginPw").value
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
      console.log('Success:', response)
      return response.json();
      
    })
  }





  // TODO new stuff needs testing
  const regform = document.getElementById('regform')
  const nickname = document.getElementById('NickName')
  const email = document.getElementById('Email')
  const password = document.getElementById('PassWord')
  const gender = document.getElementById('Gender')
  const age = document.getElementById('Age')

  regform.addEventListener('regform', (e) => {
    e.preventDefault();

    checkInputs()

    
  })

  function checkInputs(){
    // get the values from the inputs
    const nicknameValue = nickname.value.trim()
    const emailValue = email.value.trim()
    const passwordValue = password.value.trim()
    const genderValue = gender.value.trim()
    const ageValue = age.value.trim()

    // checking nickname input validity
    if (nicknameValue === ''){
      // show error
      // add error class
      setErrorFor(nickname, "NickName cannot be blank");
    } else {
      // add success class
      setSuccessFor(nickname);
    }

    // checking email input validity
    if (emailValue === ''){
      setErrorFor(email, "Email cannot be blank");
    } else if (!isEmail(emailValue)){
      setErrorFor(email, "Email is invalid");
    } else {
      setSuccessFor(email);
    }

     // checking password input validity
     if (passwordValue === ''){
      setErrorFor(password, "Password cannot be blank");
    } else if (!validPassowrd(passwordValue)){
      setErrorFor(password, "Password is invalid");
    } else {
      setSuccessFor(password);
    }

    // checking gender input validity
    if (genderValue === ''){
      setErrorFor(gender, "Gender cannot be blank");
    } else if((!genderValue === 'male') || (!genderValue === 'female') || (!genderValue === 'other')) {
      setErrorFor(gender, "Gender invalid!");
    } else {
      setSuccessFor(gender);
    }

    // checking ege input validity
    if (ageValue === ''){
      setErrorFor(age, "Age cannot be blank");
    } else if (ageValue <= 0) {
      setErrorFor(age, "Age is Invalid");
    } else if (ageValue <= 5) {
      setErrorFor(age, "Sorry you are too young");
    } else if (ageValue >= 120) {
      setErrorFor(age, "Error! Age is too much");
    } else {
      setSuccessFor(age);
    }

  }

  function setErrorFor(input, message){
    const regFormControl = input.parentElement; // .reg-form-control
    const small = regFormControl.querySelector('small');

    // all the error message inside the small tag
    small.innerText = message;

    // add the error class
    regFormControl.className = 'reg-form-control error'

  }

  function setSuccessFor(){
    const regFormControl = input.parentElement;

    regFormControl.className = 'reg-form-control success'

  }

  function isEmail(email){
    return /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.(0-9){1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email);
  }

  function validPassowrd(password){
    return /^([a-zA-Z0-9@*#]{8,15})$/.test(password)
  }

  function showPassword(targetID){
    var pw = document.getElementById(targetID);
    if (pw.type === "password") {
      pw.type = "text";
    } else {
      pw.type = "password";
    }
  }
  