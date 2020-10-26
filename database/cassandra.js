const cassandra = require('cassandra-driver');
const path = require('path');
const { clientFormat } = require('./utils/dataFormatter.js');

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
  )\
  WITH compression = { 'class' : 'LZ4Compressor' }\
  "
  return client.execute(query);
})

.then(() => {
  console.log('success');
  // ---------------------------------- Note: ----------------------------------
  // might have to shutdown at some point to free up connections
  // return client.shutdown();
})
.catch((err) => {
  console.error('there was an error:', err);
  return client.shutdown().then(() => { throw err; });
})

var save = (review, hotelId) => {

  return new Promise((resolve, reject) => {
    // save expects a review in the format shown at the bottom
    const query = `INSERT INTO reviews.hotels1 \
    (id,hotelid,responderorg,responderpicture,responderclose,responderdate,respondername,\
      responderposition,respondertext,memberid,memberimg,memberusername,memberlocation,\
      membercontributions,memberhelpful,reviewdate,reviewtitle,reviewtext,reviewtriptype,\
      reviewpictures,reviewratings) VALUES \
      (${review.id},${review.hotelId},'${review.responderOrg}','${review.responderPicture}',\
      '${review.responderClose}','${review.responderDate}','${review.responderName}',\
      '${review.responderPosition}','${review.responderText}',${review.memberId},\
      '${review.memberImg}','${review.memberUserName}','${review.memberLocation}',\
      ${review.memberContributions},${review.memberHelpful},'${review.reviewDate}',\
      '${review.reviewTitle}','${review.reviewText}','${review.reviewTripType}',\
      '${review.reviewPictures}',${review.reviewRatings}
      )`;

    return client.execute(query)
    .then((result) => {
      resolve('saved successfully!');
    })
    .catch((err) => {
      reject(err.stack);
    })

  })
}

var read = (hotelId) => {
  return new Promise((resolve, reject) => {
    const query = `SELECT * FROM reviews.hotels1 WHERE hotelid = ${hotelId}`;
    return client.execute(query)
    .then((results) => {
      var reviews = results.rows;

      var formattedReviews = clientFormat(reviews);

      resolve(formattedReviews);
    })
    .catch((err) => {
      reject(err.stack);
    })
  })
}

module.exports = { save, read }

// sample entry to save review
// {"id": 99992285,
// "hotelId": 10000000,
// "responderOrg": "some-org",
// "responderPicture": "/a30",
// "responderClose": "idk what this is",
// "responderDate": "2015-02-25",
// "responderName": "Jaime Grimes",
// "responderText": "some random text",
// "memberId": "15",
// "responderPosition": "random response",
// "memberImg": "/a30",
// "memberUserName": "melvin",
// "memberLocation": "South Daim Cronus",
// "memberContributions": 16,
// "memberHelpful": 5,
// "reviewDate": "2015-02-15",
// "reviewTitle": "epic title",
// "reviewText": "send help pls",
// "reviewTripType": "casual",
// "reviewPictures": "/a5.jpg,/a2.jpg,/a14.jpg,/a9.jpg",
// "reviewRatings": 1}
