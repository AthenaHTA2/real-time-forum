const LoginBtn = document.getElementById('loginBtn');
LoginBtn.onclick = (e) => {
    e.preventDefault(); 

    let LUserName = document.querySelector("#LUserName").value
    let LPassW = document.querySelector("#LPassW").value

    let loginData = {
        LUserName: LUserName,
        LPassW: LPassW,
    }

    console.log({loginData})

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
        } else {
            unsuccessfulLogin()
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

    setTimeout(() => {
        document.getElementById('LoggedOn').style.display = 'none';
        document.getElementById('happyFace').style.display = 'none';

      },1500);

    document.getElementById('postBlock').style.display = 'flex';
    document.getElementById('logout').style.display = 'block'
}

const unsuccessLogin = () => {
    
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