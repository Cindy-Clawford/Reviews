const faker = require('faker');
const moment = require('moment');

// closure to keep track of total hotels made for hotelId
const generate = () => {
  var totalHotels = 0;
  var id = 1;

  // generate n fake hotels
  var wrapper = (n) => {
    var hotels = ``;
    for (var i = 0; i < n; i++) {

      let travelTypes = ['Families', 'Couples', 'Solo', 'Business', 'Friends'];
      let close = faker.company.bsAdjective();

      //hotel info
      var hotelId = totalHotels;
      totalHotels++;

      const responderOrg = faker.company.companyName();
      const responderPicture = `/a30.jpg`;
      const responderClose = close.charAt(0).toUpperCase() + close.slice(1);

      // 0 to 20 review per hotel
      var reviewsCount = Math.round(Math.random() * 20);
      for (var j = 0; j < reviewsCount; j++) {
        const randomDate = moment(faker.date.past(10)).format('YYYY-MM-DD');
        const responderDate = randomDate;
        const responderName = faker.name.findName();
        const responderPosition = faker.name.jobTitle();
        const responderText = faker.lorem.words();

        //member info
        const memberId = j;
        const memberImg = `/a${Math.ceil((Math.random() * 9) + 20)}.jpg`;
        const memberUserName = faker.internet.userName();
        const memberLocation = faker.address.city();
        const memberContributions = Math.ceil(Math.random() * 50);
        const memberHelpful = Math.floor(Math.random() * 5);

        //review info
        const reviewTripType = travelTypes[Math.round(Math.random() * 4)];
        const reviewDate = randomDate;
        const reviewTitle = faker.commerce.productAdjective();
        const reviewText = faker.lorem.words();

        var reviewPictures = '';
        var numOfPictures = Math.floor(Math.random() * 5) + 1;
        for (var p = 0; p < numOfPictures; p++) {
          if (p > 0) {
            reviewPictures += ',';
          }
          reviewPictures += `/a${Math.ceil(Math.random() * 20)}.jpg`;
        };

        let reviewRatings = Math.ceil(Math.random() * 5);

        //adding one hotel review
        hotels += `${id}|${hotelId}|${responderOrg}|${responderPicture}|${responderClose}|${responderDate}|${responderName}|${responderPosition}|${responderText}|${memberId}|${memberImg}|${memberUserName}|${memberLocation}|${memberContributions}|${memberHelpful}|${reviewDate}|${reviewTitle}|${reviewText}|${reviewTripType}|${reviewPictures}|${reviewRatings}\n`;

        id++;
      }
    }
    return hotels;
  }
  // returns the inner function which has access to the hotel counter closure
  return wrapper;
}

module.exports = { generate };
