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

/*function logOut(){
  cookie = &http.Cookie{
    Name: "logged-in",
    Value: "0",
    MaxAge: -1,
  }
}*/

var db *sql.DB

func HomePage(w http.ResponseWriter, r *http.Request) {

	if r.URL.Path != "/" {
		http.Error(w, "404 Page Not Found", 404)
		return
	}

	templ, err := template.ParseFiles("templates/home.html")

	if err != nil {
		http.Error(w, "Error with parsing home.html", http.StatusInternalServerError)
		return
	}

	err = templ.Execute(w, "")

	if err != nil {
		http.Error(w, "Error with writing home.html", http.StatusInternalServerError)
		return
	}

}

//Populate the User struct and upload into database
func Register(w http.ResponseWriter, r *http.Request) {

	var regData User

	bytes, err := io.ReadAll(r.Body)
	if err != nil {
		log.Fatal(err)
	}
	fmt.Println("Json from Regsister: ", string(bytes))

	json.Unmarshal(bytes, &regData)

	var hash []byte
	password := regData.Password
	// func GenerateFromPassword(password []byte, cost int) ([]byte, error)
	hash, err4 := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)

	if err4 != nil {
		fmt.Println("bcrypt err4:", err4)
		return
	}

	_, err = sqldb.DB.Exec(`INSERT INTO Users ( 
		firstName,
		lastName,
		nickName,
		age,
		gender,
		email,
		passwordhash
		) VALUES(?,?,?,?,?,?,?)`, regData.FirstName, regData.LastName, regData.NickName, regData.Age, regData.Gender, regData.Email, hash)

	if err != nil {
		fmt.Println("Error inserting into 'Users' table: ", err)
		return
	}

	rows, _ := sqldb.DB.Query("SELECT userID, firstName, lastName, nickName, age, gender, email, passwordhash from Users")

	var (
		userID, age                                  int
		firstName, lastName, nickName, gender, email string
	)

	rows.Scan(userID, firstName, lastName, nickName, age, gender, email, hash)
	fmt.Println(rows)
}

//To populate the LoginData struct and upload into database
func Login(w http.ResponseWriter, r *http.Request) {
	var logData LoginData

	loginD, err := io.ReadAll(r.Body)
	if err != nil {
		log.Fatal(err)
	}
	fmt.Println("Json from Login: ", string(loginD))

	json.Unmarshal(loginD, &logData)

	fmt.Println("LoginData struct in GO: ", logData.UserName, logData.Password)

	//from 'forum':
	username := logData.UserName
	password := logData.Password

	fmt.Println("Logged in nickName and password:", username, password)

	// retrieve password from db to compare (hash) with user supplied password's hash
	var hash string
	stmt := "SELECT passwordhash FROM Users WHERE nickName = ?"
	row := sqldb.DB.QueryRow(stmt, username)
	err2 := row.Scan(&hash)
	if err2 != nil {
		fmt.Println("err2 selecting passwordhash in db by nickName", username, err2)
		fmt.Println("check username and password")
		return
	}

	// func CompareHashAndPassword(hashed password, password []byte) error
	errbcrypt := bcrypt.CompareHashAndPassword([]byte(hash), []byte(password))
	fmt.Println("compare 'passwordhash' with user's pw: ", errbcrypt)
	fmt.Println("'passwordhash' and 'hash': ", []byte(password), []byte(hash))
	// returns nil on success
	if errbcrypt == nil {
		stmtCurrentUer := "SELECT * FROM Users WHERE nickName = ?"
		rowCurrentUser := sqldb.DB.QueryRow(stmtCurrentUer, username)

		err3 := rowCurrentUser.Scan(&CurrentUser.UserID, &CurrentUser.FirstName, &CurrentUser.LastName, &CurrentUser.NickName, &CurrentUser.Age, &CurrentUser.Gender, &CurrentUser.Email, &CurrentUser.Password)
		if err3 != nil {
			fmt.Println("err3 rowCred.scan:", err3)
			fmt.Println("error accessing db")
			return
		}
		fmt.Println("All user data from 'Users' table: ", err3)
		err3 = IsUserAuthenticated(w, &CurrentUser)
		fmt.Println("this user logged in: ", err3)
		if err3 != nil {
			//http.WarnMessage(w, "You are already logged in 🧐")
			fmt.Println("already logged in: ", err3)
			return
		}
		sessionToken := uuid.NewV4().String()
		expiresAt := time.Now().Add(60 * time.Minute)

		// Finally, we set the client cookie for "session_token" as the session token we just generated
		// we also set an expiry time of 120 minutes
		http.SetCookie(w, &http.Cookie{
			Name:     "session_token",
			Value:    sessionToken,
			MaxAge:   7200,
			Expires:  expiresAt,
			HttpOnly: true,
		})
		// storing the cookie values in struct to access on other pages.
		user_session := Cookie{"session_token", sessionToken, expiresAt}
		fmt.Println("user_session:", user_session)
		// Duplicates are ignored
		insertsessStmt, err4 := sqldb.DB.Prepare("INSERT OR IGNORE INTO Sessions (userID, cookieName, cookieValue) VALUES (?, ?, ?);")
		// fmt.Println("Session Token:", sessionToken)
		if err4 != nil {
			fmt.Println("err4 preparing statement:", err4)
			//WarnMessage(w, "there was a problem logging in")
			return
		}
		defer insertsessStmt.Close()
		insertsessStmt.Exec(CurrentUser.UserID, "session_token", sessionToken)

		// redirect user to index handler after successful login
		//http.Redirect(w, r, "/", http.StatusFound)
		//return
	}
	fmt.Println("incorrect password")
	//WarnMessage(w, "check username and password")

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
		Name:  sessionName,
		Value: sessionToken,
		//MaxAge:   7200,
		Expires: expiresAt,
		//HttpOnly: true,
	}

	http.SetCookie(w, cookieSession)
	if sessionName != "guest" {
		InsertSession(user, cookieSession)
	}
}

// InsertSession ...
func InsertSession(u *User, session *http.Cookie) *Session {
	cookie := NewSession()
	//stmnt, err := sqldb.DB.Prepare("INSERT OR IGNORE INTO Session (sessionID, userID) VALUES (?, ?)")
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
	if err := sqldb.DB.QueryRow("SELECT sessionID FROM Sessions WHERE userID = ?", u.UserID).Scan(&cookieValue); err != nil {
		return nil
	}
	if err := DeleteSession(w, cookieValue); err != nil {
		return err
	}
	return nil
}

// logout handle
/*func Logout(w http.ResponseWriter, r *http.Request) {
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
}*/

// User's cookie expires when browser is closed, delete the cookie from the database.
func DeleteSession(w http.ResponseWriter, cookieValue string) error {
	cookie := &http.Cookie{
		Name:     "Session_token",
		Value:    "",
		MaxAge:   -1,
		HttpOnly: true,
	}
	http.SetCookie(w, cookie)

	stmt, err := sqldb.DB.Prepare("DELETE FROM Sessions WHERE sessionID=?;")
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

// NewUser ...
/*func NewUser() *User {
	return &User{}
}

// FindByUserID ...
func FindByUserID(UID int64) *User {
	u := NewUser()
	if err := sqldb.DB.QueryRow("SELECT userID, username, email, passwordhash FROM users WHERE userID = ?", UID).
		Scan(&u.UserID, &u.Username, &u.Email, &u.passwordhash); err != nil {
		fmt.Println("error find by user: ", err)
		return nil
	}
	return u
}

// GetUserByCookie ...
func GetUserByCookie(cookieValue string) *User {
	var userID int64
	if err := sqldb.DB.QueryRow("SELECT userID from session WHERE sessionID = ?", cookieValue).Scan(&userID); err != nil {
		return nil
	}
	u := FindByUserID(userID)
	return u
}*/
