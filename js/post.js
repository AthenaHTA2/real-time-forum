
  
    //Put post data into a JS object if user clicks 'Create Post' button
  
  const AddPost = document.querySelector("#addPost")
  AddPost.onclick= (e)=>{
    //stop browser refreshing
    e.preventDefault();
    //grab post data
    let theCookie = GetCookie("user_session")
    console.log({theCookie})
    //let PostCookieID = "5ddb3d0b-5755-4f67-8bde-6df3258a657b"
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
      
      

           /* function GetCookie(cname) {
        console.log(cname, "++++", document.cookie)
        let name = cname + "=";
        let decodedCookie = decodeURIComponent(document.cookie);
        let ca = decodedCookie.split(';');
        for(let i = 0; i <ca.length; i++) {
          let c = ca[i];
          while (c.charAt(0) == ' ') {
            c = c.substring(1);
          }
          if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
          }
        }
        return "";
      }*/
    
  