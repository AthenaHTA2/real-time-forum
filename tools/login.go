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

	"github.com/gorilla/sessions"
	uuid "github.com/satori/go.uuid"
	"golang.org/x/crypto/bcrypt"
)

//function for login
//Populate the LoginData struct, validate user password,
//generate cookie data and upload these into database 'Sessions' table

//Populate the LoginData struct, validate user password,
//generate cookie data and upload these into database 'Sessions' table
func Login(w http.ResponseWriter, r *http.Request) {
	var logData LoginData

	loginD, err := io.ReadAll(r.Body)
	if err != nil {
		log.Fatal(err)
	}
	//fmt.Println("Json from Login: ", string(loginD))

	json.Unmarshal(loginD, &logData)

	//fmt.Println("LoginData struct in GO: ", logData.UserName, logData.Password)

	//from 'forum':
	username := logData.UserName
	password := logData.Password

	//fmt.Println("Logged in nickName and password:", username, password)

	// retrieve password from db to compare (hash) with user supplied password's hash
	var hash string
	stmt := "SELECT passwordhash FROM Users WHERE nickName = ?"
	row := sqldb.DB.QueryRow(stmt, username)
	err2 := row.Scan(&hash)
	if err2 != nil {
		//fmt.Println("err2 selecting passwordhash in db by nickName", username, err2)
		//fmt.Println("check username and password")
		return
	}

	// func CompareHashAndPassword(hashed password, password []byte) error
	comparePass := bcrypt.CompareHashAndPassword([]byte(hash), []byte(password))
	//fmt.Println("Error from comparing 'passwordhash' with user's pw. ('nil' error = success) : ", comparePass)
	//fmt.Println("user supplied password and 'passwordhash' from database: \n", string([]byte(password)), string([]byte(hash)))
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
			//fmt.Println("error with currentUser", err3)
			fmt.Println("error accessing DB")
			return
		}
		//fmt.Println("All current user's data from 'Users' database table: \n", userID, firstName, lastName, nickName, age, gender, email)
		//populate the CurrentUser struct (instance of 'User' struct) with values from 'Users' db table:
		CurrentUser.UserID = userID
		CurrentUser.FirstName = firstName
		CurrentUser.LastName = lastName
		CurrentUser.NickName = nickName
		CurrentUser.Age = strconv.Itoa(age)
		CurrentUser.Gender = gender
		CurrentUser.Email = email

		//err3 = IsUserAuthenticated(w, &CurrentUser)
		err3 = IsUserAuthenticated(w, &CurrentUser)
		//fmt.Println("this user logged in: ", err3)
		if err3 != nil {
			//fmt.Println("You are already logged in 🧐")
			//fmt.Println("already logged in: ", err3)
			return
		}
		sessionToken := uuid.NewV4().String()
		expiresAt := time.Now().Add(60 * time.Minute)
		//cookieNm := username + "_session" removing username in order to be able to get cookieID in JS
		cookieNm := "user_session"
		// Finally, we set the client cookie for "session_token='username_session'" as the session token we just generated
		// we also set an expiry time of 120 minutes
		http.SetCookie(w, &http.Cookie{
			Name: cookieNm,
			//Value:   sessionToken + "&" + username,
			Value:   sessionToken,
			MaxAge:  7200,
			Expires: expiresAt,
			// SameSite: true,
			// HttpOnly: true, //removed in order to allow Javascript to access cookie
		})
		// storing the cookie values in struct
		user_session := Cookie{cookieNm, sessionToken, expiresAt}
		fmt.Println("Values in 'Cookie' struct :", user_session)
		// Duplicates are ignored
		insertsessStmt, err4 := sqldb.DB.Prepare("INSERT OR IGNORE INTO Sessions (userID, cookieName, cookieValue) VALUES (?, ?, ?);")
		if err4 != nil {
			//fmt.Println("err4 with inserting session:", err4)
			//WarnMessage(w, "there was a problem logging in")
			return
		}
		defer insertsessStmt.Close()
		insertsessStmt.Exec(userID, cookieNm, sessionToken)
		//fmt.Println("PASSWORD IS CORRECT")
		//fmt.Println("User successfully logged in")
		//granting access to the logged in user
		//by setting selected 'User' struct fields to true etc.
		CurrentUser.Password = password
		CurrentUser.Access = 1
		CurrentUser.LoggedIn = true
		//fmt.Println("User struct data from Login: \n", CurrentUser.UserID, CurrentUser.FirstName, CurrentUser.LastName, CurrentUser.NickName, CurrentUser.Age, CurrentUser.Gender, CurrentUser.Password, CurrentUser.Access, CurrentUser.LoggedIn, CurrentUser.Posts, CurrentUser.Comments, CurrentUser.Email)

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
		w.WriteHeader(http.StatusNotAcceptable)
		fmt.Println("PASSWORD INCORRECT")
	}
}

func GetAllUsers() []byte {
	//space at start of websocket message signals that this is the list of users
	allUsers := " "
	rows, errUsr := sqldb.DB.Query("SELECT DISTINCT nickName FROM Users ORDER BY nickName ASC;")
	if errUsr != nil {
		fmt.Println("Error retrieving users from database: \n", errUsr)
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

//Retrieve from db all posts that will be shown on R-T-F front page
func AllPosts() []byte {
	var postData post
	var postItem string
	stmt := "SELECT author, category, title, content FROM Posts WHERE author = ?"
	row := sqldb.DB.QueryRow(stmt, '*')
	err := row.Scan(&postData.Author, &postData.Category, &postData.Title, &postData.Content)
	if err != nil {
		fmt.Println("err selecting postData in db", err)
	}
	fmt.Println("postData: ", postData)
	postItem = postData.Author + " " + postData.Category + " " + postData.Title + " " + postData.Content + "\n"
	fmt.Println("postItem: ", postItem)
	onePost := []byte(postItem)
	return onePost
}

func Logout(w http.ResponseWriter, r *http.Request) {
	// Clear the CurrentUser variable
	CurrentUser = User{}
	// Send a message indicating that the user has been logged out
	w.Write([]byte("User has been logged out"))
}

func main() {
	http.HandleFunc("/logout", logoutHandler)
	http.ListenAndServe(":8000", nil)
}

/*we use the Gorilla web toolkit's sessions package to create a global session store,
and in the logoutHandler, we get the current session by calling the store.Get function,
then we set the MaxAge attribute of session option to -1 so that the cookie will expire
immediately, and we also set the session.Values to an empty map. In the end, we call the
Save function to save the session and write the cookie to the client.
*/

var store = sessions.NewCookieStore([]byte("secret-key")) // configure the session store

// Logout route handler
func logoutHandler(w http.ResponseWriter, r *http.Request) {
	session, _ := store.Get(r, "session-name") // get the session data
	session.Options.MaxAge = -1                // set the max age of the session to -1 (expire the session)
	store.Save(r, w, session)                  // save the session

	// remove the session data from the database (if applicable)
	stmt, err := sqldb.DB.Prepare("DELETE FROM Sessions WHERE userID = ?")
	if err != nil {
		fmt.Println("Error deleting session from database:", err)
		return
	}
	_, err = stmt.Exec(CurrentUser.UserID)
	if err != nil {
		fmt.Println("Error deleting session from database:", err)
		return
	}

	http.Redirect(w, r, "/", http.StatusSeeOther) // redirect the user to the login page
}

/*

// NewPost creates a new post in the forum
func NewPost(w http.ResponseWriter, r *http.Request) {
	// Check if user is authenticated
	if !IsUserAuthenticated(w, r) {
		w.WriteHeader(http.StatusUnauthorized)
		w.Write([]byte("ERROR: You must be logged in to create a new post"))
		return
	}

	// Get post data from request body
	postData :=
	var postData postData
	postD, err := io.ReadAll(r.Body)
	if err != nil {
		log.Fatal(err)
	}
	json.Unmarshal(postD, &postData)

	// Create a new post in the database
	stmt := "INSERT INTO posts(user_ID, username, content, time_posted, category, category_2) values(?,?,?,datetime('now','localtime'),?,?)"


	createdAt := time.Now()
	_, err = sqldb.DB.Exec(stmt, CurrentUser.UserID, postData.Content,)

	_, err = sqldb.DB.Exec(stmt, CurrentUser.UserID, postData.Title, postData.Content, createdAt)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		w.Write([]byte("ERROR: Unable to create new post"))
		return
	}

	w.Write([]byte("SUCCESS: New post created"))
}

*/
