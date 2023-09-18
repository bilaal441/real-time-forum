package dbfuncs

import (
	"database/sql"
	"time"

	"github.com/google/uuid"
	_ "github.com/mattn/go-sqlite3"
)

func AddComment(Comment, SessionId string, PostId string) ( string ,error) {
	// fmt.Println(Comment, SessionId, PostId)
	database, err := sql.Open("sqlite3", "../sever/forum.db")
	if err != nil {
		return "", err
	}
	id, err := uuid.NewRandom()
	if err != nil {
		return "", err
	}

	created := time.Now()
	statement, err := database.Prepare("INSERT INTO Comments VALUES (?,?,?,?,?)")
	if err != nil {
		return  "", err
	}
	var UserId uuid.UUID
	err = database.QueryRow("SELECT  userId  FROM Sessions WHERE Id=?", SessionId).Scan(&UserId)

	if err != nil {

		return "", err
	}

	statement.Exec(id, Comment, UserId, PostId, created)

	return id.String(), nil
}
