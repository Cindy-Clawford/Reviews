const express = require('express');
let app = express();
const port = 4003;
const db = require('../database/index.js');

app.use(express.static(__dirname + '/../client/dist'));
app.use(express.urlencoded({extended: true}));
app.use(express.json());


app.listen(port, function() {
  console.log(`listening on port: ${port}`);
});

app.get('/hotel/:hotel', (req, res) => {
  let hotel = req.params.hotel === 'global'? 'hotel0': req.params.hotel;
  let id = hotel.slice(5);
  console.log(`in hotel ${id}`);
  db.getHotelReviews(id)
    .then(result => {
      res.send(result);
    })
    .catch((err) => {
      console.log(err);
    });
});

app.get('/:id', (req, res) => {
  const fileName = 'index.html';
  const options = {
    root: __dirname + '/../client/dist'
  }
  res.sendFile(fileName, options, function(err){
    if(err) {
      console.log('error', err);
    } else {
      console.log('file sent', fileName);
    }
  });
});


app.post('/hotel/:hotel', (req, res) => {
  let reviewInfo = req.body;
  db.save(reviewInfo)
  .then(result => {
    res.send(result);
  })
  .catch((err) => {
    console.log(err);
  });
})

app.put('/hotel/:reviewId', (req, res) => {
  let updateInfo = {};
  updateInfo.id = req.params.reviewId;
  updateInfo.newText = req.body.text;
  db.update(updateInfo)
  .then(result => {
    res.send(result);
  })
  .catch((err) => {
    console.log(err);
  });
});

app.delete('/hotel/:reviewId', (req, res) => {
  db.deleteRev(req.params.reviewId)
  .then(result => {
    res.send(result);
  })
  .catch((err) => {
    console.log(err);
  });
})
