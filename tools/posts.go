package tools

import (
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"rtforum/sqldb"
	"time"
)

var thePost post

func Posts(w http.ResponseWriter, r *http.Request) {

	var postTime = time.Now()

	//input post data into post table
	bytes, err := io.ReadAll(r.Body)
	if err != nil {
		log.Fatal(err)
	}
	//fmt.Println("Json from post: ", string(bytes))

	json.Unmarshal(bytes, &thePost)
	//fmt.Println("post struct values", thePost)
	//fmt.Println("the post after adding cookie:", thePost)
	CookieID := thePost.Cookie
	//fmt.Println("CookieID:", CookieID)
	var usr = GetUserByCookie(CookieID)
	//fmt.Println("the user data:", usr)
	//get user name and user ID
	var nkName = usr.NickName
	var usrID = usr.UserID

	_, err = sqldb.DB.Exec(`INSERT INTO Posts ( 
		authorID,
		author,
		title,
		content,
		category,
		creationDate,
		cookieID
		) VALUES(?,?,?,?,?,?,?)`, usrID, nkName, thePost.Title, thePost.Content, thePost.Category, postTime, thePost.Cookie)

	if err != nil {
		fmt.Println("Error inserting into 'Posts' table: ", err)
		return
	}
}

//Retrieve all posts from database
func GetPosts() []post {

	var posts []post
	var myPost post

	rows, errPost := sqldb.DB.Query("SELECT postID, author, category, title, content, creationDate FROM Posts;")
	if errPost != nil {
		fmt.Println("Error retrieving posts from database: \n", errPost)
		return nil
	}
	for rows.Next() {

		//copy row columns into corresponding variables
		err := rows.Scan(&myPost.PostID, &myPost.Author, &myPost.Category, &myPost.Title, &myPost.Content, &myPost.PostTime)
		if err != nil {
			fmt.Println("error copying post data: ", err)
		}
		//collect each post's data into 'tempPost'
		//tempPost = auth + " " + cat + " " + titl + " " + cont
		//aggregate all posts separated by '\n'
		posts = append(posts, myPost)
	}
	rows.Close()
	/*for _, post := range postItems {
		fmt.Println(string(post))
	}*/

	return posts
}

//To send all posts to front-end via http handle: "/getPosts"
func SendLatestPosts(w http.ResponseWriter, r *http.Request) {
	//Send user information back to client using JSON format
	posts := GetPosts()
	js, err := json.Marshal(posts)
	if err != nil {
		log.Fatal(err)
	}
	w.WriteHeader(http.StatusOK) //Ceck in authentication.js, alerts user
	w.Write([]byte(js))
}

//LEGACY: To send posts via a websocket, no longer used
//Retrieves all posts from db that will be shown in front-end working but doesn't have post fields
/*func AllPosts() []byte {
	//double space at start of websocket message signals that this is the list of posts
	postItems := "  "
	var (
		tempPost, auth, cat, titl, cont string
	)
	rows, errPost := sqldb.DB.Query("SELECT author, category, title, content FROM Posts ORDER BY creationDate ASC;")
	if errPost != nil {
		fmt.Println("Error retrieving posts from database: \n", errPost)
		return nil
	}
	for rows.Next() {

		//copy row columns into corresponding variables
		err := rows.Scan(&auth, &cat, &titl, &cont)
		if err != nil {
			fmt.Println("error copying post data: ", err)
		}
		//collect each post's data into 'tempPost'
		tempPost = auth + " " + cat + " " + titl + " " + cont
		//aggregate all posts separated by '\n'
		postItems = postItems + "\n" + tempPost
	}
	rows.Close()
	//for _, post := range postItems {
	//	fmt.Println(string(post))
	//}

	return []byte(postItems)
}*/

//to modify the 'Cookie' field of the post struct, not used
func (p *post) Modify(ck string) {
	p.Cookie = ck
}
