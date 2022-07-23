import connection from '../databases/postgres.js';

export async function listGames(req, res) {
    const { name, order, desc, limit, offset } = req.query;

    let filter = '';
    const params = [];

    if (name) {
        filter += `WHERE LOWER(games.name) LIKE LOWER($${params.length + 1}) `;
        params.push(`${name}%`);
    }

    if (order) {
        filter += `ORDER BY ${order} ${desc ? 'DESC' : ''}`;
    }

    if (limit) {
        filter += `LIMIT $${params.length + 1} `;
        params.push(limit);
    }

    if (offset) {
        filter += `OFFSET $${params.length + 1}`;
        params.push(offset);
    }

    try {
        const games = await connection.query(
            `SELECT 
                games.*, 
                categories.name AS "categoryName" 
            FROM games 
            JOIN categories ON 
                "categoryId" = categories.id 
            ${filter}`,
            params
        );

        res.status(200).send(games.rows);
    } catch (err) {
        res.sendStatus(500);
        console.log(err);
    }
}

export async function createGame(req, res) {
    const { name, image, stockTotal, categoryId, pricePerDay } = req.body;

    try {
        await connection.query(
            'INSERT INTO games (name, image, "stockTotal", "categoryId", "pricePerDay") VALUES ($1, $2, $3, $4, $5)',
            [name, image, stockTotal, categoryId, pricePerDay]
        );

        res.sendStatus(201);
    } catch (err) {
        res.sendStatus(500);
        console.log(err);
    }
}
