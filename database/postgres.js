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

    var createTableQuery = "CREATE TABLE IF NOT EXISTS test_table(test_id serial PRIMARY KEY, name TEXT, email VARCHAR(50))";

    pool.query(createTableQuery, (err, res) => {
      if (err) console.error(err);
      console.log(res);
    })

    const query = {
      text: 'INSERT INTO test_table(name, email) VALUES($1, $2)',
      values: ['aziz', 'emailtest@gmail.com'],
    }

    pool.query(query, (err, res) => {
      if (err) {
        console.log(err.stack)
      } else {
        console.log(res.rows[0])
      }
    })

    pool
      .query(query)
      .then(res=> console.log(res.rows[0]))
      .catch(e => console.error(e.stack))

    const res = await pool.query('SELECT $1::text as message', ['Hello world!']);
    console.log(res.rows[0].message);
    await pool.end();

  } catch(e) {
    console.error(e.stack);
  }
})();
