package tools

import (
	"html/template"
	"net/http"
)

func HomePage(w http.ResponseWriter, r *http.Request) {
	templ, err := template.ParseFiles("templates/home.html")

	err = templ.Execute(w, "")

	if err != nil {
		http.Error(w, "Error with parsing home.html", http.StatusInternalServerError)
		return
	}

}
