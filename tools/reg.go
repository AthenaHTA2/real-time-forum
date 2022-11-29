package tools

import (
	"database/sql"
	"html/template"
	"log"
	"net/http"
	"strings"

	_ "github.com/mattn/go-sqlite3"
	uuid "github.com/satori/go.uuid"
	"golang.org/x/crypto/bcrypt"
)

var db *sql.DB

func Registration(w http.ResponseWriter, r *http.Request) {

	if r.URL.Path != "/register" {
		http.Error(w, "404 Page Not Found", 404)
		return
	}

	templ, err := template.ParseFiles("templates/home.html")

	err = templ.Execute(w, "")

	if err != nil {
		http.Error(w, "Error with parsing home.html", http.StatusInternalServerError)
		return
	}

	err = r.ParseForm()
	if err != nil {
		log.Fatal(err)
	}

	uName := r.PostForm.Get("userName")
	fName := r.PostForm.Get("firstName")
	lName := r.PostForm.Get("LastName")
	nName := r.PostForm.Get("NickName")
	age := r.PostForm.Get("Age")
	gender := r.PostForm.Get("Gender")
	eMail := r.PostForm.Get("email")
	password := []byte(r.PostForm.Get("Password"))

	emailSlice := strings.Split(eMail, "@")
	if len(emailSlice) != 2 {
		panic(err)
	}

	if !strings.ContainsRune(emailSlice[1], 46) {
		panic(err)
	}

	rows, err := db.Query("SELECT userName, email FROM users WHERE userName = ? OR email = ?;", uName, eMail)
	if err != nil {
		log.Fatal(err)
	}

	hash, err := bcrypt.GenerateFromPassword(password, 10)
	if err != nil {
		log.Fatal(err)
	}

	statment, err := db.Prepare("INSERT INTO user (userName, firstName, lastName, nickName, age, gender, eMail, password) VALUES (?,?,?,?,?,?,?,?);")
	if err != nil {
		log.Fatal(err)
	}
	defer statment.Close()
	statment.Exec(uName, fName, lName, nName, age, gender, eMail, hash, 1, true, "", "", "", "", "", "", "", "", "")

	var u string
	var f string
	var l string
	var n string
	var a string
	var g string
	var e string
	var p []byte
	var b int

	rows, err = db.Query("SELECT * FROM users")
	if err != nil {
		log.Fatal(err)
	}

	defer rows.Close()
	for rows.Next() {
		rows.Scan(&u, &f, &l, &n, &a, &g, &e, &p, &b)
	}

	sid := uuid.NewV4()
	http.SetCookie(w, &http.Cookie{
		Name:   "session",
		Value:  sid.String(),
		MaxAge: 1800,
	})

	statment, err = db.Prepare("INSERT INTO sessions (sessionsID, userName) VALUES (?,?);")

	if err != nil {
		log.Fatal(err)
	}

	defer statment.Close()
	statment.Exec(sid.String(), uName)
}
