package tools

import (
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"rtforum/sqldb"
	"strconv"
	"time"

	uuid "github.com/satori/go.uuid"
	"golang.org/x/crypto/bcrypt"
)

//function for login
//Populate the LoginData struct, validate user password,
//generate cookie data and upload these into database 'Sessions' table

func Login(w http.ResponseWriter, r *http.Request) {
	var loginData LoginData

	loginD, err := io.ReadAll(r.Body)
	if err != nil {
		log.Fatal(err)
	}

	json.Unmarshal(loginD, &loginData)

	LogUserName := loginData.UserName
	LogPassword := loginData.Password


	// retrieve password from db to compare (hash) with user supplied password's hash
	var hash string

	stmt := "SELECT passwordhash FROM Users WHERE nickName = ?"
	row := sqldb.DB.QueryRow(stmt, LogUserName)
	err2 := row.Scan(&hash)
	if err2 != nil {
		fmt.Println("err with PASSWORD", LogUserName, LogPassword)
		fmt.Println("check username or and password")
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

		var (
			userID, age                                  int
			firstName, lastName, nickName, gender, email string
		)

		err3 := rowCurrentUser.Scan(&userID, &firstName, &lastName, &nickName, &age, &gender, &email, &LogPassword)

		if err3 != nil {
			fmt.Println("Error with currentUser", err)
			fmt.Println("error accessing DB")
			return
		}

		//populate the CurrentUser struct (instance of 'User' struct) with values from 'Users' db table:
		CurrentUser.UserID = userID
		CurrentUser.FirstName = firstName
		CurrentUser.LastName = lastName
		CurrentUser.NickName = nickName
		CurrentUser.Age = strconv.Itoa(age)
		CurrentUser.Gender = gender
		CurrentUser.Email = email

		err3 = IsUserAuthenticated(w, &CurrentUser)
		fmt.Println("user logged in is : ", err3)

		if err3 != nil {
			fmt.Println("user already logged In", err3)
			return
		}

		sessionToken := uuid.NewV4().String()
		expiresAT := time.Now().Add(60 * time.Minute)
		//cookieNm := username + "_session" removing username in order to be able to get cookieID in JS
		cookieNm := LogUserName + "_session"

		// Finally, we set the client cookie for "session_token" as the session token we just generated
		// we also set an expiry time of 120 minutes

		http.SetCookie(w, &http.Cookie{
			Name:    cookieNm,
			Value:   sessionToken,
			MaxAge:  7200,
			Expires: expiresAT,
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

		CurrentUser.Password = LogPassword
		CurrentUser.Access = 1
		CurrentUser.LoggedIn = true

		marshalledUser, err := json.Marshal(CurrentUser)
		if err != nil {
			log.Fatal(err)
		}
		w.WriteHeader(http.StatusOK) //alerts user
		//Now we send user details back to the front-end
		w.Write([]byte(marshalledUser))
		w.WriteHeader(http.StatusOK)
		GetAllUsers()

	} else if comparePass != nil {
		fmt.Println("PASSWORD INCORRECT")
	}

}

func GetAllUsers() []byte {
	//space at start of websocket message signals that this is the list of users
	allUsers := " "
	rows, errUsr := sqldb.DB.Query("SELECT DISTINCT nickName FROM Users ORDER BY nickName ASC;")
	if errUsr != nil {
		fmt.Println("Error retrieving users from database:  line 147\n", errUsr)
		return nil
	}
	for rows.Next() {
		var tempUser string
		err := rows.Scan(&tempUser)
		if err != nil {
			fmt.Println("err: ", err)
		}
		allUsers = allUsers + "\n" + tempUser
	}
	rows.Close()
	for _, user := range allUsers {
		fmt.Println(string(user))
	}
	return []byte(allUsers)
}
