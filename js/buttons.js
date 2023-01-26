
//This is our functions to open the links for our buttons

//This function opens Login Modal
const openLogin = () => {
  closePost();
  document.getElementById("postedArticles").style.display = "none";
  document.getElementById("loginModal").style.display = "block";
  document.getElementById("regModal").style.display = "none";
  document.getElementById("regConfirmed").style.display = "none";
  document.getElementById("profileMod").style.display = "none";
};

//this function open Registration Modal
const openReg = () => {
  closePost();
  document.getElementById("postedArticles").style.display = "none";
  document.getElementById("profileMod").style.display = "none";
  document.getElementById("loginModal").style.display = "none";
  document.getElementById("regModal").style.display = "block";
  document.getElementById("regConfirmed").style.display = "none";
};

//this function is for the cancel buttons
const closeBtn = () => {
  document.getElementById("postBlock").style.display = "flex";
  document.getElementById("regConfirmed").style.display = "none";
  document.getElementById("profileMod").style.display = "none";
  document.getElementById("postedArticles").style.display = "none";
};

//this function is to make posts not visible where needed
const closePost = () => {
  document.getElementById("postBlock").style.display = "none";
  document.getElementById("regConfirmed").style.display = "none";
  document.getElementById("profileMod").style.display = "none";
  document.getElementById("postedArticles").style.display = "none";
};

//this function is for the log out button
const logOut = document.querySelector("#logout");

logOut.onclick = (e) => {
  e.preventDefault();
  document.getElementById("postedArticles").style.display = "none";
  document.getElementById("profileMod").style.display = "none";
  document.getElementById("logout").style.display = "none";
  document.getElementById("LoggedOut").style.display = "block";
  document.getElementById("byeFace").style.display = "block";
  document.getElementById("addPost").style.display = "none";
  document.getElementById("login").style.display = "block";
  document.getElementById("register").style.display = "block";
  document.getElementById("Messenger").style.display = "none";
  document.getElementById("Users").style.display = "none";
  document.getElementById("Online").style.display = "none";
  document.getElementById("Offline").style.display = "none";
  document.getElementById("welcomemsg").style.display = "block";

  setTimeout(() => {
    document.getElementById("LoggedOut").style.display = "none";
    document.getElementById("byeFace").style.display = "none";
  }, 1500);
};



//this function is to show the user profile
const profileBtn = document.querySelector("#profile");

profileBtn.onclick = (e) => {
  e.preventDefault();
  const showProfile = (user) => {

    document.getElementById("profileMod").style.display = "block";

    profileMod.innerHTML = "";

    profileMod.innerHTML +=
      `
      
      <div class="modal">
          <br>
          <br>
          <br>
          <br>
          <br>
          <h2>🆄🆂🅴🆁-🅿🆁🅾🅵🅸🅻🅴</h2>
          <p> ` +
      "FirstName: " +
      user.FirstName +
      `</p>
          <p> ` +
      "LastName: " +
      user.LastName +
      `</p>
          <p> ` +
      "NickName: " +
      user.NickName +
      `</p>
          <p> ` +
      "Gender: " +
      user.Gender +
      `</p>
          <p> ` +
      "Email: " +
      user.Email +
      `</p>
          <p> ` +
      "Age: " +
      user.Age +
      `</p>
      </div>
      `;
  };

  document.getElementById("postedArticles").style.display = "none";
  document.getElementById("postBlock").style.display = "none";
  document.getElementById("profileMod").style.display = "block";
  document.getElementById("regModal").style.display = "none";
  document.getElementById("loginModal").style.display = "none";
};

//this function is for to open the post where needed
const openPosts = () => {
  document.getElementById("postBlock").style.display = "block";
  document.getElementById("profileMod").style.display = "none";
  document.getElementById("regModal").style.display = "none";
  document.getElementById("loginModal").style.display = "none";
  document.getElementById("postedAritcles").style.display = "block";
};




// Posts and homepage HTML.

let comment_sections = [];
// Get posts from API and put them in the homepage.
let homepage = document.getElementById("homepage");
async function displayPosts(callBack) {
    await fetchData("allposts");
    await fetchData("comments");
    posts = posts.reverse();

    posts.forEach(post => {
        let postDiv = document.createElement('div');
        postDiv.className = "postDiv";
        let allPostsContainer = document.getElementById("posts-container");
        allPostsContainer.appendChild(postDiv);

        let postBody = `
        <div class="card gedf-card" id="post-${post.id}">
                    <div class="card-header">
                        <div class="d-flex justify-content-between align-items-center">
                            <div class="d-flex justify-content-between align-items-center">
                                <div class="mr-2">
                                    <img class="rounded-circle" width="45" src="https://picsum.photos/50/50" alt="">
                                </div>
                                <div class="ml-2">
                                    <div class="h5 m-0">@${post.username}</div>
                                </div>
                            </div>
                        </div>

                    </div>
                    <div class="card-body">
                        <p class="card-text">
                            ${removeTags(post.content)}
                        </p>
                        <p class="inlinecategory">
                        <span class="bold">Post type: </span>${post.category_2}
                        </p>
                        &nbsp;
                        <p class="inlinecategory">
                        <span class="bold"> Category: </span>${post.category}
                        </p>
                        <div class="text-muted h7 mb-2"> <i class="fa fa-clock-o"></i>${post.time_posted}</div>
                    </div>
                    <div class="card-footer">
                        <a href="/" class="comment-link" id="cmnt-lnk-${post.id}"><i class="fa fa-comment"></i> Comments</a>
                        <div class="commentbox">
                            <form action="/" method="POST" class="comment-form" id="comment-form-${post.id}">
                                <input type="text" class="commenttxtbox" name="comment" id="comment-${post.id}"/>
                                <button onclick="Comment(event)" class="commentbttn btn btn-outline-secondary" name="submitComment" id="cmnt-btn-${post.id}">Comment</button>
                                <input type="hidden" name="comment-id" value="${post.id}">
                            </form>
                            <div class="comment-section" id="cmnt-sec-${post.id}" style="display: none"></div>
                        </div>
                    </div>
                    </div>
        `

        postDiv.innerHTML = postBody;
    });

    // Login redirect button only shows up on homepage so handle the click event.
    let redirectBtn = document.getElementById("loginredirect")
    if (redirectBtn != null) {
        redirectBtn.addEventListener("click", checkLink)
    }

    // Scroll to position after content has been loaded.
    window.scrollTo(0, localStorage.getItem("scrollPosition"));


    callBack();

}


// Remove html tags. (sanitizing user input.)
function removeTags(str) {
    if ((str === null) || (str === ''))
        return false;
    else
        str = str.toString();

    // Regular expression to identify HTML tags in 
    // the input string. Replacing the identified 
    // HTML tag with a null string.
    return str.replace(/(<([^>]+)>)/ig, '');
}
