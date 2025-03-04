package backend

import (
	"context"
	"encoding/json"
	"log"
	"net/http"
	"strings"

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

func (db *Database) updateBodyBones(w http.ResponseWriter, r *http.Request) {
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

	var bones bson.M
	err := json.NewDecoder(r.Body).Decode(&bones)
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
				"bones": bones,
			},
		},
	)
	if err != nil {
		handleDatabaseError(w, r, err)
		return
	}

	if result.ModifiedCount != 1 {
		log.Printf("update body bones: %s: no data was modified\n", bodyName)
		return
	}
}

func (db *Database) updateBodyBone(w http.ResponseWriter, r *http.Request) {
	bodyName := r.PathValue("bodyName")
	boneName := r.PathValue("boneName")

	if bodyName == "" {
		w.WriteHeader(http.StatusBadRequest)
		w.Write([]byte("body name can't be empty"))
		return
	}

	if boneName == "" {
		w.WriteHeader(http.StatusBadRequest)
		w.Write([]byte("bone name can't be empty"))
		return
	}

	if r.Header.Get("Content-Type") != "application/json" {
		w.WriteHeader(http.StatusBadRequest)
		w.Write([]byte("you must provide a JSON document"))
		return
	}

	var boneUpdate bson.M
	err := json.NewDecoder(r.Body).Decode(&boneUpdate)
	if err != nil {
		handleDatabaseError(w, r, err)
		return
	}

	bone := boneUpdate["bone"]
	breadcrumbJSON := boneUpdate["breadcrumb"]
	
	var breadcrumb []string
	if breadcrumbJSON != nil {
		for _, a := range breadcrumbJSON.([]any) {
			breadcrumb = append(breadcrumb, a.(string))
		}
	}
	log.Println(breadcrumb)

	breadcrumbQuery := strings.Join(breadcrumb, ".")

	coll := db.Mongo().Collection("body")
	ctx := r.Context()

	result, err := coll.UpdateOne(ctx,
		bson.M{
			"generals.name": bodyName,
		},
		bson.M{
			"$set": bson.M{
				"bones." + breadcrumbQuery: bone,
			},
		},
	)
	if err != nil {
		handleDatabaseError(w, r, err)
		return
	}

	if result.ModifiedCount != 1 {
		log.Printf("update body bones: %s: no data was modified\n", bodyName)
		return
	}
}
