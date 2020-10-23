const {generate} = require('./recordsGenerator.js');
const fs = require('fs');
const now = require('performance-now');

/* ------------------------------------------ notes for the future ------------------------------------------
  - instead of having the data live in 3 seperate objects, the data now lives in one container
  - reviewPictures is now a string that seperates the images by , instead of an object with picture1, picture2 etc..
  - reviewPictures, memberImg, responderPicture images have https://adcobareviews.s3-us-west-1.amazonaws.com
    removed to reduce file size
  - reviewRatings is now a number such as 5 or 4 instead of an array of [1,1,1,1,1] or [1,1,1,1,0]
*/

function seed() {

  var totalEntries = 10000000;
  var chunk = 20000;
  var runs = totalEntries / chunk;

  let writeStream = fs.createWriteStream('./database/data.txt');

  // initiate a closure for hotels to keep track of total generated
  var generator = generate();

  // Adding CSV headers
  writeStream.write(`id|hotelId|responderOrg|responderPicture|responderClose|responderDate|responderName|responderPosition|responderText|memberId|memberImg|memberUserName|memberLocation|memberContributions|memberHelpful|reviewDate|reviewTitle|reviewText|reviewTripType|reviewPictures|reviewRatings\n`);

  function writeToDB() {
    // generate a collection of records
    for (var i = 0; i < runs; i++) {
      var t0 = now();
      var generatedChunk = generator(chunk);
      var t1 = now();
      console.log(`creating a chunk of size ${chunk} took ${t1 - t0} milliseconds.`);
      console.log(`${( ((i + 1) / runs) * 100 ).toFixed(2)}% completed`);

      // writing generated chunk to data.txt (CSV format)
      writeStream.write(generatedChunk);

      // drain every 10 chunks
      if (i > 0 && i % 10 === 0) {
        writeStream.once('drain', writeToDB);
        console.log('-------------------------- pool drained! --------------------------')
      }
    }
  }

  writeToDB();

  writeStream.end();
}

seed();
