package main

import (
	"fmt"
	"log"
	"net/http"
	"os/exec"
	"rtforum/chat"
	"rtforum/database"
	"rtforum/sqldb"
	"rtforum/tools"

	_ "github.com/gorilla/websocket"
	_ "github.com/mattn/go-sqlite3"
)

func main() {

	hub := chat.NewHub()
	go hub.Run()

	sqldb.ConnectDB()
	database.CreateDB()

	fs := http.FileServer(http.Dir("css/"))
	http.Handle("/css/",
		http.StripPrefix("/css/", fs))
	http.HandleFunc("/", tools.HomePage)
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
