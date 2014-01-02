## Intro to MongoDB
MongoDB has a number of official drivers for various languages. On top of this the development community
has built more language/framework-specific libraries

mongod is the server process
mongo is the client shell

`db.version()`

- a MongoDB instance can have zero or more databases
- a database can have zero or more collections (collections == tables)
- a collection can have zero or more documents (documents == rows)
- a document can have one or more fields (fields == columns)
- indexes in MongoDB function much like their RDBMS counterparts
- when you ask MongoDB for data, it returns a cursor, which we can do things to, without actually pulling down data
- mongo client shell runs javascript

- commands against the current database are executed against the `db` object
- commands against a specific collection are executed against `db.COLLECTION_NAME`

## Create database
```
> use mongodb-begin
switched to db mongodb-begin
```

Since collections are schema-less we don't need to explicitly create them:
```
> db.superheroes.insert({name: 'Batman', hometown: 'Gotham'})
> db.superheroes.insert({name:'Superman', gender:'m', badass:false})
> db.getCollectionNames()
[ "superheroes", "system.indexes" ]
> db.superheroes.find()
{ "_id" : ObjectId("52c59e0e16c44876ddfa042f"), "name" : "Batman", "hometown" : "Gotham" }
{ "_id" : ObjectId("52c59fb116c44876ddfa0430"), "name" : "Superman", "gender" : "m", "badass" : false }


```
system.indexes is created once per database and contains the information on our database's index

Every document must have a unique _id field. MongoDB generates a unique ObjectId for you

```
> db.superheroes.remove()
> db.superheroes.find()
> 
```
Since we don't pass a selector to remove() it removes all documents in the collection

## Selectors

`{field: value}` is used to find any documents where field is equal to value

`{field: value, field2: value2}` is equivalent to an AND statement

```
$lt == less than
$lte == less than or equal
$gt == greater than
$gte == greater than or equal
$ne == not equal
```

`db.unicorns.find({gender: 'm', weight: {$gt: 700} })` gets all male unicorns > 700 lbs

$exists operator is used for matching the presence or absence of a field:

`db.unicorns.find({vampires: {$exists: false} })` matches the document without a vampires field

$or operator is used with an array:

`db.unicorns.find({gender: ’f’, $or: [{loves: ’apple’}, {loves: ’orange’}, {weight: {$lt: 500}}]})`

Will find all female unicorns that love apples or love oranges or weigh less than 500 lbs

Select by ObjectId:

`db.unicorns.find({_id: ObjectId(”TheObjectId”)})`

Advanced selector: $where -- allows us to supply javascript to execute on the server

Selectors can be used with the find, remove, count and update commands.

## update command































































