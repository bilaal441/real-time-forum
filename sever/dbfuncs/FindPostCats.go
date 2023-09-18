package dbfuncs

import (
	"database/sql"
	"log"

	"github.com/google/uuid"
	_ "github.com/mattn/go-sqlite3"
)

func FindPostsCats(PostId string) []string {
	database, _ := sql.Open("sqlite3", "../sever/forum.db")

	rows, err := database.Query("SELECT CatId FROM PostCat WHERE PostId=?", PostId)
	if err == sql.ErrNoRows {
		return nil
	} else if err != nil {
		log.Fatal(err)
	}

	defer rows.Close()

	var AllCats []string

	for rows.Next() {
		var CatId uuid.UUID
		err := rows.Scan(&CatId)
		if err != nil {
			log.Fatal(err)
		}
		name := database.QueryRow("SELECT Name FROM Categories WHERE Id=?", CatId)
		var cat string
		err = name.Scan(&cat)
		if err != nil {
			log.Fatal(err)
		}
		AllCats = append(AllCats, cat)
	}
	return AllCats
}
