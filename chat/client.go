package chat

import (
	"bytes"
	"fmt"
	"log"
	"net/http"
	"rtforum/tools"
	"time"

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

	// username is the ID of the user who is connected to the websocket
	Username string

	// The websocket connection.
	Conn *websocket.Conn

	// Buffered channel of outbound messages.
	Send chan []byte
}

//~~~~~~~~~~~~~~~~~~~Start of Show list of Users

//sends the registeredUsers to the ws client as a byte slice.
func (c *Client) SendRegisteredUsers(conn *websocket.Conn) {

	//put database query result in registeredUsers
	registeredUsers := tools.GetAllUsers()
	err := c.Conn.SetWriteDeadline(time.Now().Add(writeWait))
	if err != nil {
		// The hub closed the channel.
		c.Conn.WriteMessage(websocket.CloseMessage, []byte{})
		return
	}
	w, err := c.Conn.NextWriter(websocket.TextMessage)
	if err != nil {
		return
	}

	w.Write(registeredUsers)

	// Add queued chat messages to the current websocket message.
	n := len(c.Send)
	for i := 0; i < n; i++ {
		if string(registeredUsers[i]) == string(newline) {
			w.Write(newline)
		}
		w.Write(<-c.Send)
	}

	if err := w.Close(); err != nil {
		return
	}
}

//~~~~~~~~ End of Show list of Users

//~~~~~~~~~~Start of Show list of Posts
//Gets all posts and sends them as a byte array through a web socket
func (c *Client) GetAllPosts(conn *websocket.Conn) {

	//put database query result in registeredUsers
	allPosts := tools.AllPosts()
	fmt.Println("allPosts:", allPosts)
	err := c.Conn.SetWriteDeadline(time.Now().Add(writeWait))
	if err != nil {
		// The hub closed the channel.
		c.Conn.WriteMessage(websocket.CloseMessage, []byte{})
		return
	}
	w, err := c.Conn.NextWriter(websocket.TextMessage)
	if err != nil {
		return
	}

	w.Write(allPosts)

	// Add queued chat messages to the current websocket message.
	n := len(c.Send)
	for i := 0; i < n; i++ {
		if string(allPosts[i]) == string(newline) {
			w.Write(newline)
		}
		fmt.Println("sending posts through a websocket")
		w.Write(<-c.Send)
	}

	if err := w.Close(); err != nil {
		return
	}
}

//~~~~~~~~~~~End of Show list of Posts

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
	cookie, err := r.Cookie("user_session")
	fmt.Println("cookie.name: ", &cookie.Name)
	if err != nil {
		fmt.Println("cookie err : ", err)
		return
	}

	// return user data via cookie
	fmt.Println("cookie: ", cookie.Value)
	usr := tools.GetUserByCookie(cookie.Value)
	userName := usr.NickName
	fmt.Println("userName: ", userName)

	client := &Client{Hub: hub, Username: userName, Conn: conn, Send: make(chan []byte, 256)}
	client.Hub.Register <- client
	// Allow collection of memory referenced by the caller by doing all work in
	// new goroutines.
	go client.msgFromHub()
	go client.msgToHub()
	//send json of registered users to client
	go client.SendRegisteredUsers(conn)
	go client.GetAllPosts(conn)
}

/*Gorilla Websocket Code authors:
Gary Burd <gary@beagledreams.com>
Google LLC (https://opensource.google.com/)
Joachim Bauch <mail@joachim-bauch.de>
from: https://github.com/gorilla/websocket/chat

msgFromHub == writePump
msgToHub == readPump
*/