package main

import (
	"fmt"
	"log"
	"net/http"
	"os/exec"
	rtforum "rtforum/tools"
)

func main() {

	fs := http.FileServer(http.Dir("css/"))
	http.Handle("/css/",
		http.StripPrefix("/css/", fs))
	http.HandleFunc("/", rtforum.HomePage)

	exec.Command("xdg-open", "http://localhost:8080/").Start()

	fmt.Println("Starting server at port 8080")
	err := http.ListenAndServe(":8080", nil)
	if err != nil {
		log.Fatal(err)
	}
}
