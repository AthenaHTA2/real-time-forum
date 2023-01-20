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
	stmnt, err := sqldb.DB.Prepare("INSERT OR IGNORE INTO Session ( userID, cookieName, cookieValue) VALUES (?, ?, ?)")
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
	fmt.Println("Cookie struct data: ", session)
	return cookie
}

// IsUserAuthenticated ...
func IsUserAuthenticated(w http.ResponseWriter, u *User) error {
	var cookieValue string
	fmt.Println("running inside is user authenticated:     ")
	fmt.Println("u.username:     ", u.NickName)

	//if user is not found in 'Sessions' db table return err = nil
	if err := sqldb.DB.QueryRow("SELECT cookieValue FROM Sessions WHERE userID = ?", u.UserID).Scan(&cookieValue); err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		fmt.Println("checking sessions table err:     ", err)
		return nil
	}

	if err := DeleteSession(w, cookieValue); err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		fmt.Println("inside delete sessions:     ", err)
		return err
	}
	return nil
}

// User's cookie expires when browser is closed, delete the cookie from the database.
func DeleteSession(w http.ResponseWriter, cookieValue string) error {

	// //first set cookieValue from browser to empty when browser is closed
	// cookie := &http.Cookie{
	// 	Name:     "user_session",
	// 	Value:    "",
	// 	MaxAge:   -1,
	// 	HttpOnly: true,
	// }
	// http.SetCookie(w, cookie)

	
	//removing session record from 'Sessions' table
	stmt, err := sqldb.DB.Prepare("DELETE FROM Sessions WHERE cookieValue = ? ;")
	defer stmt.Close()
	stmt.Exec(cookieValue)

	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		fmt.Println("DeleteSession err: ", err)
		return err
	}

	return nil
}

// logout handle
func Logout(w http.ResponseWriter, r *http.Request) {
	if r.URL.Path == "/logout" {
		c, err := r.Cookie("session_token")
		if err != nil {
			AddSession(w, "guest", nil)
			http.Redirect(w, r, "/", http.StatusSeeOther)
			fmt.Println("Logout error: ", err)
		}
		DeleteSession(w, c.Value)
		fmt.Println("user logged out")
		http.Redirect(w, r, "/", http.StatusFound)
	}
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

// NewUser ...
func NewUser() *User {
	return &User{}
}

// FindByUserID ...
func FindByUserID(UID int64) *User {
	u := NewUser()
	if err := sqldb.DB.QueryRow("SELECT userID, firstName, lastName, nickName, age, gender, email, passwordhash FROM Users WHERE userID = ?", UID).
		Scan(&u.UserID, &u.FirstName, &u.LastName, &u.NickName, &u.Age, &u.Gender, &u.Email, &u.Password); err != nil {
		fmt.Println("error FindByUserID: ", err)
		return nil
	}
	return u
}

