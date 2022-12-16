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
	//serveWs function is a HTTP handler that upgrades the HTTP connection
	//to the WebSocket protocol, creates a Client type, registers the Client
	//with the hub and schedules the Client to be unregistered
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

/*from https://chat.openai.com/chat:
This is the main entry point for a Go program that creates a chat server.
The program first creates a new chat.Hub and starts it in a separate goroutine.
A hub is a central object that manages the clients (i.e., connections to the chat server)
and broadcasts messages to all connected clients.

Next, the program connects to an SQLite database and creates the necessary tables
if they don't already exist. This is used to store the messages and users
of the chat server.

Then, the program sets up some HTTP handlers. One handler serves static files
from the "css" directory. Another handler serves the home page of the chat server,
which is handled by the tools.HomePage function.
The third handler is for WebSocket connections, and it uses the chat.ServeWs function
to upgrade the HTTP connection to the WebSocket protocol and register the new client with the hub.

Finally, the program starts an HTTP server on port 8080 and opens a web browser
to access the chat server. If any errors occur while starting the server,
they will be logged and the program will terminate.
*/
