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
	fmt.Println("Json from post: ", string(bytes))

	json.Unmarshal(bytes, &thePost)
	fmt.Println("post struct values", thePost)
	fmt.Println("the post after adding cookie:", thePost)
	CookieID := thePost.Cookie
	fmt.Println("CookieID:", CookieID)
	var usr = GetUserByCookie(CookieID)
	fmt.Println("the user data:", usr)
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

//to modify the 'Cookie' field of the post struct
func (p *post) Modify(ck string) {
	p.Cookie = ck
}
