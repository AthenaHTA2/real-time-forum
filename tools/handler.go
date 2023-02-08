package tools

import (
	"fmt"
	"html/template"
	"net/http"
)

func HomePage(w http.ResponseWriter, r *http.Request) {

	if r.URL.Path != "/" {
		http.Error(w, "404 Page Not Found", 404)
		return
	}

	templ, err := template.ParseFiles("templates/home.html")

	err = templ.Execute(w, "")

	if err != nil {
		http.Error(w, "Error with parsing home.html", http.StatusInternalServerError)
		fmt.Println(err)
		return
	}

}

/*
// Get user info from forms.
func GetAllUser(r *http.Request) User {

	DB := OpenDB()
	defer db.Close()
	var userToRegister User
	decoder := json.NewDecoder(r.Body)
	err := decoder.Decode(&userToRegister)
	if err != nil {
		fmt.Println(err)
	}

	return userToRegister
}

func OpenDB() {
	panic("unimplemented")
}

// Gets the current user based off of session UUID.
func GetCurrentUser(w http.ResponseWriter, r *http.Request, c *http.Cookie) User {
	DB := OpenDB()
	defer DB.Close()

	// Query sessions table for specific UUID
	rows, err := DB.Query("SELECT * FROM sessions WHERE sessionUUID=?;", c.Value)
	sess := QuerySession(rows, err)
	rows.Close() //good habit to close

	// If the sessionUUID is not the same, redirect. Return value could be null, or other.
	// Could be an error here.
	// if sess.sessionUUID != c.Value {

	// 	fmt.Println("error: helper.go line 72. Honestly not even an error.")
	// http.Redirect(w, r, "/", http.StatusSeeOther)
	// }

	// Get current user username.
	rows2, err2 := db.Query("SELECT * FROM users WHERE id=?;", sess.userID)
	currentUserData := QueryUser(rows2, err2)

	rows.Close() //good habit to close
	return currentUserData
}



/*
// Check session and query posts. Return current user and data to render in template.
func CheckSessionQueryPosts(w http.ResponseWriter, r *http.Request) (map[string]interface{}, []string) {
	// Get user's cookie.
	c, err := r.Cookie("session")
	if err != nil {
		http.Redirect(w, r, "/login", http.StatusSeeOther)
		return nil, nil
	}

	// Check current user based off sessionUUID.
	currentUser := GetCurrentUser(w, r, c)

	DB := OpenDB()
	defer DB.Close()

	// Slice containing all template names.
	files := GetTemplates()

	// Declare variables to use below.
	var rows *sql.Rows

	data := make(map[string]interface{})
	var posts []map[string]interface{}

	// If index page, get all posts from all users.
	if r.URL.Path == "/" {
		rows, err = db.Query(`SELECT * FROM posts ORDER BY id DESC;`)
		CheckErr(err, "-------LINE 209")
		// Get all posts.

		posts = AllPosts(rows, err)
	}

	// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
	// This code could be stored in an api.

	// If Categories page, get all posts from selected category.
	if r.URL.Path == "/categories" && r.Method == "POST" {

		// Loop over choices.
		choices := []string{"Weather", "Sports", "Social" ,"Other"}
		var selectedCat string
		for _, category := range choices {
			selectedCat = r.FormValue(category)
			if selectedCat != "" {
				break
			}
		}
		if r.FormValue("category-1") != "" {
			selectedCat = r.FormValue("category-1")
		}

		rows, err = db.Query(`SELECT * FROM posts where category=? ORDER BY id DESC;`, selectedCat)
		CheckErr(err, "-------LINE 234")
		// Get all posts.
		posts = GetPosts(rows, err)
	}
	// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

	// Return current user and posts data.
	data = map[string]interface{}{
		"Username": currentUser.Username,
		"Posts":    posts,
	}
	return data, files
}

*/
