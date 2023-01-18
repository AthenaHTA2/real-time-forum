//send user input in the 'Login' form to the 'LoginData' struct in go
// via the 'LoginHandler' handler function in go
const LoginBtn = document.getElementById('loginBtn');
LoginBtn.onclick = (e) => {
    //stop browser refreshing
    e.preventDefault(); 

    let LUserName = document.querySelector("#LUserName").value
    let LPassW = document.querySelector("#LPassW").value

    let loginData = {
        LUserName: LUserName,
        LPassW: LPassW,
    }

    //Sending Login form's data with the Fetch API
    //to the 'LoginData' struct in go
    let configLogin = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
        },
        body:JSON.stringify(loginData)
    };

    fetch("http://localhost:8080/login", configLogin)
    .then(function(response) {
        console.log('LogDataSuccess: ', response)

        if(response.status == 200) {
            successfulLogin()

        response.text().then(function(data){//Here we get user profile data
            let userDetails = JSON.parse(data);
            console.log("posts:", userDetails);
            //print user data
            // showProfile(userDetails)
            });
        } else {
            unsuccessfullLogin()
        }
    })

}

const successfulLogin = () => {
    document.getElementById('postedArticles').style.display ="none"; 
    document.getElementById('loginModal').style.display ="none"; 
    document.getElementById('profile').style.display ="block"; 
    document.getElementById('LoggedOn').style.display = 'block';
    document.getElementById('happyFace').style.display = 'block';
    document.getElementById('profileMod').style.display = "none";
    document.getElementById('addPost').style.display = "block";
    document.getElementById('login').style.display ="none"; 
    document.getElementById('register').style.display ="none"; 
    document.getElementById('welcomemsg').style.display ="none"; 
    document.getElementById('Users').style.display ="block"; 
    document.getElementById('Offline').style.display ="block"; 
    document.getElementById('Online').style.display ="block"; 
    document.getElementById('Messenger').style.display ="block"; 



    setTimeout(() => {
        document.getElementById('LoggedOn').style.display = 'none';
        document.getElementById('happyFace').style.display = 'none';

      },1500);

    document.getElementById('postBlock').style.display = 'flex';
    document.getElementById('logout').style.display = 'block'
}

const unsuccessfullLogin = () => {
    
    console.log("failed - not status 200")

    document.getElementById('postedArticles').style.display ="none"; 
    document.getElementById('profileMod').style.display = "none";
    document.getElementById('loginModal').style.display = "none";
    document.getElementById('regRejected').style.display = 'block';
    setTimeout(() => {
        document.getElementById('regRejected').style.display = 'none';
      },1500);
    document.getElementById('postBlock').style.display = 'flex';
}