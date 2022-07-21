import connection from '../databases/postgres.js';
import gameSchema from '../models/games.js';

export default async function validateGame(req, res, next) {
    const newGame = req.body;

    const joiValidation = gameSchema.validate(newGame, { abortEarly: false });

    if (joiValidation.error) {
        return res.sendStatus(400);
    }

    try {
        const categories = await connection.query('SELECT * FROM categories WHERE id = $1', [newGame.categoryId]);

        if (categories.rowCount === 0) {
            return res.sendStatus(400);
        }

        const games = await connection.query('SELECT * FROM games WHERE name = $1', [newGame.name]);

        if (games.rowCount === 1) {
            return res.sendStatus(409);
        }

        next();
    } catch (err) {
        res.sendStatus(500);
        console.log(err);
    }
}
