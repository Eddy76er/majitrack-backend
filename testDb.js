const db = require('./src/config/db');

db.query('SELECT NOW()')
  .then(res => {
    console.log('Connected! Current time:', res.rows[0]);
    process.exit();
  })
  .catch(err => {
    console.error('Connection failed', err);
    process.exit(1);
  });
