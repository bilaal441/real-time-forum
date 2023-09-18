package dbfuncs

import (
	"database/sql"
	"time"

	"github.com/google/uuid"
	_ "github.com/mattn/go-sqlite3"
)

func AddUser(nickName, firstName, lastName, age, gender, Email string, Password []byte) {
	database, _ := sql.Open("sqlite3", "../sever/forum.db")
	id, _ := uuid.NewRandom()
	created := time.Now()
	statement, _ := database.Prepare("INSERT INTO Users VALUES (?,?,?,?,?,?,?,?,?,?)")
	img := "user.png"

	statement.Exec(id, nickName, firstName, lastName, age, gender, Email, Password, img, created)
}
