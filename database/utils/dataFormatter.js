// formats Cassandra reviews to the client expected format
var clientFormat = (reviews) => {
  var formattedReviews = [];

  // change between pictures folder (local) or s3 bucket
  // var url = "https://adcobareviews.s3-us-west-1.amazonaws.com";
  var url = 'pictures';

  for (var i = 0; i < reviews.length; i++) {
    formattedReview = {
      _id: reviews[i].id,
      memberInfo: {},
      responderInfo: {},
      reviewInfo: {}
    };

    var reviewpictures = imageFormatter(reviews[i].reviewpictures, url);

    // transforms the review data to the expected format
    formattedReview.memberInfo = {
      memberContributions: reviews[i].membercontributions,
      memberHelpful: reviews[i].memberhelpful,
      memberId: reviews[i].memberid,
      memberImg: `${url}${reviews[i].memberimg}`,
      memberLocation: reviews[i].memberlocation,
      memberUserName: reviews[i].memberusername
    }
    formattedReview.responderInfo = {
      hotelId: reviews[i].hotelid,
      responderClose: reviews[i].responderclose,
      responderDate: reviews[i].responderdate,
      responderName: reviews[i].respondername,
      responderOrg: reviews[i].responderorg,
      responderPicture: `${url}${reviews[i].responderpicture}`,
      responderPosition: reviews[i].responderposition,
      responderText: reviews[i].respondertext
    }
    formattedReview.reviewInfo = {
      reviewDate: reviews[i].reviewdate,
      reviewPictures: reviewpictures,
      reviewRatings: ratingFormatter(reviews[i].reviewratings),
      reviewText: reviews[i].reviewtext,
      reviewTitle: reviews[i].reviewtitle,
      reviewTripType: reviews[i].reviewtriptype
    }

    formattedReviews.push(formattedReview);
  }
  return formattedReviews;
}

// transforms the review pictures into the expected format i.e. {picture1: https..., etc}
var imageFormatter = (cassandraImgs, url) => {

  var formattedPictures = {};
  var reviewsArr = cassandraImgs.split(',');
  for (var p = 0; p < reviewsArr.length; p++) {
    reviewsArr[p] = url + reviewsArr[p];
    formattedPictures[`picture${p + 1}`] = reviewsArr[p];
  }
  return formattedPictures;
}

// tranforms the rating into the expected format i.e. [1,1,1,1,0] for 4 stars
var ratingFormatter = (cassandraRating) => {

  var rating = [];
  while (rating.length < 5) {

    if (cassandraRating > 0) {
      rating.push(1);
      cassandraRating--;
    } else {
      rating.push(0);
    }
  }
  return rating;
}

module.exports = { clientFormat }
