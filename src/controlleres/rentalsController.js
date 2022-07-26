import dayjs from 'dayjs';

import connection from '../databases/postgres.js';

export async function listRentals(req, res) {
    const { customerId, gameId, status, startDate, order, desc, limit, offset } = req.query;

    let filter = '';
    const params = [];

    try {
        if (status === 'open' || status === 'closed') {
            filter += `WHERE "returnDate" ${status === 'open' ? 'IS NULL ' : 'IS NOT NULL '}`;
        }

        if (customerId) {
            filter += `${filter === '' ? 'WHERE' : 'AND'} "customerId" = $${params.length + 1} `;
            params.push(customerId);
        }

        if (gameId) {
            filter += `${filter === '' ? 'WHERE' : 'AND'} "gameId" = $${params.length + 1} `;
            params.push(gameId);
        }

        if (startDate) {
            filter += `${filter === '' ? 'WHERE' : 'AND'}  "rentDate" >= $${params.length + 1} `;
            params.push(startDate);
        }

        if (order) {
            filter += `ORDER BY "${order}" ${desc ? 'DESC ' : ''}`;
        }

        if (limit) {
            filter += `LIMIT $${params.length + 1} `;
            params.push(limit);
        }

        if (offset) {
            filter += `OFFSET $${params.length + 1}`;
            params.push(offset);
        }

        const rentals = await connection.query(
            `SELECT rentals.*, json_build_object('id', customers.id, 'name', customers.name) AS customer, json_build_object('id', games.id, 'name', games.name, 'categoryName', games.\"categoryId\", 'categoryId', categories.name) AS game FROM rentals
                JOIN customers ON customers.id = \"customerId\"
                JOIN games ON games.id = \"gameId\"
                JOIN categories ON \"categoryId\" = categories.id
                ${filter}
        `,
            params
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

        const rentals = await connection.query('SELECT * FROM rentals WHERE "gameId" = $1 AND "returnDate" IS NULL', [
            gameId
        ]);

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

export async function deleteRentals(req, res) {
    const id = req.params.id;

    try {
        const rental = await connection.query(`SELECT * FROM rentals WHERE id = $1`, [id]);

        if (rental.rowCount === 0) {
            return res.sendStatus(404);
        }

        if (rental.rows[0].returnDate === null) {
            return res.sendStatus(400);
        }

        await connection.query(`DELETE FROM rentals WHERE id = $1`, [id]);

        res.sendStatus(200);
    } catch (err) {
        res.sendStatus(500);
        console.log(err);
    }
}

export async function showMetrics(req, res) {
    const { startDate, endDate } = req.query;

    let filter = '';
    const params = [];

    if (startDate) {
        filter += `WHERE "rentDate" >= $${params.length + 1} `;
        params.push(startDate);
    }

    if (endDate) {
        filter += `${filter === '' ? 'WHERE' : 'AND'} "rentDate" <= $${params.length + 1}`;
        params.push(endDate);
    }

    try {
        const metrics = await connection.query(
            `SELECT 
                COALESCE(SUM("originalPrice") + SUM("delayFee"), 0)::double precision AS revenue, 
                COUNT(id)::double precision AS rentals, 
                COALESCE((SUM("originalPrice") + SUM("delayFee")) / COUNT(id), 0)::double precision AS average 
            FROM rentals 
            ${filter}`,
            params
        );

        res.status(200).send(metrics.rows[0]);
    } catch (err) {
        res.sendStatus(500);
        console.log(err);
    }
}
