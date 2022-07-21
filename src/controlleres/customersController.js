import connection from '../databases/postgres.js';

export async function createCustomer(req, res) {
    const { name, phone, cpf, birthday } = req.body;

    try {
        await connection.query('INSERT INTO customers (name, phone, cpf, birthday) VALUES ($1, $2, $3, $4)', [
            name,
            phone,
            cpf,
            birthday
        ]);

        res.sendStatus(201);
    } catch (err) {
        res.sendStatus(500);
        console.log(err);
    }
}
