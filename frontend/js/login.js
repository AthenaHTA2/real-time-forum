// Get the modal
var modal = document.getElementById("loginModal");

// Get the button that opens the modal
var btn = document.getElementById("login");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("cancelBtn")[0];

// When the user clicks the button, open the modal 
btn.onclick = function() {
    console.log("itsworking")
  modal.style.display = "block";
}

// When the user clicks on <span> (x), close the modal
// span.onclick= function() {
//   modal.style.display = "none";
// }
// When the user clicks anywhere outside of the modal, close it
// window.onclick(function(event) {
//   if (event.target == modal) {
//     modal.style.display = "none";
//   }
// })
function openLogin() {
  closePost()
  document.getElementById('loginModal').style.display = "block";
  document.getElementById('regModal').style.display = "none";
}
function openReg() {
  closePost()
  document.getElementById('loginModal').style.display ="none";
  document.getElementById('regModal').style.display = "block";
}
function closeBtn() {
  document.getElementById('postBlock').style.display = 'flex';
}

function closePost() {
  document.getElementById('postBlock').style.display = "none";
}

//~~~~~~~~~~~~ Linking Register and Login front end to back end ~~~~~~~~

//define 'response' for the fetch() method
let response

//Put register data into a JS object if user clicks 'Register' button
const registerBtn=document.querySelector("#registerBtn")
registerBtn.onclick= (e)=>{
  //stop browser refreshing
  e.preventDefault();
  //grab user data
  let FirstName = document.querySelector("#FirstName").value
  let LastName = document.querySelector("#LastName").value
  let NickName = document.querySelector("#NickName").value
  let AgeReg = document.querySelector("#AgeReg").value
  let GenderReg =  document.querySelector("#GenderReg").value
  let EmailReg = document.querySelector("#EmailReg").value
  let PassWdReg = document.querySelector("#PassWdReg").value

  //populate JS object with user data
  let RegisterData = {
    FirstName: FirstName,
    LastName: LastName,
    NickName: NickName,
    AgeReg: AgeReg,
    GenderReg: GenderReg,
    EmailReg: EmailReg,
    PassWdReg: PassWdReg,
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
    }

  // fetch('/register', {
  //   headers: {
  //     'Accept' : 'application/json',
  //     'Content-Type':'application/json'
  //   },
  //   method: 'POST',
  //   // body: RegisterData
  // body: JSON.stringify(RegisterData)
  // })
  // .then((res) => console.log(res))

  // //   fetch('/register', {
  // //   headers: {
  // //     'Accept' : 'application/json',
  // //     'Content-Type':'application/json'
  // //   },
  // //   method: 'POST',
  // //   body: RegisterData,
  // //   //body: JSON.stringify(RegisterData),
  // // })
  // // .then((res) => JSON.stringify(res))
  // .then((res) => res.json())
  // .then((res) => 
  //   console.log('Success:', res)
  // )
  

//

//send user input in the 'Login' form to the 'LoginData' struct in go
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

