const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/review', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

mongoose.set('useFindAndModify', false);

let reviewSchema = mongoose.Schema({
  memberInfo: {
    memberId: Number,
    memberImg: String,
    memberUserName: String,
    memberLocation: String,
    memberContributions: Number,
    memberHelpful: Number
  },
  reviewInfo: {
    reviewDate: String,
    reviewTitle: String,
    reviewText: String,
    reviewTripType: String,
    reviewPictures: {picture1: String, picture2: String, picture3: String, picture4: String},
    reviewRatings: Array
  },
  responderInfo: {
    hotelId: Number,
    responderOrg: String,
    responderPicture: String,
    responderClose: String,
    responderDate: String,
    responderName: String,
    responderPosition: String,
    responderText: String
  }
});

let Review = mongoose.model('Review', reviewSchema);

var save = (review) => {
  return new Promise((resolve, reject) => {
    Review.create(review, (err, result) => {
      if (err) {
        reject(err.stack);
      } else {
        resolve(result);
      }
    })
  })
}

var read = (hotelId) => {
  return new Promise((resolve, reject) => {
    Review.find({"responderInfo.hotelId": hotelId}).exec((err, results) => {
      if (err) {
        reject(err.stack);
      } else {
        resolve(results);
      }
    })
  })
}

var update = (updateInfo) => {
  return new Promise((resolve, reject) => {
    Review.findOneAndUpdate({_id: updateInfo.id},
      {$set:{'responderInfo.responderText': updateInfo.newText}},
      {new: true},
      (err, results) => {
      if (err) {
        reject(err.stack);
      } else {
        resolve(results);
      }
    })
  })
}

var remove = (reviewId) => {
  return new Promise((resolve, reject) => {
    Review.findOneAndRemove({_id: reviewId}, (err, results) => {
      if (err) {
        console.error("could not delete");
        reject(err.stack);
      } else {
        console.log("deleted");
        resolve(results);
      }
    })
  })
}

module.exports = { save, read, update, remove };
