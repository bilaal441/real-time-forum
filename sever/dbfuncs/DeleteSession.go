package dbfuncs

import (
	"database/sql"
	"fmt"
)

func DeleteSessionColumn(column string, value interface{}) error {
	db, err := sql.Open("sqlite3", "./forum.db")
	if err != nil {
		return err
	}
	defer db.Close()

	stmt, err := db.Prepare(fmt.Sprintf("DELETE FROM Sessions WHERE %s = ?", column))
	if err != nil {
		return err
	}
	defer stmt.Close()

	_, err = stmt.Exec(value)
	if err != nil {
		return err
	}
	return nil

}
