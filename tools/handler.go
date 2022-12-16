package tools

import (
	"html/template"

	"net/http"
)

//server goroutine that loads real-time-forum 'home' page
func HomePage(w http.ResponseWriter, r *http.Request) {
	templ, err := template.ParseFiles("templates/home.html")

	if err != nil {
		http.Error(w, "Error with parsing home.html", http.StatusInternalServerError)
		return
	}

	err = templ.Execute(w, "")

	if err != nil {
		http.Error(w, "Error with writing home.html", http.StatusInternalServerError)
		return
	}

}

