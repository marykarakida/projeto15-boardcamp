import connection from '../databases/postgres.js';

export async function listGames(req, res) {
    const { name } = req.query;

    try {
        const games = await connection.query(
            'SELECT games.*, categories.name AS "categoryName" FROM games JOIN categories ON "categoryId" = categories.id WHERE LOWER(games.name) LIKE LOWER($1 || \'%\')',
            [name]
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
