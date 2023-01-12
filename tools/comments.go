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
