package tools

import (
	"fmt"
	"net/http"
	"time"

	"github.com/gorilla/websocket"
	_ "github.com/mattn/go-sqlite3"
)

var (
	// upgrader is used to upgrade HTTP connections to websockets
	upgrader = websocket.Upgrader{
		CheckOrigin: func(r *http.Request) bool { return true },
	}
	// clients is a map that stores connected clients
	clients = make(map[string]*websocket.Conn)
	// messages is a channel that stores new messages
	messages = make(chan Message)
)

// Message struct defines the format of a message
type Message struct {
	Username string    `json:"username"`
	Text     string    `json:"text"`
	Time     time.Time `json:"time"`
}

// handleWebsocket handles new websocket connections
func handleWebsocket(w http.ResponseWriter, r *http.Request) {
	// Upgrade the connection to a websocket
	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		fmt.Println(err)
		return
	}
	defer conn.Close()

	// Get the username of the connected user from the request
	username := r.FormValue("username")

	// Add the new client to the clients map
	clients[username] = conn

	for {
		// Read a message from the client
		_, msg, err := conn.ReadMessage()
		if err != nil {
			fmt.Println(err)
			return
		}

		// Create a new message struct and send it to the messages channel
		messages <- Message{Username: username, Text: string(msg), Time: time.Now()}
	}
}

// handleMessages handles new messages
func handleMessages() {
	for {
		// Get the next message from the messages channel
		msg := <-messages

		// Iterate over all connected clients
		for _, client := range clients {
			// Send the message to the client
			err := client.WriteJSON(msg)
			if err != nil {
				fmt.Println(err)
				return
			}
		}
	}
}
