//Put post data into a JS object if user clicks 'Create Post' button
const AddPost = document.querySelector("#addPost")
AddPost.onclick = (e) => {
    //stop the browser from refreshing 
    e.preventDefault();
    
    //grab the post data
    let PostTitle = document.querySelector("#PostTitle").value
    let PostContent = document.querySelector("#PostContent").value
    let PostCategory = document.querySelector("#PostCat").value

    console.log(PostTitle, PostContent,PostCategory)

    //populate JS object with the post Data
    let PostData = {
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
        console.log("RegDataSuccess:", response)

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