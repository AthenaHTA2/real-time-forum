
  
    //Put post data into a JS object if user clicks 'Create Post' button
  
  const AddPost = document.querySelector("#addPost")
  AddPost.onclick= (e)=>{
    //stop browser refreshing
    e.preventDefault();
    //grab post data
    let allCookies = document.cookie.valueOf
    console.log({allCookies})
    let PostCookieID = "5ddb3d0b-5755-4f67-8bde-6df3258a657b"
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
  
      
      
  //send user input in the 'post' form to the 'Data' struct in go
  // via the 'Register' handler function in go
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
          //if(!response.ok){throw response}
          //console.log('RegDataSuccess:', response)
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
    
  