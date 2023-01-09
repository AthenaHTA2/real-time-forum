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
	Cookie      string `json:"PstCookieID"`
	Title       string `json:"PstTitle"`
	Content     string `json:"PstContent"`
	Category    string `json:"PstCateg"`
	PostTime    time.Time
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

type LoginData struct {
	UserName string `json:"UserName"`
	Password string `json:"LoginPw"`
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

/* GO documentation - structure of a cookie:
type Cookie struct {
	Name string
	Value string
	Path string // optional
	Domain string // optional
	Expires time.Time //optional
	RawExpires string // for reading cookies only
	//MaxAge = 0 means no 'Max-Age' attribute specified
	//MaxAge<0 means delete cookie now, equivalently 'Max-Age: 0'
	//MaxAge>0 means Max-Age attribute present and given in seconds
	MaxAge int //set MaxAge: -1 to log out
	Secure bool
	HttpOnly bool
	Raw string
	Unparsed []string //Raw text of unparsed attribute-value pairs
}*/
