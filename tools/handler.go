package tools

import (
	"encoding/json"
	"fmt"
	"html/template"
	"io"
	"log"
	"net/http"
	"rtforum/sqldb"
	"strconv"
)

func HomePage(w http.ResponseWriter, r *http.Request) {

	if r.URL.Path != "/" {
		http.Error(w, "404 Page Not Found", 404)
		return
	}

	templ, err := template.ParseFiles("frontend/home.html")
	if err != nil {
		http.Error(w, "Error with parsing home.html", http.StatusInternalServerError)
		return
	}
	err = templ.Execute(w, "")

	if err != nil {
		http.Error(w, "Error with parsing home.html", http.StatusInternalServerError)
		return
	}

}

func Login(w http.ResponseWriter, r *http.Request) {

	if r.URL.Path != "/login" {
		http.Error(w, "404 Page Not Found", 404)
		return
	}

	templ, err := template.ParseFiles("frontend/home.html")
	if err != nil {
		http.Error(w, "Error with parsing home.html", http.StatusInternalServerError)
		return
	}
	err = templ.Execute(w, "")

	if err != nil {
		http.Error(w, "Error with parsing home.html", http.StatusInternalServerError)
		return
	}
}

//
//Populate the 'Users' database table using data from Users struct
func Register(w http.ResponseWriter, r *http.Request) {

	var regData User

	bytes, err := io.ReadAll(r.Body)
	if err != nil {
		log.Fatal(err)
	}
	fmt.Println("Json from Register: ", string(bytes))
	json.Unmarshal(bytes, &regData)

	fmt.Println("User struct in go: ", regData)

	_, err = sqldb.DB.Exec(`INSERT INTO Users (
		firstName,
		lastName,				
		nickName,
		age,
		gender,
		email, 
		passwordhash
		) VALUES(?,?,?,?,?,?,?)`, regData.FirstName, regData.LastName, regData.NickName, regData.Age, regData.Gender, regData.Email, regData.Password)

	if err != nil {
		fmt.Println("Error inserting into 'Users' table: ", err)
		return
	}

	//statement.Exec(&regData.FirstName, &regData.LastName, &regData.NickName, &regData.Age, &regData.Gender, &regData.Email, &regData.Password)
	rows, _ := sqldb.DB.Query("SELECT userID, firstName, lastName, nickName, age, gender, email, passwordhash from Users")
	var (
		userID, age                                                int
		firstName, lastName, nickName, gender, email, passwordhash string
	)
	rows.Scan(&userID, &firstName, &lastName, &nickName, &age, &gender, &email, &passwordhash)
	fmt.Println(strconv.Itoa(userID) + ": " + firstName + " " + lastName + " " + nickName + " " + strconv.Itoa(age) + " " + gender + " " + email + " " + passwordhash)

}

/*Populate the 'Users' database table using data from RegData struct
func SendToRegisterDB(w http.ResponseWriter, r *http.Request) {
	var regisData RegData

	bytes, err := io.ReadAll(r.Body)
	if err != nil {
		log.Fatal(err)
	}
	fmt.Println(string(bytes))
	json.Unmarshal(bytes, &regisData)

	fmt.Println("regisData: ", regisData)

	fmt.Println("inserting into DB")
	statement, _ := sqldb.DB.Prepare((`INSERT INTO "Users" (
		firstName,
		lastName,
		nickName,
		age,
		gender,
		email,
		passwordhash,
		) VALUES(?,?,?,?,?,?,?)`))
	statement.Exec(regisData.FirstName, regisData.LastName, regisData.NickName, regisData.AgeReg, regisData.GenderReg, regisData.EmailReg, regisData.PassWdReg)
	rows, _ := sqldb.DB.Query("SELECT userID, firstName, lastName, nickName, age, gender, email, passwordhash from Users")
	var (
		userID, age                                                int
		firstName, lastName, nickName, gender, email, passwordhash string
	)
	rows.Scan(&userID, &firstName, &lastName, &nickName, &age, &gender, &email, &passwordhash)
	fmt.Println(strconv.Itoa(userID) + ": " + firstName + " " + lastName + " " + nickName + " " + gender + " " + email + " " + passwordhash)
}*/

//Loading user data into 'LoginData' struct and into 'Users' table.
func LoginHandler(w http.ResponseWriter, r *http.Request) {
	var loginData LoginData

	bytes, err := io.ReadAll(r.Body)
	if err != nil {
		log.Fatal(err)
	}
	fmt.Println(string(bytes))
	json.Unmarshal(bytes, &loginData)

	fmt.Println(loginData)
}
