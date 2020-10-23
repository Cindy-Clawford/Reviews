const cassandra = require('cassandra-driver');
const path = require('path');

const client = new cassandra.Client({
  contactPoints: ['127.0.0.1:9042'],
  // host: 'localhost',
  // port: '9160',
  localDataCenter: 'datacenter1'
});

client.connect()

// .then(() => {
//   const query = `DROP TABLE reviews.hotels1`;
//     return client.execute(query);
// })

.then(() => {
  const query = "CREATE TABLE IF NOT EXISTS reviews.hotels1(\
    id INT,\
    hotelId INT,\
    responderOrg TEXT,\
    responderPicture TEXT,\
    responderClose TEXT,\
    responderDate TEXT,\
    responderName TEXT,\
    responderText TEXT,\
    memberId INT,\
    responderPosition TEXT,\
    memberImg TEXT,\
    memberUserName TEXT,\
    memberLocation TEXT,\
    memberContributions INT,\
    memberHelpful INT,\
    reviewDate TEXT,\
    reviewTitle TEXT,\
    reviewText TEXT,\
    reviewTripType TEXT,\
    reviewPictures TEXT,\
    reviewRatings INT,\
    PRIMARY KEY(hotelId, id)\
  )"
  return client.execute(query);
})

.then(() => {
  console.log('success');
  return client.shutdown();
})
.catch((err) => {
  console.error('there was an error:', err);
  return client.shutdown().then(() => { throw err; });
})
