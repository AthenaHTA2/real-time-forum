package tools

// func UserExists(DB *sql.DB, username string) bool {
// 	// check if username already exists
// 	userStmt := "SELECT userID FROM Users WHERE nickName = ?"
// 	rowU := DB.QueryRow(userStmt, username)
// 	var uIDs string
// 	error := rowU.Scan(&uIDs)
// 	if error != sql.ErrNoRows {
// 		fmt.Println("username already exists, err:", error)
// 		return true
// 	}
// 	return false
// }

// func EmailExists(DB *sql.DB, email string) bool {
// 	userStmt := "SELECT userID FROM Users WHERE email = ?"
// 	rowU := DB.QueryRow(userStmt, email)
// 	var uIDs string
// 	error := rowU.Scan(&uIDs)
// 	if error != sql.ErrNoRows {
// 		fmt.Println("email already exists, err:", error)
// 		return true
// 	}
// 	return false
// }

// func CorrectPassword(db *sql.DB, username, password string) bool {
// 	// get user from db
// 	userStmt := "SELECT passwordhash from Users WHERE nickName = ? OR email = ?"
// 	rowU := db.QueryRow(userStmt, username, username)
// 	var hash string
// 	err := rowU.Scan(&hash)
// 	if err != nil {
// 		fmt.Println("Error in finding hash, ", err)
// 	}

// 	err = bcrypt.CompareHashAndPassword([]byte(hash), []byte(password))

// 	return err == nil
// }

// func Loginn(){
// 	// validate values then
// 	var loginData loginValidation

// 	loginData.Tipo = "loginValidation"

// 	if !users.UserExists(db, t.Login.LoginUsername) && !users.EmailExists(db, t.Login.LoginUsername) {
// 		fmt.Println("Checking f.login.loginusername --> ", t.Login.LoginUsername)
// 		loginData.InvalidUsername = true
// 		toSend, _ := json.Marshal(loginData)
// 		w.Write(toSend)

// 	} else if users.UserExists(db, t.Login.LoginUsername) || users.EmailExists(db, t.Login.LoginUsername) {
// 		fmt.Println("user exists")
// 		if !users.CorrectPassword(db, t.Login.LoginUsername, t.Login.LoginPassword) {
// 			loginData.InvalidPassword = true
// 			toSend, _ := json.Marshal(loginData)
// 			w.Write(toSend)

// 		} else {

// 			currentUser = t.Login.LoginUsername
// 			loginData.SentPosts = posts.SendPostsInDatabase(db)
// 			loginData.AllUsers = users.GetAllUsers(db)
// 			loginData.UsersWithChat = chat.GetLatestChat(db, chat.GetChat(db, users.GetUserName(db, currentUser)))

// 			loginData.SuccessfulLogin = true
// 			loginData.SuccessfulUsername = users.GetUserName(db, currentUser)
// 			toSend, _ := json.Marshal(loginData)

// 			w.Write(toSend)

// 			fmt.Println("SUCCESSFUL LOGIN")
// 		}

// 	}
// }