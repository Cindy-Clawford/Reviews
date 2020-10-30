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
let writeStream = fs.createWriteStream(`./database/data.txt`);

async function writeFile(writeStream, callback) {

  var totalEntries = 10000000;
  var chunk = 10;

  // var runs = Math.round((totalEntries) / chunk);

  // initiate a closure for hotels to keep track of total generated
  var generator = generate();


  // Adding CSV headers
  writeStream.write(`id|hotelId|responderOrg|responderPicture|responderClose|responderDate|responderName|responderPosition|responderText|memberId|memberImg|memberUserName|memberLocation|memberContributions|memberHelpful|reviewDate|reviewTitle|reviewText|reviewTripType|reviewPictures|reviewRatings\n`);



  async function write() {
    var ok = true;
    // generate a collection of records
      do {
        totalEntries -= chunk;
        var t0 = now();
        var generatedChunk = generator(chunk);
        var t1 = now();
        // console.log(`creating a chunk of size ${chunk} took ${t1 - t0} milliseconds.`);
        if (totalEntries % 100000 === 0) {console.log(`${totalEntries} remaining`)};

        if (totalEntries === 0) {
          writeStream.write(generatedChunk, 'utf8', callback);
        } else {
          ok = writeStream.write(generatedChunk, 'utf8');
        }

      } while (totalEntries > 0 && ok);

      if (totalEntries > 0) {
        await writeStream.once('drain', write);
      }
  }
  write();
}

writeFile(writeStream, () => {
  writeStream.end();
  console.log('write stream ended!');
});
