import connection from "../databases/postgres.js";

export async function createCategory(req, res) {
    const name = req.body.name;

    if (!name) return res.sendStatus(400);

    try {
        const category = await connection.query("SELECT * FROM categories WHERE name = $1", [name]);

        if (category.rowCount === 1) {
            return res.sendStatus(409);
        }

        await connection.query("INSERT INTO categories (name) VALUES ($1)", [name]);

        res.sendStatus(201);
    } catch (err) {
        console.log(err);
    }
}
