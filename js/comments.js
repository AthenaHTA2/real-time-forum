  //Unhides a post's comments section
  function DisplayComments(id) {
    //console.log(id)
    //select the comment input for a particular post 
    let commentText = document.querySelector("#commentTxt"+id).value
    let commentBlock = document.querySelector("#c"+id)
    let clearCommentBtn = document.querySelector("#btn"+id)
    commentBlock.style.visibility = "visible"
    SendCommentToDB(commentText, id)
    //show comments section, including the cancel button
    clearCommentBtn.style.visibility = "visible"
    refreshComments()
  }

  //hides a post's comments section
  function CloseComments(id){
    let commentBlock = document.querySelector("#c"+id)
    let clearCommentBtn = document.querySelector("#btn"+id)
    commentBlock.style.visibility = "hidden"
    clearCommentBtn.style.visibility = "hidden"
  }

  //send comment, post ID, and session cookie to the database
  function SendCommentToDB(comment, id){
    let commentText = document.querySelector("#commentTxt"+id)
    //clear the comment from text input
    commentText.value = ""
    let commentBlock = document.querySelector("#c"+id)
    //append the latest comment to the comments section
      let item = document.createElement('p');
      item.innerHTML = `${comment}`;
      commentBlock.appendChild(item)

     
        let theCookie = GetCookie("user_session")
        console.log({theCookie})
        let CommentContent = comment
        let PostID = id
        let CommentCookie = theCookie
     
      console.log(CommentContent, PostID, CommentCookie)
      //populate JS object with comment data
      let CommentData = {
        CommContent: CommentContent,
        PstID: PostID,
        CommCookie: CommentCookie,
      }
      //send user comment to the 'comment' struct in go
      // via the '/comment' handler function in go
  let configComment = {
    method: "POST",
    headers: {
     "Content-Type": "application/json",
      "Accept": "application/json",
    },
    body: JSON.stringify(CommentData)
  };
  fetch("http://localhost:8080/comment", configComment)
  .then(function(response) {
    //console.log('PostDataSuccess:', response)
    if(!response.ok){
      unsuccessfulComment() 
    }else{
      successfulComment() 
    }
  })
  }

  //If post has been successfully sent to back-end
  function successfulComment() {
    console.log("success - status 200")

  }

  //If problems emerge when sending post to back-end
  function unsuccessfulComment() {
    console.log("failed - not status 200")
  }

  //fetch comments data and display in front-end
  function refreshComments(){
    fetch("/getComments", {
      headers : {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      method: "POST",

    })
    .then((response)=> {
      response.text().then(function(data){
        let comments = JSON.parse(data);
        console.log("comments:", comments);
        //post shows all latest posts from database
        displayComments(comments)
      });
    })
    .catch((error) => {
      console.log(error);
    });
  }

  //To display comments history in front-end
  function displayComments(comments) {
    console.log("called", comments)
    
    // postsContainer.innerHTML = "";
    for (let i = comments.length - 1; i >= 0; i--) {
      let commentsContainer = document.querySelector(`#c${comments[i].PstID}`)
      commentsContainer.innerHTML += `
      <div class="comment-container"><p class='' >`+ "Author: " + comments[i].Author + `</p><p class=''>`+ "Comment: " + comments[i].CommContent + `</p><p class=''>`+ "Time: " + comments[i].CommentTime + `</p></div>
      `
    //   <p class='post-content'>`+ "Comment: " + `<input type="text" class='comment-content' id="commentTxt${comments[i].PostID}" placeholder="Write a comment.." ; >&nbsp; &nbsp;<button class="button commentBtn" id="addComment"  onclick= 'DisplayComments(${comments[i].PostID})'> ` + "Send comment" + `</button></p>
    //   <div id="c${comments[i].PostID}" class="posts commentBlock">
    //   <button class="button hideCommentBtn" id="btn${comments[i].PostID}"  onclick= 'CloseComments(${comments[i].PostID})'> ` + "Close" + `</button>
    //   </div>
    //   </div>
    }
}
