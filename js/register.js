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

