import connection from '../databases/postgres.js';

export async function listCustomers(req, res) {
    const { cpf } = req.query;

    try {
        let customers;

        if (cpf) {
            customers = await connection.query("SELECT * FROM customers WHERE cpf LIKE $1 || '%'", [cpf]);
        } else {
            customers = await connection.query('SELECT * FROM customers');
        }

        res.status(200).send(customers.rows);
    } catch (err) {
        res.sendStatus(500);
        console.log(err);
    }
}

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
