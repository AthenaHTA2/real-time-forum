package tools

import (
	"html/template"
	"net/http"
)

func Post(w http.ResponseWriter, r *http.Request) {

	if r.URL.Path != "/" {
		http.Error(w, "404 Page Not Found", 404)
		return
	}

	templ, err := template.ParseFiles("templates/home.html")

	err = templ.Execute(w, "")

	if err != nil {
		http.Error(w, "Error with parsing home.html", http.StatusInternalServerError)
		return
	}

}
