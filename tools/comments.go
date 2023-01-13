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

//instantiate a comment struct
var theComment comment

func Comments(w http.ResponseWriter, r *http.Request) {

	var commentTime = time.Now()

	//input comment data into Comments table
	bytes, err := io.ReadAll(r.Body)
	if err != nil {
		log.Fatal(err)
	}
	//write comment data into 'theComment' struct pointer
	json.Unmarshal(bytes, &theComment)
	fmt.Println("comment struct values", theComment)
	CookieID := theComment.Cookie
	fmt.Println("CookieID:", CookieID)
	var usr = GetUserByCookie(CookieID)
	fmt.Println("the user data:", usr)
	//get user name and user ID
	var nkName = usr.NickName
	var usrID = usr.UserID

	_, err = sqldb.DB.Exec(`INSERT INTO Comments ( 
		postID,
		authorID,
		author,
		content,
		creationDate
		) VALUES(?,?,?,?,?)`, &theComment.PostID, usrID, nkName, &theComment.Content, commentTime)

	if err != nil {
		fmt.Println("Error inserting into 'Comments' table: ", err)
		return
	}
}

//Get all comments from database
func GetDBComments() []comment {
	var allComments []comment

	rows, errComment := sqldb.DB.Query("SELECT commentID, postID, author, content, creationDate FROM Comments ORDER BY creationDate ASC;")
	if errComment != nil {
		fmt.Println("Error retrieving comments from database: \n", errComment)
		return nil
	}
	for rows.Next() {

		//copy selected columns in a row into corresponding struct variables
		err := rows.Scan(&theComment.CommentID, &theComment.PostID, &theComment.Author, &theComment.Content, &theComment.CommentTime)
		if err != nil {
			fmt.Println("error copying post data: ", err)
		}

		//append each comment into a slice of comments
		allComments = append(allComments, theComment)
	}
	rows.Close()
	/*for _, comment := range allComments {
		fmt.Println(string(comment))
	}*/

	return allComments
}

//Send comments to front-end via http handle: "/getComments"
func SendLatestComments(w http.ResponseWriter, r *http.Request) {
	//Send comments back to client front-end using JSON format
	comments := GetDBComments()
	jsComm, err := json.Marshal(comments)
	if err != nil {
		log.Fatal(err)
	}
	w.WriteHeader(http.StatusOK) //alerts user
	w.Write([]byte(jsComm))
}
