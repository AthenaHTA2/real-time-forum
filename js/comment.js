
// Unhides a post's comments section
function DisplayComments(id) {
  // Select the comment input for a particular post 
  let commentText = document.querySelector("#commentTxt"+id).value
  let commentBlock = document.querySelector("#c"+id)
  let clearCommentBtn = document.querySelector("#btn"+id)
  commentBlock.style.display = "block"
  SendCommentToDB(commentText, id)
  // Show comments section, including the cancel button
  clearCommentBtn.style.visibility = "visible"
  refreshComments(id)
}
// Hides a post's comments section
function CloseComments(id){
  let commentBlock = document.querySelector("#c"+id)
  let clearCommentBtn = document.querySelector("#btn"+id)
  commentBlock.style.display = "none"
  clearCommentBtn.style.visibility = "hidden"
}
// Send comment, post ID, and session cookie to the database
function SendCommentToDB(comment, id){
  let commentText = document.querySelector("#commentTxt"+id)
  // Clear the comment from text input
  commentText.value = ""
  // Not needed: append the latest comment to the comments section
  // let commentBlock = document.querySelector("#c"+id)
  // let item = document.createElement('p');
  // item.innerHTML = `${comment}`;
  // commentBlock.appendChild(item)

  // Get the session cookie
  let theCookie = GetCookie("user_session")
  console.log({theCookie})
  let CommentContent = comment
  let PostID = id
  let CommentCookie = theCookie

  console.log(CommentContent, PostID, CommentCookie)
  // Populate JS object with comment data
  let CommentData = {
      CommContent: CommentContent,
      PstID: PostID,
      CommCookie: CommentCookie,
  }
  // Send user comment to the 'comment' struct in go
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
          // console.log('PostDataSuccess:', response)
          if (!response.ok) {
              unsuccessfulComment()
          } else {
              successfulComment()
          }
      })
}
// If post has been successfully sent to back-end
function successfulComment() {
  console.log("success - status 200")
}
// If problems emerge when sending post to back-end
function unsuccessfulComment() {
  console.log("failed - not status 200")
}


//fetch comments data and display in front-end
function refreshComments(id){
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
      displayCommentsHist(comments, id)
    });
  })
  .catch((error) => {
    console.log(error);
  });
}
//To display comments history in front-end
function displayCommentsHist(comments, id) {
  console.log("called", comments)
  console.log(id)
  let commentsContainer = document.querySelector(`#c${id}`)
  commentsContainer.innerHTML = `<button class="button" id="btn${id}"  onclick= 'CloseComments(${id})'> ` + "Close" + `</button>`;
  for (let i = comments.length - 1; i >= 0; i--) {
      if (comments[i].PstID !== id) {
          continue
      }
    commentsContainer.innerHTML += `
    <div class="comment-container"><p class='' >`+ "Author: " + comments[i].Author + `</p>&nbsp;&nbsp;<p class=''>`+ "Comment: " + comments[i].CommContent + `</p>&nbsp;&nbsp;<p class=''>`+ "Time: " + ConvertDate(comments[i].CommentTime) + `</p></div>
    `
  }
}



