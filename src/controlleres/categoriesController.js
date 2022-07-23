import connection from '../databases/postgres.js';

export async function listCategories(req, res) {
    const { order, desc, limit, offset } = req.query;

    let filter = '';
    const params = [];

    if (order) filter += `ORDER BY ${order} `;

    if (order && desc) filter += `DESC `;

    if (limit) {
        filter += `LIMIT $${params.length + 1} `;
        params.push(limit);
    }

    if (offset) {
        filter += `OFFSET $${params.length + 1}`;
        params.push(offset);
    }

    try {
        const { rows: categories } = await connection.query(`SELECT * FROM categories ${filter}`, params);

        res.status(200).send(categories);
    } catch (err) {
        res.sendStatus(500);
        console.log(err);
    }
}

export async function createCategory(req, res) {
    const name = req.body.name;

    try {
        await connection.query('INSERT INTO categories (name) VALUES ($1)', [name]);

        res.sendStatus(201);
    } catch (err) {
        res.sendStatus(500);
        console.log(err);
    }
}
