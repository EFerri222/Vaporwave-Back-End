require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const { Pool } = require('pg');
const cors = require('cors');

const app = express();
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/add-song', (req, res) => {
  const { title } = req.body;
  pool.query('INSERT INTO songs (title, artist, is_vaporwave) VALUES ($1, $2, $3)', [title, 'Unknown Artist', true], (error) => {
    if (error) {
      res.status(500).json({ error });
    } else {
      res.status(200).json({ message: 'Song added successfully' });
    }
  });
});

app.get('/songs', (req, res) => {
  pool.query('SELECT title FROM songs', (error, results) => {
    if (error) {
      res.status(500).json({ error });
    } else {
      res.status(200).json({ songs: results.rows });
    }
  });
});

const port = 3001; // Backend server port
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
