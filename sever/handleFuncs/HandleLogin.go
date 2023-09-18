package handlefuncs

import (
	"database/sql"
	"encoding/json"
	"net/http"
	"sever/dbfuncs"
	"time"

	"github.com/google/uuid"
)

type LoginData struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

func HandleLogin(w http.ResponseWriter, r *http.Request) {
	Cors(&w, r)

	if r.Method == http.MethodPost {

		var entredData LoginData
		errj := json.NewDecoder(r.Body).Decode(&entredData)
		if errj != nil {
			http.Error(w, `{"error": "`+errj.Error()+`"}`, http.StatusBadRequest)
			return
		}
		var db *sql.DB
		db, err := sql.Open("sqlite3", "./forum.db")
		if err != nil {
			http.Error(w, `{"error": "`+err.Error()+`"}`, http.StatusInternalServerError)
			return
		}
		defer db.Close()

		var id string
		var username string
		var storedPassword string
		var imgUrl string

		// var storedPassword string
		err = db.QueryRow("SELECT Id, password, Nickname,  profileImg  FROM Users WHERE email=?", entredData.Email).Scan(&id, &storedPassword, &username, &imgUrl)
		if err != nil {
			http.Error(w, `{"error": "your email or passord is incorrect"}`, http.StatusBadRequest)
			return
		}

		if isPasswordValid([]byte(storedPassword), []byte(entredData.Password)) != nil {
			// fmt.Println(isPasswordValid([]byte(storedPassword), []byte(entredData.Password)))
			http.Error(w, `{"error": "your email or passord is incorrect"}`, http.StatusBadRequest)
			return

		}

		sessionId, _ := uuid.NewRandom()

		session := Session{
			Id:       sessionId,
			Username: username,
			Expires:  time.Now().Add(24 * time.Hour),
			UserID:   id,
		}
		//  detlete old session
		dbfuncs.DeleteSessionColumn("userId", id)
		// add new session
		dbfuncs.AddSession(session.Id, session.Username, session.UserID, session.Expires)

		http.SetCookie(w, &http.Cookie{
			Name:     "user_token",
			Value:    sessionId.String(),
			Expires:  session.Expires,
			Secure:   true,
			HttpOnly: true,
			SameSite: http.SameSiteNoneMode,
		})
		response := map[string]interface{}{
			"success":    true,
			"username":   session.Username,
			"profileImg": imgUrl,
			"id":         session.UserID,
		}
		json.NewEncoder(w).Encode(response)

		// w.WriteHeader(http.StatusOK)
	} else {
		http.Error(w, `{"error": "405 Method Not Allowed"}`, http.StatusMethodNotAllowed)
		return
	}

}
