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
	if err := sqldb.DB.QueryRow("SELECT cookieValue FROM Sessions WHERE userID = ?", u.UserID).Scan(&cookieValue); err != nil {
		return nil
	}
	if err := DeleteSession(w, cookieValue); err != nil {
		return err
	}
	return nil
}

/*
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

*/
//corrected
/*
"DeleteSession" function takes in two parameters: a http.ResponseWriter and a string named "cookieValue".

deletesession function is doing the following:
Creating a new cookie with the name of CurrentUser.NickName + "Session_token" and value "",
setting its MaxAge to -1, and setting HttpOnly to true, which means that the cookie can only
 be accessed by the server and not by client-side scripts.
Using the http.SetCookie function to set the cookie on the client's browser.
Prepare a SQL statement to delete a session record from the 'sessions' table in the database
with the session ID equals to the cookieValue.
Executing the prepared statement and handling any errors that may occur.
Returning nil if there are no errors.

few things that can be corrected:
 to check if the error returned from the Prepare statement and stmt.Exec
is not nil and return it instead of logging it and continue the execution.
The function is returning an error type but no error is returned. It is better to return an error
if there's any occurred.
The defer statement is useless in this case, because the statement is closed at the end of the
function, no need to defer it.
*/

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
		return err
	}
	_, err = stmt.Exec(cookieValue)
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
	u := NewUser()

	if err := sqldb.DB.QueryRow("SELECT userID, firstName, lastNamme, nickName, age, gender, email, passwordhash FROM Users WHERE userID = ?", UID).
		Scan(&u.UserID, &u.FirstName, &u.LastName, &u.NickName, &u.Age, &u.Gender, &u.Email,
			&u.Password); err != nil {
		fmt.Println("error finding user by ID line 93", err)
		return nil
	}
	return u
}
