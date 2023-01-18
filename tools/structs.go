package tools

import (
	"time"
)

type comment struct {
	CommentID      int
	Cookie         string    `json:"CommCookie"`
	Author         string    `json:"Author"`
	PostID         int       `json:"PstID"`
	Content        string    `json:"CommContent"`
	CommentTime    time.Time `json:"CommentTime"`
	CommentTimeStr string
}

type post struct {
	PostID      int       `json:"PostID"`
	Author      string    // author
	Cookie      string    `json:"PstCookieID"`
	Title       string    `json:"PstTitle"`
	Content     string    `json:"PstContent"`
	Category    string    `json:"PstCateg"`
	PostTime    time.Time `json:"PostTime"`
	PostTimeStr string
	Comments    []comment
	IPs         string
}

type User struct {
	UserID    int
	FirstName string `json:"FirstName"`
	LastName  string `json:"LastName"`
	NickName  string `json:"NickName"`
	Age       string `json:"Age"`
	Gender    string `json:"Gender"`
	Email     string `json:"Email"`
	Access    int    // 0 means no access, not logged in
	LoggedIn  bool
	Posts     []post
	Comments  []comment
	Password  string `json:"PassWord"`
}

//used for Login handler
var CurrentUser User

type LoginData struct {
	UserName string `json:"LUserName"`
	Password string `json:"LPassW"`
}

// each session contains the username of the user and the time at which it expires
type Session struct {
	UserID      int
	sessionName string
	sessionUUID string
}

type Cookie struct {
	Name    string
	Value   string
	Expires time.Time
}
