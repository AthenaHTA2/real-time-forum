package tools

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"html/template"
	"io"
	"log"
	"net/http"
	"rtforum/sqldb"
	"time"

	uuid "github.com/satori/go.uuid"
	"golang.org/x/crypto/bcrypt"
)

var db *sql.DB

func HomePage(w http.ResponseWriter, r *http.Request) {

	if r.URL.Path != "/" {
		http.Error(w, "404 Page Not Found", 404)
		return
	}

	templ, err := template.ParseFiles("templates/home.html")

	err = templ.Execute(w, "")

	if err != nil {
		http.Error(w, "Error with parsing home.html", http.StatusInternalServerError)
		return
	}

}

// func Login(w http.ResponseWriter, r *http.Request) {

// 	if r.URL.Path != "/login" {
// 		http.Error(w, "404 Page Not Found", 404)
// 		return
// 	}

// 	templ, err := template.ParseFiles("templates/home.html")

// 	err = templ.Execute(w, "")

// 	if err != nil {
// 		http.Error(w, "Error with parsing home.html", http.StatusInternalServerError)
// 		return
// 	}
// }

func Register(w http.ResponseWriter, r *http.Request) {

	var regData User

	bytes, err := io.ReadAll(r.Body)
	if err != nil {
		log.Fatal(err)
	}
	fmt.Println("Json from Regsister: ", string(bytes))

	json.Unmarshal(bytes, &regData)

	_, err = sqldb.DB.Exec(`INSERT INTO Users ( 
		firstName,
		lastName,
		nickName,
		age,
		gender,
		email,
		passwordhash
		) VALUES(?,?,?,?,?,?,?)`, regData.FirstName, regData.LastName, regData.NickName, regData.Age, regData.Gender, regData.Email, regData.Password)

	if err != nil {
		fmt.Println("Error inserting into 'Users' table: ", err)
		return
	}

	rows, _ := sqldb.DB.Query("SELECT userID, firstName, lastName, nickName, age, gender, email, passwordhash from Users")

	var (
		userID, age                                                int
		firstName, lastName, nickName, gender, email, passwordhash string
	)

	rows.Scan(&userID, &firstName, &lastName, &nickName, &age, &gender, &email, &passwordhash)
}

//function for login

func Login(w http.ResponseWriter, r *http.Request) {
	var loginData LoginData

	loginD, err := io.ReadAll(r.Body)
	if err != nil {
		log.Fatal(err)
	}

	fmt.Println("Json from Login: ", string(loginD))

	json.Unmarshal(loginD, &loginData)

	fmt.Println("LoginData struct in GO: ", loginData.UserName, loginData.Password)

	LogUserName := loginData.UserName
	LogPassword := loginData.Password

	fmt.Println("Logged in User:", LogUserName)

	// retrieve password from db to compare (hash) with user supplied password's hash
	var hash string

	stmt := "SELECT passwordhash FROM Users WHERE nickName = ?"
	row := sqldb.DB.QueryRow(stmt, LogUserName)
	err2 := row.Scan(&hash)
	if err2 != nil {
		fmt.Println("err with PASSWORD", LogUserName, LogPassword )
		fmt.Println("check username and password")
		return
	}

	// func CompareHashAndPassword(hashed password, password []byte) error
	comparePass := bcrypt.CompareHashAndPassword([]byte(hash), []byte(LogPassword))
	fmt.Println("compare 'passwordhash' with user's pw: ", comparePass)
	fmt.Println("'passwordhash' and 'hash': ", []byte(LogPassword), []byte(hash))

	//returns nil on success

	if comparePass == nil {
		stmtCurrentUser := "SELECT FROM Users WHERE nickName = ?"
		rowCurrentUser := sqldb.DB.QueryRow(stmtCurrentUser, LogUserName)

		fmt.Println(stmtCurrentUser)

		err3 := rowCurrentUser.Scan(&CurrentUser.UserID, &CurrentUser.FirstName, &CurrentUser.LastName, &CurrentUser.NickName,
			&CurrentUser.Age, &CurrentUser.Gender, &CurrentUser.Email, &CurrentUser.Password)

		if err3 != nil {
			fmt.Println("Error with currentUser", err3)
			fmt.Println("error accessing DB")
			return
		}

		err3 = IsUserAuthenticated(w, &CurrentUser)
		fmt.Println("user logged in is : ", err3)

		if err3 != nil {
			fmt.Println("user already logged In", err3)
			return
		}

		sessionToken := uuid.NewV4().String()
		expiresAT := time.Now().Add(60 * time.Minute)

		// Finally, we set the client cookie for "session_token" as the session token we just generated
		// we also set an expiry time of 120 minutes

		http.SetCookie(w, &http.Cookie{
			Name:     "session_token",
			Value:    sessionToken,
			MaxAge:   7200,
			Expires:  expiresAT,
			HttpOnly: true,
		})

		// storing the cookie values in struct to access on other pages.
		user_session := Cookie{"session_token", sessionToken, expiresAT}
		fmt.Println("user_session", user_session)

		// Duplicates are ignored
		insertSession, err4 := sqldb.DB.Prepare("INSERT OR IGNORE INTO Sessions (userID, cookieName, cookieValue) VALUES(?, ?, ?);")
		if err4 != nil {
			fmt.Println("Error with inserting session", err4)
			return
		}

		defer insertSession.Close()
		insertSession.Exec(CurrentUser.UserID, "session_token", sessionToken)
		
		fmt.Println("PASSWORD IS CORRECT")
	} else if comparePass!= nil {
		fmt.Println("INCORRECT PASSWORD")
	}
	


}

// NewSession ...
func NewSession() *Session {
	return &Session{}
}

// AddSession ...
func AddSession(w http.ResponseWriter, sessionName string, user *User) {
	sessionToken := uuid.NewV4().String()
	expiresAt := time.Now().Add(120 * time.Minute)
	cookieSession := &http.Cookie{
		Name:     sessionName,
		Value:    sessionToken,
		Expires:  expiresAt,
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
		Name:     "Session_token",
		Value:    "",
		MaxAge:   -1,
		HttpOnly: true,
	}
	http.SetCookie(w, cookie)
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
