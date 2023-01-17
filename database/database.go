package database

import (
	"rtforum/sqldb"
)

func CreateDB() {
	// user table
	sqldb.DB.Exec(`CREATE TABLE IF NOT EXISTS "Users" (
				"userID" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, 
				"firstName" TEXT NOT NULL,
				"lastName" TEXT NOT NULL,				
				"nickName" TEXT NOT NULL,
				"age" INTEGER NOT NULL,
				"gender" TEXT NOT NULL,
				"email" TEXT NOT NULL UNIQUE, 
				"passwordhash" BLOB NOT NULL
				);`)
	// post table
	sqldb.DB.Exec(`CREATE TABLE IF NOT EXISTS "Posts" ( 
				"postID" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, 
				"authorID" INTEGER NOT NULL,
				"author" TEXT NOT NULL,
				"title" TEXT NOT NULL, 
				"content" TEXT NOT NULL, 
				"category" TEXT NOT NULL,
				"creationDate" TIMESTAMP,
				"cookieID" TEXT NOT NULL,
				FOREIGN KEY(authorID)REFERENCES users(userID)
				);`)
	// category table TABLE NOT USED YET
	sqldb.DB.Exec(`CREATE TABLE IF NOT EXISTS "Category" (
				"postID" INTEGER REFERENCES post(postID), 
				"category" TEXT NOT NULL
				);`)
	// comments table
	sqldb.DB.Exec(`CREATE TABLE IF NOT EXISTS "Comments" ( 
				"commentID" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, 
				"postID" INTEGER NOT NULL,
				"authorID" INTEGER NOT NULL,
				"author" TEXT NOT NULL,
				"content" TEXT NOT NULL, 
				"creationDate" TIMESTAMP,
				FOREIGN KEY(postID)REFERENCES posts(postID),
				FOREIGN KEY(authorID)REFERENCES users(userID)
				);`)
	// sessions table
	sqldb.DB.Exec(`CREATE TABLE IF NOT EXISTS "Sessions" ( 
				"userID" INTEGER NOT NULL,
				"cookieName" TEXT NOT NULL,
				"cookieValue" STRING NOT NULL PRIMARY KEY, 
				FOREIGN KEY(userID)REFERENCES Users(userID)
				);`)
}
