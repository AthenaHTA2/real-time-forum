package chat
import (
	"database/sql"
	"fmt"
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
	Database   *sql.DB
}
func NewHub(DB *sql.DB) *Hub {
	return &Hub{
		Broadcast:  make(chan []byte),
		Register:   make(chan *Client),
		Unregister: make(chan *Client),
		Clients:    make(map[string]*Client),
		Database:   DB,
	}
}
func (h *Hub) Run() {
	for {
		select {
		case client := <-h.Register:
			h.Clients[client.Username] = client
			fmt.Println("printing all clients: ", h.Clients[client.Username])
		case client := <-h.Unregister:
			if _, ok := h.Clients[client.Username]; ok {
				delete(h.Clients, client.Username)
				close(client.Send)
			}
		case message := <-h.Broadcast:
			for client := range h.Clients {
				select {
					//if the client == receiver ID, can send the message
				case h.Clients[client].Send <- message:
				default:
					close(h.Clients[client].Send)
					delete(h.Clients, client)
				}
			}
		}
	}
}
//to show which users are logged in
func (h *Hub) RegisteredUsers(nicknames [][]byte) {
	for _, nknm := range nicknames {
		nknm = <-h.Broadcast
		for client := range h.Clients {
			h.Clients[client].Send <- nknm
		}
	}
}
//To print the clients connected to Hub
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