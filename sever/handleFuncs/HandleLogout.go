package handlefuncs

import (
	"encoding/json"
	"net/http"
	dbfuncs "sever/dbfuncs"
	"time"
)

func HandleLogout(w http.ResponseWriter, r *http.Request) {

	Cors(&w, r)

	if r.Method == http.MethodPost {
		cookie, err := r.Cookie("user_token")
		if err != nil {
			http.Error(w, `{"error": "something went wrong please login 1"}`, http.StatusUnauthorized)
			return
		}
		if !dbfuncs.ValidateCookie(cookie.Value) {
			http.Error(w, `{"error": "something went wrong please login 2"}`, http.StatusUnauthorized)
			return
		}
		http.SetCookie(w, &http.Cookie{
			Name:     "user_token",
			Value:    "",
			Expires:  time.Unix(0, 0),
			MaxAge:   -1,
			Secure:   true,
			HttpOnly: true,
			SameSite: http.SameSiteLaxMode,
		})
		response := map[string]interface{}{
			"success": true,
		}
		json.NewEncoder(w).Encode(response)

		// w.WriteHeader(http.StatusOK)
	} else {
		http.Error(w, `{"error": "405 Method Not Allowed"}`, http.StatusMethodNotAllowed)
		return
	}

}
