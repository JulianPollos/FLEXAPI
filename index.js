const express = require('express');
const mysql = require('mysql2');
const bcrypt = require('bcrypt'); 

const app = express();
const port = 3000;

const db = mysql.createConnection({
    host: 'localhost',
    user: 'myuser',
    password: 'mypassword',
    database: 'mydatabase'
});

db.connect(err => {
    if (err) {
        console.error('Database connection failed: ' + err.stack);
        return;
    }
    console.log('Connected to MySQL database');
});

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.get('/game', (req, res) => {
    db.query('SELECT * FROM videogames ORDER BY RAND() LIMIT 1;', (err, results) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(results);
    });
});

app.get('/game/:id', (req, res) => {
    const gameId = req.params.id;
    db.query('SELECT * FROM videogames WHERE id = ?', gameId, (err, results) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(results); 
    });
});

app.post('/postgame/:naam', async (req, res) => {
    try {
        const naam = req.params.naam;
        
        const hashedNaam = await bcrypt.hash(naam, 10);

        db.query('INSERT INTO videogames (naam) VALUES (?);', [hashedNaam], (err, results) => {
            if (err) {
                res.status(500).json({ error: err.message });
                return;
            }
            res.json({ message: "Game stored with hashed naam!", results });
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.delete('/deletegame/:id', (req, res) => {
    const gameId = req.params.id;
    db.query('DELETE FROM videogames WHERE id = ?;', gameId,  (err, results) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(results);
    });
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});
