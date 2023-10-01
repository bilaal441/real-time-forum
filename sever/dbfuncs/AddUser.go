package dbfuncs

import (
	"time"

	"github.com/google/uuid"
	_ "github.com/mattn/go-sqlite3"
)

func AddUser(nickName, firstName, lastName, age, gender, Email string, Password []byte) {
	id, _ := uuid.NewRandom()
	created := time.Now()
	statement, _ := database.Prepare("INSERT INTO Users VALUES (?,?,?,?,?,?,?,?,?,?)")
	img := "user.png"

	statement.Exec(id, nickName, firstName, lastName, age, gender, Email, Password, img, created)
}
