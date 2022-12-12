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
        return response.json();
    })

    document.getElementById('loginModal').style.display ="none"; 

    document.getElementById('LoggedOn').style.display = 'block';

    setTimeout(() => {
        document.getElementById('LoggedOn').style.display = 'none';

      },1500);

    document.getElementById('postBlock').style.display = 'flex';

    document.getElementById('logout').style.display = 'block'

}