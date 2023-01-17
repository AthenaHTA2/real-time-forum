package main

import (
	"fmt"
	"log"
	"net/http"
	"os/exec"
	"rtforum/database"
	"rtforum/chat"
	"rtforum/sqldb"
	"rtforum/tools"
	rtforum "rtforum/tools"

	_ "github.com/mattn/go-sqlite3"
)

func main() {

	DB := sqldb.ConnectDB()
	database.CreateDB()
	hub := chat.NewHub(DB)
	go hub.LogConns()
	go hub.Run()

	cssFolder := http.FileServer(http.Dir("css/"))
	http.Handle("/css/",
		http.StripPrefix("/css/", cssFolder))	

	jsFolder := http.FileServer(http.Dir("js/"))
	http.Handle("/js/",
		http.StripPrefix("/js/", jsFolder))


	http.HandleFunc("/", rtforum.HomePage)
	http.HandleFunc("/login", rtforum.Login)
	http.HandleFunc("/register", rtforum.Register)
	http.HandleFunc("/post", rtforum.Posts)
	http.HandleFunc("/comment", tools.Comments)
	http.HandleFunc("/getPosts", tools.SendLatestPosts)
	http.HandleFunc("/getComments", tools.SendLatestComments)

	http.HandleFunc("/ws", func(w http.ResponseWriter, r *http.Request) {
		chat.ServeWs(hub, w, r)
	})

	exec.Command("xdg-open", "http://localhost:8080/").Start()

	fmt.Println("Starting server at port 8080")
	err := http.ListenAndServe(":8080", nil)
	if err != nil {
		log.Fatal(err)
	}
}
