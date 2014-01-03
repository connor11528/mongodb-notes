The Little MongoDB Book
====================
by Kal Seguin (@karlseguin)

book source: http://github.com/karlseguin/the-little-mongodb-book.

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
update takes two arguments, the selector and what field to update with. Update replaces the entire document.

To only update one field use $set:

`db.unicorns.update({name: 'Roooooodles'}, { $set: {weight: 590} })` updates Roooooodles' weight

In real code good to update records by _id.

$inc modeifier is used to increment a field by a certain positive or negative amount

If Pilot killed a couple more vampires we could add this to the database:

`db.unicorns.update({name: 'Pilot'}, {$inc: {vampires: +2} })`

$push adds a value to an array:

`db.unicorns.update({name: 'Aurora'}, { $push: {loves: 'sugar'} })`

# upserts
Upserts updates the document if found or inserts it if not.

count webpage views:

`db.hits.update({page: 'unicorns'}, {$inc: {hits: 1}}, true);` inserts a new document

`db.hits.update({page: 'unicorns'}, {$inc: {hits: 1}}, true);` increments the hits field by 1

`db.unicorns.update({}, {$set: {vaccinated:true}});` does NOT vaccinate all unicorns.

To update ALL records:

`db.unicorns.update({}, {$set: {vaccinated: true}}, false, true);` 
(all records, set field value, upsert: false, multi: true)

## Mastering find

Get all of the unicorns' names:

`db.unicorns.find(null, {name: 1});`

.sort() uses 1 for ascending, -1 for descending

```
// heaviest unicorns first
db.unicorns.find().sort({weight:-1})

// sort by name then vampire kills
db.unicorns.find().sort({name: 1, vampires: -1})
```
```
.limit() limit amount of results
.count() count number of documents found
```
## Data Modeling
Add employee Leto with an explicit _id (_id can be any unique value):

`db.employees.insert({_id: ObjectId(”4d85c7039ab0fd70a117d730”), name: ’Leto’})`

Add employees and make Leto their manager (belong_to):

```
db.employees.insert({_id: ObjectId("4d85c7039ab0fd70a117d731"), name: 'Duncan', manager: ObjectId("4d85c7039ab0fd70a117d730")});
db.employees.insert({_id: ObjectId("4d85c7039ab0fd70a117d732"), name: 'Monica', manager: ObjectId("4d85c7039ab0fd70a117d730")});
```

has_many managers, make it an array:

`db.employees.insert({_id: ObjectId(”4d85c7039ab0fd70a117d733”), name: 'Siona', manager: [ObjectId(”4d85c7039ab0fd70a117d730”), ObjectId(”4d85c7039ab0fd70a117d732”)] })`

`db.employees.find({manager: ObjectId(”4d85c7039ab0fd70a117d730”)})` will find Duncan, Monica and Siona

# Embedded documents:
`db.employees.insert({_id: ObjectId(”4d85c7039ab0fd70a117d734”), name: ’Ghanima’, family: {mother:’Chani’, father: ’Paul’, brother: ObjectId(”4d85c7039ab0fd70a117d730”)}})`

embedded documents can be queried using dot notation:
`db.employees.find({’family.mother’: ’Chani’})`

## Uses for MongoDB

Redis is a persistent key-value store.

MongoDB is a central repository for your data, an alternative to relational databases

*schema-less:* lack of setup, no property mapping or type mapping (C#)

*writes:* good for logging. can send write command and have it return immediately without waiting for write to occur. Can configure and control write behavior

```
// limit our capped collection to 1 megabyte
db.createCollection('logs', {capped: true, size: 1048576})
```
When collection reaches 1MB old documents are automatically purged. Can also limit # of documents rather than size

*Data Processing:* MongoDB relies on MapReduce for most data processing jobs. MapReduce can be parallelized for working with large
datasets. Javascript is single-threaded. For processing large data we'll need Hadoop. There's a MongoDB adapter for Hadoop

*Geospatial:* powerful support for geospatial indexes. Store x and y coordinates within documents and then find documents $near a 
set of coordinates or $within a box or circle. [5 minute geospatial interactive tutorial] to learn more

# data storage conclusion
The message from this chapter is that MongoDB, in most cases, can replace a relational database. It's much simpler and straightforward;
it's faster and generally imposes fewer restrictions on application developers. The lack of transactions can be a legitimate and serious
concern. However, when people ask 'where does MongoDB sit with respect to the new data storage landscape?' the answer is simple: right in
the middle.

## MapReduce

MongoDB currently can't take advantage of parallel computing -- data processing across many different cores/CPUs/machines

MapReduce can do more than SQL code. MapReduce is a pattern with different implementations for different language

First you map, then you reduce

Map transforms the inputted documents and emits key-value pairs, which are then grouped by key such that values for the same
key end up in an array.

Reduce gets key-values and emits a result.

Input:
```
resource	date
index	Jan 20 2010 4:30
index	Jan 20 2010 5:30
about	Jan 20 2010 6:00
index	Jan 20 2010 7:00
about	Jan 21 2010 8:00
about	Jan 21 2010 8:30
index	Jan 21 2010 8:30
about	Jan 21 2010 9:00
index	Jan 21 2010 9:30
index	Jan 22 2010 5:00
```

Expected output:
```
resource year month day count
index 2010 1 20 3
about 2010 1 20 1
about 2010 1 21 3
21
index 2010 1 21 2
index 2010 1 22 1
```

















































