package tools

import (
	"database/sql"
	"log"

	_ "github.com/mattn/go-sqlite3"
)

func createUsersTable() {
	stmt, err := db.Prepare("CREATE TABLE IF NOT EXISTS users (userID INTERGER NOT NULL PRIMARY KEY AUTOINCREMENT, firstName VARCHAR(30) NOT NULL, lastName VARCHAR(30) NOT NULL, nickName VARCHAR(30) NOT NULL, age INTERGER AUTOINCREMENT NOT NULL, gender VARCHAR(10) NOT NULL, email VARCHAR(50), password VARCHAR(100), access INTEGER, loggedIn BOOLEAN);")
	if err != nil {
		log.Fatal(err)
	}
	defer stmt.Close()
	stmt.Exec()
}
func createSessionsTable() {
	stmt, err := db.Prepare("CREATE TABLE IF NOT EXISTS sessions (sessionID VARCHAR(50) PRIMARY KEY, userID INTEGER, FOREIGN KEY(userID) REFERENCES users(userID));")
	if err != nil {
		log.Fatal(err)
	}
	defer stmt.Close()
	stmt.Exec()
}
func createPostsTable() {
	stmt, err := db.Prepare("CREATE TABLE IF NOT EXISTS posts (postID INTEGER PRIMARY KEY AUTOINCREMENT, author VARCHAR(30), title VARCHAR(50), content VARCHAR(1000), category VARCHAR(50), postTime DATETIME, ips VARCHAR(10) , FOREIGN KEY(author) REFERENCES users(userID));")
	if err != nil {
		log.Fatal(err)
	}
	defer stmt.Close()
	stmt.Exec()
}
func createCommentsTable() {
	stmt, err := db.Prepare("CREATE TABLE IF NOT EXISTS comments (commentID INTEGER PRIMARY KEY AUTOINCREMENT, author VARCHAR(30), postID INTEGER, content VARCHAR(2000), commentTime DATETIME, FOREIGN KEY(author) REFERENCES users(userID), FOREIGN KEY(postID) REFERENCES posts(postID));")
	if err != nil {
		log.Fatal(err)
	}
	defer stmt.Close()
	stmt.Exec()
}
func InitDB() {
	db, _ = sql.Open("sqlite3", "./forum.db")
	// if err != nil {
	// 	log.Fatal(err)
	// }
	createSessionsTable()
	createUsersTable()
	createPostsTable()
	createCommentsTable()
}
