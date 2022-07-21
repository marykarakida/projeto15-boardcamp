import dayjs from 'dayjs';

import connection from '../databases/postgres.js';

export async function createRentals(req, res) {
    const { customerId, gameId, daysRented } = req.body;

    try {
        const customer = await connection.query('SELECT * FROM customers WHERE id = $1', [customerId]);

        if (customer.rowCount === 0) {
            return res.sendStatus(400);
        }

        const game = await connection.query('SELECT * FROM games WHERE id = $1', [gameId]);

        if (game.rowCount === 0) {
            return res.sendStatus(400);
        }

        const rentals = await connection.query('SELECT * FROM rentals WHERE "gameId" = $1', [gameId]);

        if (rentals.rowCount === game.rows[0].stockTotal) {
            return res.sendStatus(400);
        }

        const rentDate = dayjs().format('YYYY-MM-DD');
        const returnDate = null;
        const originalPrice = game.rows[0].pricePerDay * daysRented;
        const delayFee = null;

        await connection.query(
            'INSERT INTO rentals ("customerId", "gameId", "rentDate", "daysRented", "returnDate", "originalPrice", "delayFee") VALUES ($1, $2, $3, $4, $5, $6, $7)',
            [customerId, gameId, rentDate, daysRented, returnDate, originalPrice, delayFee]
        );

        res.sendStatus(201);
    } catch (err) {
        res.sendStatus(500);
        console.log(err);
    }
}
