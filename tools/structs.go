package tools

import (
	"time"
)

type comment struct {
	CommentID      int
	Author         string
	PostID         int
	Content        string
	CommentTime    time.Time
	CommentTimeStr string
}

type post struct {
	PostID      int
	Author      string // author
	Title       string
	Content     string
	Category    string
	PostTime    time.Time
	PostTimeStr string
	Comments    []comment
	IPs         string
}

type user struct {
	Username  string
	FirstName string
	LastName  string
	NickName  string
	Age       string
	Gender    string
	Email     string
	Access    int // 0 means no access, not logged in
	LoggedIn  bool
	Posts     []post
	Comments  []comment
	Password  string
}
