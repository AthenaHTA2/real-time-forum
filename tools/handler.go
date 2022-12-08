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

	"golang.org/x/crypto/bcrypt"
)

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
		userID, age                                                int
		firstName, lastName, nickName, gender, email string
	)

	rows.Scan(&userID, &firstName, &lastName, &nickName, &age, &gender, &email, &hash)
}
