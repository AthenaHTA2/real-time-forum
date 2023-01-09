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
	var userID = GetUserID()
	fmt.Println(userID)
	var nkName = GetNickName()
	fmt.Println(nkName)
	var postTime = time.Now()
	fmt.Println(postTime)

	//input post data into post table
	bytes, err := io.ReadAll(r.Body)
	if err != nil {
		log.Fatal(err, "Error with reading BODY line 22")
	}
	fmt.Println("json from post:", string(bytes))

	json.Unmarshal(bytes, &thePost)
	fmt.Println("post vlaues", thePost)
	fmt.Println("This is the POST:", thePost)

	_, err = sqldb.DB.Exec(`INSERT INTO Posts (
		authorID,
		author,
		title,
		content,
		category,
		createDate
		)VALUES(?,?,?,?,?,?)`, userID, nkName, thePost.Title, thePost.Content, thePost.Category, postTime)

	if err != nil {
		fmt.Println("Error inserting into POSTS table: line 44")
		return
	}
}
