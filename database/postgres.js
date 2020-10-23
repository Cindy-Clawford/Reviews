const path = require('path');

const { Pool } = require('pg');
const pool = new Pool({
  user: 'azizbouland',
  // host: '',
  // password: '',
  // port: '',
  database: 'reviews'
});

;(async () => {
  try {
    await pool.connect();

    var createTableQuery = "CREATE TABLE IF NOT EXISTS \
    hotels(\
      document_id INTEGER,\
      hotelId INTEGER,\
      responderOrg TEXT,\
      responderPicture TEXT,\
      responderClose TEXT,\
      responderDate VARCHAR(11),\
      responderName TEXT,\
      responderText TEXT,\
      memberId INTEGER,\
      responderPosition TEXT,\
      memberImg TEXT,\
      memberUserName TEXT,\
      memberLocation TEXT,\
      memberContributions INTEGER,\
      memberHelpful INTEGER,\
      reviewDate VARCHAR(11),\
      reviewTitle TEXT,\
      reviewText TEXT,\
      reviewTripType TEXT,\
      reviewPictures TEXT,\
      reviewRatings INTEGER\
      )";

      await pool.query(createTableQuery, (err, res) => {
      if (err) console.error(err);
      console.log(res);
    })

      var filePath = path.join(__dirname, '/data.txt');

      const copyQuery = `COPY hotels(id,hotelId,responderOrg,responderPicture,responderClose,responderDate,responderName,\
        responderPosition,responderText,memberId,memberImg,memberUserName,memberLocation,memberContributions,memberHelpful,\
        reviewDate,reviewTitle,reviewText,reviewTripType,reviewPictures,reviewRatings) \
      FROM '${filePath}' \
      DELIMITER '|' \
      CSV HEADER`

    await pool.query(copyQuery, (err, res, release) => {
      release();
      if (err) {
        return console.error('error copying data to Database: ', err);
      }
      console.log(res);
    })

    await pool.end();

  } catch(e) {
    console.error(e.stack);
  }
})();
