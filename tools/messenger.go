package tools

import (
	"fmt"
	"rtforum/sqldb"
	"time"
)

// var dm Message
var newChat Chat
var Date = time.Now()

// checking if a prior chat exists between the two users
func CheckForChatHistory(dm Message) *ChatHistoryCheck {
	rows, err := sqldb.DB.Query(`SELECT user1, user2, chatID FROM Chats WHERE user1 = ? AND user2 =? OR user2 = ? AND user1 = ?;`, dm.Sender, dm.Recipient, dm.Sender, dm.Recipient)
	if err != nil {
		fmt.Println("Error from Chats", err)
	}
	var chatExists ChatHistoryCheck
	var chatScan Message
	defer rows.Close()
	for rows.Next() {
		err := rows.Scan(&chatScan.Sender, &chatScan.Recipient, &chatScan.ChatID)
		if err != nil {
			fmt.Println("ChatHistory check", err)
			return nil
		}
	}
	chatExists.ChatID = chatScan.ChatID
	chatExists.ChatExists = true
	if chatScan.ChatID == 0 {
		chatExists.ChatExists = false
	}
	fmt.Println("chatID: ", chatExists.ChatID)
	fmt.Println("chatExists: ", chatExists.ChatExists)
	return &chatExists
}

//storing messages to DB
func StoreMessage(dm Message) {
	stmt, err := sqldb.DB.Prepare(`INSERT INTO MessageHistory (chatID, chatMessage, sender, recipient, creationDate ) VALUES (?,?,?,?,? )`)
	if err != nil {
		fmt.Println("error adding message to DB", err)
		return
	}
	result, _ := stmt.Exec(dm.ChatID, dm.Content, dm.Sender, dm.Recipient, Date)
	rowsAff, _ := result.RowsAffected()
	LastIns, _ := result.LastInsertId()
	fmt.Println("messageHistory rows affected: ", rowsAff)
	fmt.Println("messageHistory last inserted: ", LastIns)
}

// storing chat to DB
func StoreChat(dm Message) {
	stmt, err := sqldb.DB.Prepare("INSERT INTO Chats (user1, user2, creationDate) VALUES (?, ?, ?)")
	if err != nil {
		fmt.Println("error adding chat to DB")
		return
	}
	result, _ := stmt.Exec(dm.Sender, dm.Recipient, Date)
	rowsAff, _ := result.RowsAffected()
	LastIns, _ := result.LastInsertId()
	fmt.Println("chat rows affected: ", rowsAff)
	fmt.Println("chat last inserted: ", LastIns)
}

// get all conversation between 2users by ChatID f
func GetAllMsgsByChatID(cid int) []*Message {
	var AllMsgs []*Message
	msg := NewMessage()
	if err := sqldb.DB.QueryRow("SELECT messageID, chatMessage, sender, recipient, creationDate FROM MessageHistory WHERE chatID = ?", cid).Scan(&msg.MessageID, &msg.Content, &msg.Sender, &msg.Recipient, &msg.Date); err != nil {
		fmt.Println("GetPostByPID: ", err)
		return nil
	}
	// msg.ChatID = cid
	AllMsgs = append(AllMsgs, msg)
	return AllMsgs
}

// show all chats with users
func ReadAllChats() []*Chat {
	var allChats []*Chat
	rows, err := sqldb.DB.Query("SELECT user2 FROM Chats;")
	if err != nil {
		fmt.Println("err: ", err)
		return nil
	}
	for rows.Next() {
		var tempChat *Chat = NewChat()
		err := rows.Scan(&tempChat.User2)
		if err != nil {
			fmt.Println("err: ", err)
		}
		allChats = append(allChats, tempChat)
	}
	rows.Close()
	return allChats
}
func NewMessage() *Message {
	return &Message{}
}
func NewChat() *Chat {
	return &Chat{}
}
