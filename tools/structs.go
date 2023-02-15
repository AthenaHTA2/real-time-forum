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
	Notification []Notification `json:"Notifications"`

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

type Message struct {
	MessageID int
	ChatID int
	Sender string `json:"sender"`
	Recipient string `json:"recipient"`
	Content string `json:"content"`
	Type string
	Date time.Time `json:"date"`
}

type Chat struct {
	ChatID int
	User1 string
	User2 string
	Date string
}

type ChatHistoryCheck struct {
	ChatID int
	ChatExists bool
	// ChatHistory []Message
}

type Notification struct {
	NotificationID int
	NotificationSender string `json:"notificationsender"`
	NotificationRecipient string `json:"notificationrecipient"`
	NotificationCount int `json:"notificationcount"`
	NotificationSeen string `json:"notificationseen"`
}

type NotificationCheck struct {
	NotificationID int
	NotifExists bool
}