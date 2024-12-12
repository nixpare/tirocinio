package backend

import (
	"encoding/json"
	"os"
)

type Config struct {
	HTTPPort    int    `json:"http_port"`
	StaticDir   string `json:"static_dir"`
	ReactPort   int    `json:"react_port"`
	RedirectToReact bool `json:"redirect_to_react"`
	MongoURL    string `json:"mongo_url"`
	MongoDBName string `json:"mongo_db_name"`
}

func LoadConfig(file string) (conf Config, err error) {
	data, err := os.ReadFile(file)
	if err != nil {
		return
	}

	err = json.Unmarshal(data, &conf)
	return
}