package tools

import (
	"encoding/json"
	"fmt"
	"html/template"
	"io"
	"log"
	"net/http"
	"rtforum/sqldb"

	"golang.org/x/crypto/bcrypt"
)

// var db *sql.DB

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

var CurrentUser User

func Register(w http.ResponseWriter, r *http.Request) {

	bytes, err := io.ReadAll(r.Body)
	if err != nil {
		log.Fatal(err)
	}
	fmt.Println("Json from Regsister: ", string(bytes))

	json.Unmarshal(bytes, &CurrentUser)

	var hash []byte
	password := CurrentUser.Password
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
		) VALUES(?,?,?,?,?,?,?)`, CurrentUser.FirstName, CurrentUser.LastName, CurrentUser.NickName, CurrentUser.Age, CurrentUser.Gender, CurrentUser.Email, hash)

	if err != nil {
		fmt.Println("Error inserting into 'Users' table: ", err)
		return
	}
}
