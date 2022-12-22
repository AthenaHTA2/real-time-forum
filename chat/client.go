package chat

import (
	"bytes"
	"log"
	"net/http"

	"time"

	"rtforum/tools"

	"github.com/gorilla/websocket"
)

const (
	// Time allowed to write a message to the peer.
	writeWait = 10 * time.Second

	// Time allowed to read the next pong message from the peer.
	pongWait = 60 * time.Second

	// Send pings to peer with this period. Must be less than pongWait.
	pingPeriod = (pongWait * 9) / 10

	// Maximum message size allowed from peer.
	maxMessageSize = 512
)

var (
	newline = []byte{'\n'}
	space   = []byte{' '}
)

var upgrader = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
}

// Client is a middleman between the websocket connection and the hub.
type Client struct {
	Hub *Hub

	// The websocket connection.
	Conn *websocket.Conn

	// Buffered channel of outbound messages.
	Send chan []byte
}

//~~~~~~~~~~~~~~~~~~~from chat.openai.com/chat:

//sends the registeredUsers slice to the ws client as a JSON array.
func SendRegisteredUsers(conn *websocket.Conn) {
	//put database query result in registeredUsers
	registeredUsers := tools.GetAllUsers()
	// Encode the registeredUsers slice as a JSON array and send it as message to the client.
	err := conn.WriteJSON(registeredUsers)
	if err != nil {
		log.Println(err)
	}
}

//msgToHub go routine reads messages from the webSocket connection
//and sends them to the hub
//
// The application runs msgToHub in a per-connection goroutine. The application
// ensures that there is at most one reader on a connection by executing all
// reads from this goroutine.
func (c *Client) msgToHub() {
	defer func() {
		c.Hub.Unregister <- c
		c.Conn.Close()
	}()
	c.Conn.SetReadLimit(maxMessageSize)
	c.Conn.SetReadDeadline(time.Now().Add(pongWait))
	c.Conn.SetPongHandler(func(string) error { c.Conn.SetReadDeadline(time.Now().Add(pongWait)); return nil })
	for {
		_, message, err := c.Conn.ReadMessage()
		if err != nil {
			if websocket.IsUnexpectedCloseError(err, websocket.CloseGoingAway, websocket.CloseAbnormalClosure) {
				log.Printf("error: %v", err)
			}
			break
		}
		message = bytes.TrimSpace(bytes.Replace(message, newline, space, -1))
		c.Hub.Broadcast <- message
	}
}

// A goroutine running msgFromHub is started for each connection.
//
//msgFromHub go routine reads messages from client's 'send' channel
//and writes them to the websocket connection.

func (c *Client) msgFromHub() {
	ticker := time.NewTicker(pingPeriod)
	defer func() {
		ticker.Stop()
		c.Conn.Close()
	}()
	for {
		select {
		case message, ok := <-c.Send:
			c.Conn.SetWriteDeadline(time.Now().Add(writeWait))
			if !ok {
				// The hub closed the channel.
				c.Conn.WriteMessage(websocket.CloseMessage, []byte{})
				return
			}

			w, err := c.Conn.NextWriter(websocket.TextMessage)
			if err != nil {
				return
			}

			w.Write(message)

			// Add queued chat messages to the current websocket message.
			n := len(c.Send)
			for i := 0; i < n; i++ {
				w.Write(newline)
				w.Write(<-c.Send)
			}

			if err := w.Close(); err != nil {
				return
			}
		case <-ticker.C:
			c.Conn.SetWriteDeadline(time.Now().Add(writeWait))
			if err := c.Conn.WriteMessage(websocket.PingMessage, nil); err != nil {
				return
			}
		}
	}
}

// serveWs handles websocket requests from the peer.
func ServeWs(hub *Hub, w http.ResponseWriter, r *http.Request) {
	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Println(err)
		return
	}
	client := &Client{Hub: hub, Conn: conn, Send: make(chan []byte, 256)}
	client.Hub.Register <- client
	//send json of registered users to client
	SendRegisteredUsers(conn)
	// Allow collection of memory referenced by the caller by doing all work in
	// new goroutines.
	go client.msgFromHub()
	go client.msgToHub()
}

/*Code authors:
Gary Burd <gary@beagledreams.com>
Google LLC (https://opensource.google.com/)
Joachim Bauch <mail@joachim-bauch.de>
from: https://github.com/gorilla/websocket/chat

msgFromHub == writePump
msgToHub == readPump
*/
