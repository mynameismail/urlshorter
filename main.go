package main

import (
	"encoding/json"
	"log"
	"net/http"
)

// Profile struct
type Profile struct {
	Name    string   `json:"name"`
	Hobbies []string `json:"hobbies"`
}

func hello(res http.ResponseWriter, req *http.Request) {
	profile := Profile{"Ismail", []string{"Nonton", "Makan"}}
	data, err := json.Marshal(profile)

	if err != nil {
		res.WriteHeader(500)
	}

	res.WriteHeader(200)
	res.Header().Set("Content-Type", "application/json")
	res.Write(data)
}

func hai(res http.ResponseWriter, req *http.Request) {
	profile := Profile{"Mail", []string{"Nonton"}}
	data, err := json.Marshal(profile)

	if err != nil {
		res.WriteHeader(500)
	}

	res.WriteHeader(200)
	res.Header().Set("Content-Type", "application/json")
	res.Write(data)
}

func main() {
	http.HandleFunc("/", hello)
	http.HandleFunc("/hai", hai)
	log.Println(http.ListenAndServe(":8080", nil))
}
