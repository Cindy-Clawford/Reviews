const {generate} = require('./dataGenerator.js');
const fs = require('fs');
const now = require('performance-now');

// instead of having the data live in 3 seperate objects, the data now lives in one container
// reviewPictures is now a string that seperates the images by , instead of an object with picture1, picture2 etc..
// reviewRatings is now a number such as 5 or 4 instead of an array of [1,1,1,1,1] or [1,1,1,1,0]

function seed() {

  var totalEntries = 100;
  var chunk = 10;
  var runs = totalEntries / chunk;

  /*
    csvHeaders broken into (flattened into one table):
    MemberInfo,
    reviewInfo,
    responderInfo
  */
  // let csvHeaders = '\
  //   memberId,memberImg,memberUserName,memberLocation,memberContributions,memberHelpful,\
  //   reviewDate,reviewTitle,reviewText,reviewTripType,reviewPictures,reviewRatings,\
  //   hotelId,responderOrg,responderPicture,responderClose,responderDate,responderName,responderPosition,responderText'


  let writeStream = fs.createWriteStream('./database/data.txt');

  var data = [];
  var newWrite = true;

  var generator = generate();

  for (var i = 0; i < runs; i++) {
    var t0 = now();
    var generatedChunk = generator(chunk);
    var t1 = now();
    console.log(`creating a chunk of size ${chunk} took ${t1 - t0} milliseconds.`);
    console.log(`${((i + 1) / runs) * 100}% completed`);

    // if (newWrite) {
    //   // writeStream.write("[");
    //   newWrite = false;
    // } else {
    //   writeStream.write("|");
    // }

    // var stringifiedChunk = JSON.stringify(generatedChunk);
    // writeStream.write(stringifiedChunk.slice(1, stringifiedChunk.length - 1));

    // Adding CSV headers
    writeStream.write(`hotelId,responderOrg,responderPicture,responderClose,responderDate,responderName,responderPosition,responderText,memberId,memberImg,memberUserName,memberLocation,memberContributions,memberHelpful,reviewDate,reviewTitle,reviewText,reviewTripType,reviewPictures,reviewRatings\n`);

    for (var h = 0; h < generatedChunk.length; h++) {
      var hotel = generatedChunk[h];

      // [hotelId, responderOrg, responderPicture, responderClose,
      //   responderDate, responderName, responderPosition, responderText,
      //   memberId, memberImg, memberUserName, memberLocation, memberContributions, memberHelpful,
      //   reviewDate, reviewTitle, reviewText, reviewTripType, reviewPictures, reviewRatings] = generatedChunk;
        // debugger;
      writeStream.write(`${hotel.hotelId},${hotel.responderOrg},${hotel.responderPicture},${hotel.responderClose},${hotel.responderDate},${hotel.responderName},${hotel.responderPosition},${hotel.responderText},${hotel.memberId},${hotel.memberImg},${hotel.memberUserName},${hotel.memberLocation},${hotel.memberContributions},${hotel.memberHelpful},${hotel.reviewDate},${hotel.reviewTitle},${hotel.reviewText}${hotel.reviewTripType},${hotel.reviewPictures},${hotel.reviewRatings}\n`);
    }


  }

  // writeStream.write("]");
  writeStream.end();
}

seed();
