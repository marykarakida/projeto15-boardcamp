import connection from '../databases/postgres.js';
import categorySchema from '../models/categories.js';

export default async function validateCategory(req, res, next) {
    const newCategory = req.body;

    const joiValidation = categorySchema.validate(newCategory, { abortEarly: false });

    if (joiValidation.error) {
        return res.sendStatus(400);
    }

    try {
        const categories = await connection.query('SELECT * FROM categories WHERE name = $1', [newCategory.name]);

        if (categories.rowCount === 1) {
            return res.sendStatus(409);
        }

        next();
    } catch (err) {
        res.sendStatus(500);
        console.log(err);
    }
}
