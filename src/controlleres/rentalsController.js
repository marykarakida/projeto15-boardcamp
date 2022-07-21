import dayjs from 'dayjs';

import connection from '../databases/postgres.js';

export async function listRentals(req, res) {
    const { customerId, gameId } = req.query;

    try {
        let filter;
        const query = [];

        if (customerId && gameId) {
            filter = 'WHERE "customerId" = $1 AND "gameId" = $2';
            query.push(customerId, gameId);
        } else if (customerId) {
            filter = 'WHERE "customerId" = $1';
            query.push(customerId);
        } else if (gameId) {
            filter = 'WHERE "gameId" = $1';
            query.push(gameId);
        }

        const rentals = await connection.query(
            `SELECT rentals.*, json_build_object('id', customers.id, 'name', customers.name) AS customer, json_build_object('id', games.id, 'name', games.name, 'categoryName', games.\"categoryId\", 'categoryId', categories.name) AS game FROM rentals
                JOIN customers ON customers.id = \"customerId\"
                JOIN games ON games.id = \"gameId\"
                JOIN categories ON \"categoryId\" = categories.id
                ${filter}
        `,
            query
        );

        res.status(200).send(rentals.rows);
    } catch (err) {
        res.sendStatus(500);
        console.log(err);
    }
}

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

export async function returnRental(req, res) {
    const id = req.params.id;

    try {
        const rental = await connection.query(`SELECT * FROM rentals WHERE id = $1`, [id]);

        if (rental.rowCount === 0) {
            return res.sendStatus(404);
        }

        if (rental.rows[0].returnDate !== null) {
            return res.sendStatus(400);
        }

        const games = await connection.query(`SELECT * FROM games WHERE id = $1`, [rental.rows[0].gameId]);

        const returnDate = dayjs().format('YYYY-MM-DD');
        const daysLate = dayjs().diff(rental.rows[0].rentDate, 'day');
        const delayFee = daysLate > rental.rows[0].daysRented ? daysLate * games.rows[0].pricePerDay : 0;

        await connection.query(
            `UPDATE rentals
            SET "returnDate" = $1, "delayFee" = $2
            WHERE id = $3
        `,
            [returnDate, delayFee, id]
        );

        res.sendStatus(200);
    } catch (err) {
        res.sendStatus(500);
        console.log(err);
    }
}
