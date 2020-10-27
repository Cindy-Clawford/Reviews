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

async function writeFiles() {

  var totalEntries = 10000000;
  var chunk = 20000;

  var runs = Math.round((totalEntries) / chunk);

  // initiate a closure for hotels to keep track of total generated
  var generator = generate();

  for (var f = 1; f <= 20; f++) {

    let writeStream = fs.createWriteStream(`./database/part${f}.txt`);

    // Adding CSV headers
    writeStream.write(`id|hotelId|responderOrg|responderPicture|responderClose|responderDate|responderName|responderPosition|responderText|memberId|memberImg|memberUserName|memberLocation|memberContributions|memberHelpful|reviewDate|reviewTitle|reviewText|reviewTripType|reviewPictures|reviewRatings\n`);

    await writeGeneratedRecords((runs / 20), writeStream);
    writeStream.end();
  }



  async function writeGeneratedRecords(runs, writeStream) {
    // generate a collection of records
    for (var i = 0; i < runs; i++) {
      var t0 = now();
      var generatedChunk = generator(chunk);
      var t1 = now();
      console.log(`creating a chunk of size ${chunk} took ${t1 - t0} milliseconds.`);
      console.log(`${( ((i + 1) / runs) * 100 ).toFixed(2)}% completed`);

      // writing generated chunk to data.txt (CSV format)
      if(!writeStream.write(generatedChunk)) {
        // draining when needed
        writeStream.once('drain', writeGeneratedRecords);
        console.log('-------------------------- pool drained! --------------------------')
      }

    }
  }

}

writeFiles();
