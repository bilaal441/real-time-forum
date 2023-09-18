package dbfuncs

import (
	"database/sql"
	"fmt"
	"time"

	"github.com/google/uuid"
	_ "github.com/mattn/go-sqlite3"
)

func AddSession(id uuid.UUID, user, UserID string, Expires time.Time) {
	database, err := sql.Open("sqlite3", "../sever/forum.db")
	if err != nil {
		fmt.Println(err)
	}
	statement, _ := database.Prepare("INSERT INTO sessions VALUES (?,?,?,?)")

	statement.Exec(id, user, Expires, UserID)
}
