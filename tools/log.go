package tools

import (
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"rtforum/sqldb"
	"time"
	"strconv"
	uuid "github.com/satori/go.uuid"
	"golang.org/x/crypto/bcrypt"
)

//Populate the LoginData struct, validate user password,
//generate cookie data and upload these into database 'Sessions' table
func Login(w http.ResponseWriter, r *http.Request) {
	var logData LoginData

	loginD, err := io.ReadAll(r.Body)
	if err != nil {
		log.Fatal(err)
	}
	fmt.Println("Json from Login: ", string(loginD))

	json.Unmarshal(loginD, &logData)

	//fmt.Println("LoginData struct in GO: ", logData.UserName, logData.Password)

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
	comparePass := bcrypt.CompareHashAndPassword([]byte(hash), []byte(password))
	fmt.Println("Error from comparing 'passwordhash' with user's pw. ('nil' error = success) : ", comparePass)
	fmt.Println("user supplied password and 'passwordhash' from database: \n", string([]byte(password)), string([]byte(hash)))
	// returns nil on success

	if comparePass == nil {
		stmtCurrentUer := "SELECT * FROM Users WHERE nickName = ?"
		rowCurrentUser := sqldb.DB.QueryRow(stmtCurrentUer, username)

		var (
			userID, age                                  int
			firstName, lastName, nickName, gender, email string
		)
		err3 := rowCurrentUser.Scan(&userID, &firstName, &lastName, &nickName, &age, &gender, &email, &password)
		if err3 != nil {
			fmt.Println("error with currentUser", err3)
			fmt.Println("error accessing DB")
			return
		}
		fmt.Println("All current user's data from 'Users' database table: \n", userID, firstName, lastName, nickName, age, gender, email)
		//populate the CurrentUser struct (instance of 'User' struct) with values from 'Users' db table:
		CurrentUser.UserID = userID
		CurrentUser.LastName = lastName
		CurrentUser.NickName = nickName
		CurrentUser.Age = strconv.Itoa(age)
		CurrentUser.Gender = gender
		CurrentUser.Email = email

		//err3 = IsUserAuthenticated(w, &CurrentUser)
		err3 = IsUserAuthenticated(w, &CurrentUser)
		//fmt.Println("this user logged in: ", err3)
		if err3 != nil {
			fmt.Println("You are already logged in 🧐")
			fmt.Println("already logged in: ", err3)
			return
		}
		sessionToken := uuid.NewV4().String()
		expiresAt := time.Now().Add(60 * time.Minute)
		cookieNm := username + "_session"
		// Finally, we set the client cookie for "session_token='username_session'" as the session token we just generated
		// we also set an expiry time of 120 minutes
		http.SetCookie(w, &http.Cookie{
			Name:     cookieNm,
			Value:    sessionToken,
			MaxAge:   7200,
			Expires:  expiresAt,
			HttpOnly: true,
		})
		// storing the cookie values in struct
		user_session := Cookie{cookieNm, sessionToken, expiresAt}
		fmt.Println("Values in 'Cookie' struct :", user_session)
		// Duplicates are ignored
		insertsessStmt, err4 := sqldb.DB.Prepare("INSERT OR IGNORE INTO Sessions (userID, cookieName, cookieValue) VALUES (?, ?, ?);")
		if err4 != nil {
			fmt.Println("err4 with inserting session:", err4)
			//WarnMessage(w, "there was a problem logging in")
			return
		}
		defer insertsessStmt.Close()
		insertsessStmt.Exec(userID, cookieNm, sessionToken)
		fmt.Println("PASSWORD IS CORRECT")
		fmt.Println("User successfully logged in")
		//granting access to the logged in user
		//by setting selected 'User' struct fields to true etc.
		CurrentUser.Password = password
		CurrentUser.Access = 1
		CurrentUser.LoggedIn = true
		fmt.Println("User struct data from Login: \n", CurrentUser.UserID, CurrentUser.FirstName, CurrentUser.LastName, CurrentUser.NickName, CurrentUser.Age, CurrentUser.Gender, CurrentUser.Password, CurrentUser.Access, CurrentUser.LoggedIn, CurrentUser.Posts, CurrentUser.Comments, CurrentUser.Email)
		} else if comparePass != nil {
			fmt.Println("PASSWORD INCORRECT")
		}
	}


