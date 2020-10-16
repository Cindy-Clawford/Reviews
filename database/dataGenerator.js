const faker = require('faker');

// generate n fake hotels
const generate = (n) => {
  var hotels = [];
  for (var i = 0; i < n; i++) {
    var currHotelReview = {
      responderInfo: {},
      memberInfo: {},
      reviewInfo: {}
    };

    let travelTypes = ['Families','Couples', 'Solo', 'Business', 'Friends'];
    let close = faker.company.bsAdjective();
    //hotel info
    const hotelId = i;
    const responderOrg = faker.company.companyName();
    const responderPicture = `https://adcobareviews.s3-us-west-1.amazonaws.com/a30.jpg`;
    const responderClose = close.charAt(0).toUpperCase() + close.slice(1);



    var randomReviewNumber = Math.ceil(Math.random() * 5);
    //change back
    for (var j = 0; j < 5; j++) {
      const randomDate = faker.date.recent(360);
      const responderDate = randomDate;
      const responderName = faker.name.findName();
      const responderPosition = faker.name.jobTitle();
      const responderText = faker.lorem.paragraph(3, '\n');

      currHotelReview.responderInfo = {
        hotelId, responderOrg, responderPicture, responderClose,
        responderDate, responderName, responderPosition, responderText
      };

      //member info
      const memberId = j;
      const memberImg = `https://adcobareviews.s3-us-west-1.amazonaws.com/a${Math.ceil((Math.random() * 9) + 20)}.jpg`;
      const memberUserName = faker.internet.userName();
      const memberLocation = faker.address.city();
      const memberContributions = Math.ceil(Math.random() * 50);
      const memberHelpful = Math.floor(Math.random() * 5);

      currHotelReview.memberInfo = {
        memberId, memberImg, memberUserName, memberLocation, memberContributions, memberHelpful
      };

      //review info
      const tType = travelTypes[Math.floor(Math.random() * 5)];
      const reviewDate = randomDate;
      const reviewTitle = faker.commerce.productAdjective();
      const reviewText = faker.lorem.text();
      const reviewTripType = tType;
      const reviewPictures = {
        picture1:`https://adcobareviews.s3-us-west-1.amazonaws.com/a${Math.ceil(Math.random() * 20)}.jpg`,
        picture2:`https://adcobareviews.s3-us-west-1.amazonaws.com/a${Math.ceil(Math.random() * 20)}.jpg`,
        picture3:`https://adcobareviews.s3-us-west-1.amazonaws.com/a${Math.ceil(Math.random() * 20)}.jpg`,
        picture4:`https://adcobareviews.s3-us-west-1.amazonaws.com/a${Math.ceil(Math.random() * 20)}.jpg`
      };

      let ratings = [0, 0, 0, 0, 0];
      let randNum = Math.ceil(Math.random() * 5)
      for (let i = 0; i < randNum; i++) {
        ratings[i] = 1;
      }
      const reviewRatings = ratings;
      currHotelReview.reviewInfo = {
        reviewDate, reviewTitle, reviewText, reviewTripType, reviewPictures, reviewRatings
      };

    }
    //add it to hotels
    hotels.push((currHotelReview));
  }
  return hotels;
}

var hotels = generate(100);

module.exports = { hotels };
