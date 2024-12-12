package backend

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"net/http"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

type database mongo.Database

func newMongoDB(uri string, dbName string) (*database, error) {
	client, err := mongo.Connect(
		context.Background(),
		options.Client().ApplyURI(uri),
	)
	if err != nil {
		return nil, err
	}

	fmt.Println("MongoDB connected")
	return (*database)(client.Database(dbName)), nil
}

func (db *database) mongo() *mongo.Database {
	return (*mongo.Database)(db)
}

func (db *database) close() error {
	err := db.mongo().Client().Disconnect(context.Background())
	if err != nil {
		return err
	}

	fmt.Println("MongoDB disconnected")
	return nil
}

func handleDatabaseError(w http.ResponseWriter, r *http.Request, err error) {
	w.WriteHeader(http.StatusInternalServerError)
	w.Write([]byte(err.Error()))
	log.Printf("db error: %s: %v\n", r.RequestURI, err)
}

func (db *database) getAllBones(w http.ResponseWriter, r *http.Request) {
	coll := db.mongo().Collection("anatom-struct")
	ctx := r.Context()

	cursor, err := coll.Find(ctx, bson.D{
		{Key: "type", Value: "bone"},
	})
	if err != nil {
		handleDatabaseError(w, r, err)
		return
	}
	defer cursor.Close(ctx)

	var all []bson.M
	err = cursor.All(ctx, &all)
	if err != nil {
		handleDatabaseError(w, r, err)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(all)
}
