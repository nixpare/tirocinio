package backend

import (
	"context"
	"encoding/json"
	"errors"
	"log"
	"net/http"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

type Database mongo.Database

func NewMongoDB(uri string, dbName string) (*Database, error) {
	client, err := mongo.Connect(
		context.Background(),
		options.Client().ApplyURI(uri),
	)
	if err != nil {
		return nil, err
	}

	return (*Database)(client.Database(dbName)), nil
}

func (db *Database) Mongo() *mongo.Database {
	return (*mongo.Database)(db)
}

func (db *Database) Close() error {
	err := db.Mongo().Client().Disconnect(context.Background())
	if err != nil {
		return err
	}

	return nil
}

func handleDatabaseError(w http.ResponseWriter, r *http.Request, err error) {
	w.WriteHeader(http.StatusInternalServerError)
	w.Write([]byte(err.Error()))
	log.Printf("db error: %s: %v\n", r.RequestURI, err)
}

func (db *Database) getAllBones(w http.ResponseWriter, r *http.Request) {
	coll := db.Mongo().Collection("anatom-struct")
	ctx := r.Context()

	cursor, err := coll.Find(ctx, bson.M{
		"type": "bone",
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

func (db *Database) getBody(w http.ResponseWriter, r *http.Request) {
	bodyName := r.PathValue("bodyName")
	if bodyName == "" {
		w.WriteHeader(http.StatusBadRequest)
		w.Write([]byte("body name can't be empty"))
		return
	}

	coll := db.Mongo().Collection("body")
	ctx := r.Context()

	result := coll.FindOne(ctx, bson.M{
		"generals.name": bodyName,
	})
	if err := result.Err(); err != nil {
		handleDatabaseError(w, r, err)
		return
	}

	var body bson.M
	err := result.Decode(&body)
	if err != nil {
		handleDatabaseError(w, r, err)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(body)
}

func (db *Database) updateBodySkeleton(w http.ResponseWriter, r *http.Request) {
	bodyName := r.PathValue("bodyName")
	if bodyName == "" {
		w.WriteHeader(http.StatusBadRequest)
		w.Write([]byte("body name can't be empty"))
		return
	}

	if r.Header.Get("Content-Type") != "application/json" {
		w.WriteHeader(http.StatusBadRequest)
		w.Write([]byte("you must provide a JSON document"))
		return
	}

	var skeleton bson.M
	err := json.NewDecoder(r.Body).Decode(&skeleton)
	if err != nil {
		handleDatabaseError(w, r, err)
		return
	}

	coll := db.Mongo().Collection("body")
	ctx := r.Context()

	result, err := coll.UpdateOne(ctx,
		bson.M{
			"generals.name": bodyName,
		},
		bson.M{
			"$set": bson.M{
				"skeleton": skeleton,
			},
		},
	)
	if err != nil {
		handleDatabaseError(w, r, err)
		return
	}

	if result.ModifiedCount != 1 {
		handleDatabaseError(w, r, errors.New("no data was modified"))
		return
	}
}
