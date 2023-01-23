//Put post data into a JS object if user clicks 'Create Post' button
const AddPost = document.querySelector("#addPost")
AddPost.onclick = (e) => {
    //stop the browser from refreshing 
    e.preventDefault();
    
    //grab the post data
    let theCookie = GetCookie("user_session")
    let PostCookieID = theCookie
    let PostTitle = document.querySelector("#PostTitle").value
    let PostContent = document.querySelector("#PostContent").value
    let PostCategory = document.querySelector("#PostCat").value

    console.log(PostTitle, PostContent,PostCategory)

    //populate JS object with the post Data
    let PostData = {
        PostCokID: PostCookieID,
        PostTitl: PostTitle,
        PostCont: PostContent,
        PostCat: PostCategory,
    }
    console.log({PostData})

    //send user input in the post form to the data struct in go
    //using register handle fucntion in go
    let configPost = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
        },
        body: JSON.stringify(PostData)
    };

    fetch("http://localhost:8080/post", configPost).then(function(response) {
        //if(not the response.ok) throw response
        // console.log("RegDataSuccess:", response)

        if (!response.ok) {
            unsuccessfulPost()
        }else {
            successfulPost()
        }
    })
}

const successfulPost = () => {
    console.log("POST WAS SUCCESFUL --- STATUS 200")
    PostTitle.value = ""
    PostContent.value = ""
    document.querySelector("#PostCat").value = ""
};

const unsuccessfulPost = () => {
    console.log("POST FAILED --- NOT STATUS 200")
};

//get session cookie to link post to user
const GetCookie = (name) => {
  //split cookie string
  //name equals to value pairs in an array
  var CookieArr = document.cookie.split(';');
  
  //loop through array elements
  for(var i=0; i < CookieArr.length; i++) {
    var cookiePair = CookieArr[i].split('=');

    //removing unnecessary spaces
    if(name == cookiePair[0].trim()){
      return cookiePair[1];
    }
  }
  return null;
}

const getPost = () => {
    fetch()
}

const refreshPosts = () => {
  fetch("/getPosts", {
    headers : {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    method: "POST",
  })
  .then((response)=> {
    response.text().then(function(data){
      let posts = JSON.parse(data);
      console.log("posts:", posts);
      //post shows all latest posts from database
      displayPosts(posts)
    });
  })
  .catch((error) => {
    console.log(error);
  });
}

const displayPosts = (posts) => {
    postsContainer = document.querySelector('#postList')
    postsContainer.innerHTML = "";
    for (let i = posts.length -1; i >= 0; i--) {
        postsContainer.innerHTML += `
            <div class="posts" id=` + posts[i].PostID + `>
            <p class="post-content" >` + "Author: " + posts[i].Author + `</p>
            <p class="post-content" >` + "Category: " + posts[i].PostCat + `</p>
            <p class="post-content" >` + "Title: " + posts[i].PostTitl + `</p>
            <p class="post-content" >` + "Content: " + posts[i].PostCont + `</p>
            <p class="post-content" >` + "Created: " + ConvertDate(posts[i].PostTime) + `</p>

            <p class="post-content" >` + "Comment: " + `<input type="text" class="comment-content" id=commentText${posts[i].PostID}" 
            Placeholder="Comment Here..." ; >&nbsp; &nbsp; <button class="CommentBtn" id="addComment" onclick="DisplayComments(${posts[1].PostId})">`
            + "Send Comment" + `</button></p>
            </div>
            <div id="c${posts[i].PostID}" class="commentBlock" style="height: 200px;">
            <button class="HideComment" id="btn${posts[i].PostID}" onclick="CloseComments(${posts[i].PostID})">` + "Close" + `</button>
            </div>            
        `
    }
}

  //Converts JS time stamp into a string, used when displaying posts
  const ConvertDate = (date) => {
    // Seperate year, day, hour and minutes into vars
    let yyyy = date.slice(0, 4);
    let dd = date.slice(8, 10);
    let hh = date.slice(11, 13);
    let mm = date.slice(14, 16);
  
    // Get int for day of the week (0-6, Sunday-Saturday)
    const d = new Date(date);
    let dayInt = d.getDay();
    let day = "";
    switch (dayInt) {
      case 0:
        day = "Sunday";
        break;
      case 1:
        day = "Monday";
        break;
      case 2:
        day = "Tuesday";
        break;
      case 3:
        day = "Wednesday";
        break;
      case 4:
        day = "Thursday";
        break;
      case 5:
        day = "Friday";
        break;
      case 6:
        day = "Saturday";
        break;
    }
  
    // Get int for month (0-11, January-December)
    let monthInt = d.getMonth();
    let month = "";
    switch (monthInt) {
      case 0:
        month = "January";
        break;
      case 1:
        month = "February";
        break;
      case 2:
        month = "March";
        break;
      case 3:
        month = "April";
        break;
      case 4:
        month = "May";
        break;
      case 5:
        month = "June";
        break;
      case 6:
        month = "July";
        break;
      case 7:
        month = "August";
        break;
      case 8:
        month = "September";
        break;
      case 9:
        month = "October";
        break;
      case 10:
        month = "November";
        break;
      case 11:
        month = "December";
        break;
    }
    fullDate =
      day + ", " + dd + " " + month + ", " + yyyy + " @ " + hh + ":" + mm;
    return fullDate;
  }