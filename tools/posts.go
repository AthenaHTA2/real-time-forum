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
	var usrID = GetUserID()
	fmt.Println(usrID)
	var nkName = GetNickName()
	fmt.Println(nkName)
	var postTime = time.Now()

	//input post data into post table
	bytes, err := io.ReadAll(r.Body)
	if err != nil {
		log.Fatal(err)
	}
	fmt.Println("Json from post: ", string(bytes))

	json.Unmarshal(bytes, &thePost)
	fmt.Println("post values", thePost)

	_, err = sqldb.DB.Exec(`INSERT INTO Posts ( 
		authorID,
		author,
		title,
		content,
		category,
		creationDate
		) VALUES(?,?,?,?,?,?)`, usrID, nkName, thePost.Title, thePost.Content, thePost.Category, postTime)

	if err != nil {
		fmt.Println("Error inserting into 'Posts' table: ", err)
		return
	}
}
