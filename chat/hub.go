package chat

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"rtforum/tools"
	"time"
)

// Hub maintains the set of active clients and broadcasts messages to the
// clients.
type Hub struct {
	// Registered clients.
	Clients map[string]*Client
	// Inbound messages from the clients.
	Broadcast chan []byte
	// Register requests from the clients.
	Register chan *Client
	// Unregister requests from clients.
	Unregister chan *Client
	// database connection
	Database *sql.DB
}

func NewHub(DB *sql.DB) *Hub {
	return &Hub{
		Broadcast:  make(chan []byte),
		Register:   make(chan *Client),
		Unregister: make(chan *Client),
		Clients:    make(map[string]*Client),
		Database: DB,
	}
}

func (h *Hub) Run() {
	for {
		select {
			// you can access the username here
		case client := <-h.Register:
			h.Clients[client.Username] = client
		case client := <-h.Unregister:
			if _, ok := h.Clients[client.Username]; ok {
				delete(h.Clients, client.Username)
				close(client.Send)
			}
		case message := <-h.Broadcast:
			var directmsg tools.Message
			json.Unmarshal(message, &directmsg)
	
			fmt.Println(directmsg)
			chatHistoryVal := tools.CheckForChatHistory(directmsg)
		
			//stores a new chat
			if !chatHistoryVal.ChatExists{
				tools.StoreChat(directmsg)
			}
			msgHistroryVal := tools.CheckForChatHistory(directmsg)
			//stores new messages
			if msgHistroryVal.ChatExists{
				directmsg.ChatID = msgHistroryVal.ChatID
				tools.StoreMessage(directmsg)
			}
			for client := range h.Clients {
				if (client == directmsg.Recipient) || (client == directmsg.Sender) {
					fmt.Println()
					select {
					case h.Clients[client].Send <- message:
					default:
						close(h.Clients[client].Send)
						delete(h.Clients, client)
					}
				}
			}
		}
	}
}

// //to show which users are logged in
// func (h *Hub) RegisteredUsers(nicknames [][]byte) {
// 	for _, nknm := range nicknames {
// 		nknm = <-h.Broadcast
// 		for client := range h.Clients {
// 			h.Clients[client].Send <- nknm
// 		}
// 	}
// }

func (h *Hub) LogConns() {
    for {
        fmt.Println(len(h.Clients), "clients connected")
        for userId := range h.Clients {	
            fmt.Printf("client %v have %v connections\n", userId, len(h.Clients))
        }
        fmt.Println()
        time.Sleep(1 * time.Second)
    }
}