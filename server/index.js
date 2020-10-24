// change line to select db
const database = 'cassandra';
// const database = 'mongo';


const express = require('express');
let app = express();
const port = 4003;
const db = require(`../database/${database}.js`);

app.use(express.static(__dirname + '/../client/dist'));
app.use(express.urlencoded({extended: true}));
app.use(express.json());


app.listen(port, function() {
  console.log(`listening on port: ${port}`);
});

// returns a list of a hotels reviews
app.get('/hotel/:hotel', (req, res) => {
  let id = req.params.hotel === 'root'? '0': req.params.hotel;
  console.log(`in hotel ${id}`);
  db.read(id)
    .then(result => {
      res.send(result);
    })
    .catch((err) => {
      console.error(`ERROR getting a hotel's reviews: ${err}`);
      res.end();
    });
});

app.get('/:id', (req, res) => {

  const fileName = 'index.html';
  const options = {
    root: __dirname + '/../client/dist'
  }
  res.sendFile(fileName, options, function(err){
    if(err) {
      console.error('error ', err);
      res.end();

    } else {
      console.log('file sent', fileName);
    }
  });
});

app.post('/hotel/:hotel', (req, res) => {
  let reviewInfo = req.body;
  let hotelId = req.params.hotel;
  db.save(reviewInfo, hotelId)
  .then(result => {
    res.send(result);
  })
  .catch((err) => {
    console.error(`ERROR posting a review: ${err}`);
    res.end();
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
    console.error(`ERROR updating a review: ${err}`);
  });
});

app.delete('/hotel/:reviewId', (req, res) => {
  db.remove(req.params.reviewId)
  .then(result => {
    res.send(result);
  })
  .catch((err) => {
    console.error(`ERROR deleting a review: ${err}`);
    res.end();
  });
})
