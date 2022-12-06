package tools

import (
	"time"

	_ "github.com/mattn/go-sqlite3"
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

type User struct {
	Username  string
	FirstName string `json:"FirstName"`
	LastName  string `json:"LastName"`
	NickName  string `json:"NickName"`
	Age       int    `json:"AgeReg"`
	Gender    string `json:"GenderReg"`
	Email     string `json:"EmailReg"`
	Access    int    // 0 means no access, not logged in
	LoggedIn  bool
	Posts     []post
	Comments  []comment
	Password  string `json:"PassWdReg"`
}

//Redundant: using the Users struct instead
/*type RegData struct {
	FirstName string `json:"FirstName"`
	LastName  string `json:"LastName"`
	NickName  string `json:"NickName"`
	AgeReg    int    `json:"AgeReg"`
	GenderReg string `json:"GenderReg"`
	EmailReg  string `json:"EmailReg"`
	PassWdReg string `json:"PassWdReg"`
}*/

type LoginData struct {
	UserName string `json:"UserName"`
	LoginPw  string `json:"LoginPw"`
}
