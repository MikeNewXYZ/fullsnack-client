// Preliminary functions for the database based on the harry potter api.
const express = require('express');
const { createPool } = require('mysql2');
const cors = require('cors');

const app = express();
app.use(cors());

const db = createPool({
    host:process.env.HOST,
    user:process.env.USER1,
    password:process.env.PASSWORD,
    database:process.env.DATABASE
}).promise();

module.exports = db;

//Getting the list of orders.
app.get('/orders', (req, res) => {
    const query = 'SELECT * FROM orders';
    db.query(query, (err, result) => {
        if (err) throw err;
        res.status(200).json(result);
    });
});

// Updating the order quantity
app.post('/orders', (req, res) => {
    const { snacks_id, quantity } = req.body;
    const query = 'UPDATE orders SET quantity = ? WHERE snack_id = ?';
    db.query(query, [quantity, snack_id], (err, result) => {
        if (err) throw err;
        res.status(200).json({ status: 'success '});
    });
});

app.destroy('/orders/:snack_id')