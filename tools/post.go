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

/*
//post struct to hold post data
type post struct {
PostID int json:"postID"
Author string json:"author"
Title string json:"title"
Content string json:"content"
Category string json:"category"
PostTime string json:"postTime"
Cookie string json:"cookie"
}
*/

//function to handle post creation
func Posts(w http.ResponseWriter, r *http.Request) {

	var postTime = time.Now()

	//read post data from request body
	bytes, err := io.ReadAll(r.Body)
	if err != nil {
		log.Fatal(err, "error with reading file Posts line 17")
	}

	//unmarshal json data into post struct
	var thePost post
	json.Unmarshal(bytes, &thePost)

	//get user ID based on cookie
	CookieID := thePost.Cookie
	usr := GetUserByCookie(CookieID)
	usrID := usr.UserID

	//insert post data into database
	_, err = sqldb.DB.Exec(`INSERT INTO Posts (
	authorID,
	author,
	title,
	content,
	category,
	category_2,
	creationDate,
	cookieID
	) VALUES(?,?,?,?,?,?,?)`, usrID, usr.NickName, thePost.Title, thePost.Content, thePost.Category, postTime, thePost.Cookie)
	if err != nil {
		fmt.Println("Error inserting into 'Posts' table: ", err)
		return
	}
}

//function to retrieve all posts from the database
func GetPosts() []post {
	var posts []post
	var myPost post

	rows, errPost := sqldb.DB.Query("SELECT postID, author, category, category_2, title, content, creationDate FROM Posts;")
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

		//aggregate all posts separated by '\n'
		posts = append(posts, myPost)
	}
	rows.Close()

	return posts

}

//handle to send all posts to front-end
func SendLatestPosts(w http.ResponseWriter, r *http.Request) {
	//send post data to client in json format
	var posts []post

	//get all posts from database
	rows, err := sqldb.DB.Query("SELECT postID, author, category,caregory_2, title, content, creationDate FROM Posts;")
	if err != nil {
		log.Println("Error retrieving posts from database: ", err)
		w.WriteHeader(http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	//iterate through each row and store data in post struct
	for rows.Next() {
		var p post
		err := rows.Scan(&p.PostID, &p.Author, &p.Category, &p.Title, &p.Content, &p.PostTime)
		if err != nil {
			log.Println("Error scanning post data: ", err)
			w.WriteHeader(http.StatusInternalServerError)
			return
		}
		posts = append(posts, p)
	}

	//marshal post data to json
	js, err := json.Marshal(posts)
	if err != nil {
		log.Println("Error marshalling post data: ", err)
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	//send json data to client
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	w.Write(js)
}

// Modify function of post struct that modifies the cookie value
func (p *post) Modify(ck string) {
	p.Cookie = ck
}
