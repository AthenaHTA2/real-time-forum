
    //Sending post data to the back end
    //Put post data into a JS object if user clicks 'Create Post' button
  
  const AddPost = document.querySelector("#addPost")
  AddPost.onclick= (e)=>{
    //stop browser refreshing
    e.preventDefault();
    //grab post data
    let theCookie = GetCookie("user_session")
    console.log({theCookie})
    let PostCookieID = theCookie
    let PostTitle = document.querySelector("#PostTitle").value
    let PostContent = document.querySelector("#PostContent").value
    let PostCateg = document.querySelector("#PostCat").value
   
    console.log(PostTitle, PostContent, PostCateg)
    //populate JS object with post data
    let PostData = {
      PstCookieID: PostCookieID,
      PstTitle: PostTitle,
      PstContent: PostContent,
      PstCateg: PostCateg,
    }
      console.log({PostData})
  
      
      
  //send user input in the 'post' form to the back-end
  // via the '/post' handler function in go
      let configPost = {
        method: "POST",
        headers: {
         "Content-Type": "application/json",
          "Accept": "application/json",
        },
        body: JSON.stringify(PostData)
      };
      
      fetch("http://localhost:8080/post", configPost)
        .then(function(response) {
          //console.log('PostDataSuccess:', response)
          if(!response.ok){
            unsuccessfulPost() 
          }else{
            successfulPost() 
          }
        })
  
      }
  
      function successfulPost() {
        console.log("success - status 200")
        PostTitle.value = ""
        PostContent.value = ""
        document.querySelector("#PostCat").value = ""
 
      }
  
  
  
      function unsuccessfulPost() {
        console.log("failed - not status 200")
    
      }


            //get session cookie to link post to user
            function GetCookie(name) {
              //split cookie string and get all individual
              //name=value pairs in an array
              console.log(document.cookie)
              var cookieArr = document.cookie.split(';');
              console.log({cookieArr})
               //Loop through array elements
               for (var i = 0; i < cookieArr.length; i++){
                var cookiePair =  cookieArr[i].split('=');
               
              //Removing white space from the beginning of the cookie
              //name and compare it with the given string
               if(name == cookiePair[0].trim()){
                //decode the cookie value and return
                return cookiePair[1];
               }
              }
              //Return null if not found
              return null;
             }

  //retrieving all posts from the back end
  function getPosts() {
    fetch()
  }

  function refreshPosts(){
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


    function displayPosts(posts) {
      console.log("called", posts)
      postsContainer = document.querySelector("#postList")
      postsContainer.innerHTML = "";
      for (let i = posts.length - 1; i >= 0; i--) {
        postsContainer.innerHTML += `
        <div class ="posts" id=` + posts[i].PostID + `>
        <p class='post-content' >`+ "Author: " + posts[i].Author + `</p>
        <p class='post-content'>`+ "Category: " + posts[i].PstCateg + `</p>
        <p class='post-content'>`+ "Title: " + posts[i].PstTitle + `</p>
        <p class='post-content'>`+ "Content: " + posts[i].PstContent + `</p>
        <p class='post-content'>`+ "Creation Time: " + ConvertDate(posts[i].PostTime) + `</p>
        
        <p class='post-content'>`+ "Comment: " + `<input type="text" class='comment-content' id="commentTxt${posts[i].PostID}" placeholder="Write a comment.." ; >&nbsp; &nbsp;<button class="button commentBtn" id="addComment"  onclick= 'DisplayComments(${posts[i].PostID})'> ` + "Send comment" + `</button></p>
        </div>
        <div id="c${posts[i].PostID}" class="commentBlock" style='height: 400px;'>
        <button class="button hideCommentBtn" id="btn${posts[i].PostID}"  onclick= 'CloseComments(${posts[i].PostID})'> ` + "Close" + `</button>
        </div>
        `
      }
  }



  //Converts JS time stamp into a string, used when displaying posts
  function ConvertDate(date) {
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
    
