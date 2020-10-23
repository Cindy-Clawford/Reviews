# Reviews
===================
Interactive Review Section for a TripAdCoba listing.

Disaplys general layout of reviews, and options for reviews.


## Getting Started:
-------------------
1. npm install
2. npm seedDB
3. npm build
4. npm start

----------------

## Databases
------------
### Generating 100 million records CSV:
---------------------------------------
run: npm run genData.js | to generate the 100 million record csv file

### Cassandra setup
-------------------
1. Install Cassandra and dependencies/tools (Java, Python, cql)
   Note: Cassandra 3.x on MacOS requires java 8, and does not run on newer versions.
2. in cqlsh: CREATE reviews WITH REPLICATION = {'class' : 'SimpleStrategy', 'replication_factor' : 3 } | to create the keyspace
3. run: node database/cassandra.js | to create the table
4. in /bin/cassandra.yaml set: write_request_timeout_in_ms: 20000
5. in cqlsh: COPY reviews.hotels1 (id,hotelId,responderOrg,responderPicture,responderClose,responderDate,responderName,responderPosition,responderText,memberId,memberImg,memberUserName,memberLocation,memberContributions,memberHelpful,reviewDate,reviewTitle,reviewText,reviewTripType,reviewPictures,reviewRatings) FROM '/Users/azizbouland/Documents/Hack Reactor/sdc/Reviews/database/data.txt' WITH DELIMITER = '|' AND HEADER = true;

### PostgreSQL setup
--------------------
1. Install PostgreSQL
2. in terminal: createdb reviews
3. in terminal: node database/postgres.js | to create the table and seed it
4. to optimize, in postgres: CREATE INDEX hotel_idx ON hotels (hotelid);


### For a small MongoDB sample:
-------------------------------
All the review datas are generated from database/sampleGenerator.js.
Read alongside database/mongo.js to best understand schema.

Using Database:
1. mongo
2. use review

-Read Data:
1. db.reviews.find({}).pretty();

-Reseed:
1. db.reviews.dropDatabase();
2. ctrl + C (quit mongo);
3. npm seedDB

----------------

## Server
---------
server/index.js handles all requests.
Read src/component/app.jsx componentDidMount function to best undestand its structures.

----------------

## Filtering
------------
Filtering functions has many overlaps, and will be possible to refactor to simplify its complexity.
Becareful of variable name changes.

----------------

## CRUD API
-----------
**Create**
Post request to `/hotel/:hotel` with the review details in the request body in JSON format

**Read**
Get request to `/hotel/:hotel`, the server responds with an array of the reviews for the selected hotel

**Update**
Put request to `/hotel/:reviewId`, including the new review text in the body of the request in the following format as JSON: { "text": "write new text here"}


**Delete**
Delete request to `/hotel/:reviewId`, which deletes the review by the given Id, responds with the deleted review if it exists
