package main

import (
	"fmt"
	"log"
	"net/http"
	"os/exec"
	"rtforum/database"
	"rtforum/sqldb"
	rtforum "rtforum/tools"

	_ "github.com/mattn/go-sqlite3"
)

func main() {

	sqldb.ConnectDB()
	database.CreateDB()

	cssFolder := http.FileServer(http.Dir("css/"))
	http.Handle("/css/",
		http.StripPrefix("/css/", cssFolder))

		jsFolder := http.FileServer(http.Dir("js/"))
		http.Handle("/js/",
			http.StripPrefix("/js/", jsFolder))

			
	http.HandleFunc("/", rtforum.HomePage)
	http.HandleFunc("/login", rtforum.Login)
	http.HandleFunc("/register", rtforum.Register)


	exec.Command("xdg-open", "http://localhost:8080/").Start()

	fmt.Println("Starting server at port 8080")
	err := http.ListenAndServe(":8080", nil)
	if err != nil {
		log.Fatal(err)
	}
}
