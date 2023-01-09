package tools

import (
	"fmt"
	"log"
	"net/http"
	"rtforum/sqldb"
	"time"

	uuid "github.com/satori/go.uuid"
)

// NewSession ...
func NewSession() *Session {
	return &Session{}
}

// AddSession ...
func AddSession(w http.ResponseWriter, sessionName string, user *User) {
	sessionToken := uuid.NewV4().String()
	expiresAt := time.Now().Add(120 * time.Minute)
	cookieSession := &http.Cookie{
		Name:    sessionName,
		Value:   sessionToken,
		Expires: expiresAt,
	}
	http.SetCookie(w, cookieSession)
	if sessionName != "guest" {
		InsertSession(user, cookieSession)
	}
}

// InsertSession ...
func InsertSession(u *User, session *http.Cookie) *Session {
	cookie := NewSession()
	stmnt, err := sqldb.DB.Prepare("INSERT OR IGNORE INTO Sessions (userID, cookieName, cookieValue) VALUES (?, ?, ?)")
	if err != nil {
		log.Fatalf(err.Error())
	}
	_, err = stmnt.Exec(u.UserID, session.Name, session.Value)
	if err != nil {
		fmt.Println("AddSession error inserting into DB: ", err)
	}
	cookie.sessionName = session.Name
	cookie.sessionUUID = session.Value
	cookie.UserID = u.UserID
	return cookie
}

// IsUserAuthenticated ...
func IsUserAuthenticated(w http.ResponseWriter, u *User) error {
	var cookieValue string
	//if user is not found in "sessions" db table return err = nil
	if err := sqldb.DB.QueryRow("SELECT sessionID FROM Sessions WHERE userID = ?", u.UserID).Scan(&cookieValue); err != nil {
		return nil
	}
	if err := DeleteSession(w, cookieValue); err != nil {
		return err
	}
	return nil
}

// User's cookie expires when browser is closed, delete the cookie from the database.
func DeleteSession(w http.ResponseWriter, cookieValue string) error {
	cookie := &http.Cookie{
		Name:     CurrentUser.NickName + "Session_token",
		Value:    "",
		MaxAge:   -1,
		HttpOnly: true,
	}
	http.SetCookie(w, cookie)
	//removing session record from 'sessions' table
	stmt, err := sqldb.DB.Prepare("DELETE FROM Sessions WHERE sessionID = ?;")
	if err != nil {
		log.Fatalf(err.Error())
	}
	defer stmt.Close()
	stmt.Exec(cookieValue)
	if err != nil {
		fmt.Println("DeleteSession err: ", err)
		return err
	}
	return nil
}

// GetUserByCookie ...
func GetUserByCookie(cookieValue string) *User {
	var userID int64
	if err := sqldb.DB.QueryRow("SELECT userID from Sessions WHERE cookieValue = ?", cookieValue).Scan(&userID); err != nil {
		return nil
	}
	u := FindByUserID(userID)
	return u
}

//function for new user
func NewUser() *User {
	return &User{}
}

//Find the user by their ID
func FindByUserID(UID int64) *User {
	u:= NewUser()

	if err := sqldb.DB.QueryRow("SELECT * FROM Users WHERE userID = ?", UID).
			Scan(&u.UserID, &u.FirstName, &u.LastName, &u.NickName, &u.Age, &u.Gender, &u.Email,
				 &u.Access, &u.LoggedIn, &u.Posts, &u.Comments, &u.Password); err != nil {
					fmt.Println("error finding user by ID line 93", err)
					return nil
				 }
				 return u
}
