import connection from '../databases/postgres.js';

export async function createGame(req, res) {
    const { name, image, stockTotal, categoryId, pricePerDay } = req.body;

    try {
        const games = await connection.query('SELECT * FROM games WHERE name = $1', [name]);

        if (games.rowCount === 1) {
            return res.sendStatus(409);
        }

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
