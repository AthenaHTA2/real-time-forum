//This is our functions to open the links for our buttons
const openLogin = () => {
    closePost()
    document.getElementById('postedArticles').style.display ="none"; 
    document.getElementById('loginModal').style.display = "block";
    document.getElementById('regModal').style.display = "none";
    document.getElementById('regConfirmed').style.display = 'none';
    document.getElementById('profileMod').style.display = "none";

  }
const openReg = () => {
    closePost()
    document.getElementById('postedArticles').style.display ="none"; 
    document.getElementById('profileMod').style.display = "none";
    document.getElementById('loginModal').style.display ="none";
    document.getElementById('regModal').style.display = "block";
    document.getElementById('regConfirmed').style.display = 'none';

  }

const closeBtn = () => {
    document.getElementById('postBlock').style.display = 'flex';
    document.getElementById('regConfirmed').style.display = 'none';
    document.getElementById('profileMod').style.display = "none";
    document.getElementById('postedArticles').style.display ="none"; 
  }
  
const closePost = () => {
    document.getElementById('postBlock').style.display = "none";
    document.getElementById('regConfirmed').style.display = 'none';
    document.getElementById('profileMod').style.display = "none";
    document.getElementById('postedArticles').style.display ="none"; 
  }

const logOut = document.querySelector('#logout')

  logOut.onclick= (e)=>{
    e.preventDefault();
    document.getElementById('postedArticles').style.display ="none"; 
    document.getElementById('profileMod').style.display = "none";
    document.getElementById('logout').style.display = "none";
    document.getElementById('LoggedOut').style.display = "block";
    document.getElementById('byeFace').style.display = 'block';

    setTimeout(() => {
      document.getElementById('LoggedOut').style.display = "none";
      document.getElementById('byeFace').style.display = 'none';
    },1500);
  }

  const profileBtn = document.querySelector('#profile')

    profileBtn.onclick= (e) => {
    e.preventDefault();
    document.getElementById('postedArticles').style.display ="none"; 
    document.getElementById('postBlock').style.display = 'none';
    document.getElementById('profileMod').style.display = "block";
    document.getElementById('regModal').style.display = "none";
    document.getElementById('loginModal').style.display = "none";

    }

const DeleteSession = () => {
  
}

  