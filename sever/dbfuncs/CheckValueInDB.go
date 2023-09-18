package dbfuncs

import (
	"database/sql"
	"fmt"
	"net/http"

	_ "github.com/mattn/go-sqlite3"
)

func CheckValueInDB(w http.ResponseWriter, r *http.Request, val, name string) (string, bool, error) {
	if name != "nickname" && name != "email" {
		return "Invalid column name", false, nil
	}

	db, err := sql.Open("sqlite3", "./forum.db")
	if err != nil {
		return "Error connecting to database", false, err
	}
	defer db.Close()

	var count int
	query := fmt.Sprintf("SELECT COUNT(*) FROM users WHERE %s = ?", name)
	err = db.QueryRow(query, val).Scan(&count)
	if err != nil {
		return "Error querying database", false, err
	}

	return "", count > 0, nil
}
