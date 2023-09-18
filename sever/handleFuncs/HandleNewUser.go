package handlefuncs

import (
	"encoding/json"
	"net/http"
	"sever/dbfuncs"
)

func HandleNewUser(w http.ResponseWriter, r *http.Request) {
	Cors(&w, r)

	if r.Method == http.MethodPost {
		var user User
		err := json.NewDecoder(r.Body).Decode(&user)
		if err != nil {
			http.Error(w, err.Error(), http.StatusBadRequest)
			return
		}

		// insert user into SQLite database
		dbfuncs.AddUser(user.NickName, user.FirstName, user.LastName, user.Age, user.Gender, user.Email, HashPassord(user.Password))
		// return success response

		responseData := map[string]string{"message": "User created successfully"}
		response, err := json.Marshal(responseData)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		// Set the "Content-Type" header to "application/json"
		w.Header().Set("Content-Type", "application/json")
		// Write the JSON response to the HTTP response
		w.Write(response)

	} else {
		http.Error(w, `{"error": "405 Method Not Allowed"}`, http.StatusMethodNotAllowed)
	}
}
