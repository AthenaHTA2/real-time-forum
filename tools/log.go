package tools

import (
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"rtforum/sqldb"
	"time"

	uuid "github.com/satori/go.uuid"
	"golang.org/x/crypto/bcrypt"
)

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
		fmt.Println("err with PASSWORD", LogUserName, LogPassword)
		fmt.Println("check username and password")
		return
	}

	// func CompareHashAndPassword(hashed password, password []byte) error
	comparePass := bcrypt.CompareHashAndPassword([]byte(hash), []byte(LogPassword))
	fmt.Println("compare 'passwordhash' with user's pw: ", comparePass)
	fmt.Println("'passwordhash' and 'hash': ", []byte(LogPassword), []byte(hash))

	//returns nil on success

	if comparePass == nil {
		stmtCurrentUser := "SELECT * FROM Users WHERE nickName = ?"
		rowCurrentUser := sqldb.DB.QueryRow(stmtCurrentUser, LogUserName)

		fmt.Println(stmtCurrentUser)

		var (
			userID, age                                  int
			firstName, lastName, nickName, gender, email string
		)

		err3 := rowCurrentUser.Scan(&userID, &firstName, &lastName, &nickName, &age, &gender, &email, &LogPassword)

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
		cookieNm := LogUserName + "_session"

		// Finally, we set the client cookie for "session_token" as the session token we just generated
		// we also set an expiry time of 120 minutes

		http.SetCookie(w, &http.Cookie{
			Name:     cookieNm,
			Value:    sessionToken,
			MaxAge:   7200,
			Expires:  expiresAT,
			HttpOnly: true,
		})

		// storing the cookie values in struct to access on other pages.
		user_session := Cookie{cookieNm, sessionToken, expiresAT}
		fmt.Println("user_session", user_session)

		// Duplicates are ignored
		insertSession, err4 := sqldb.DB.Prepare("INSERT OR IGNORE INTO Sessions (userID, cookieName, cookieValue) VALUES (?, ?, ?);")
		if err4 != nil {
			fmt.Println("Error with inserting session", err4)
			return
		}

		defer insertSession.Close()
		insertSession.Exec(CurrentUser.UserID, cookieNm, sessionToken)

		fmt.Println("PASSWORD IS CORRECT")
		fmt.Println("User successfully logged in")

	} else if comparePass != nil {
		fmt.Println("PASSWORD INCORRECT")
	}

}
