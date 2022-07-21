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

export async function fetchUser(req, res) {
    const customerId = req.params.id;

    try {
        const customer = await connection.query('SELECT * FROM customers WHERE id = $1', [customerId]);

        if (customer.rowCount === 0) {
            return res.sendStatus(404);
        }

        res.status(200).send(customer.rows);
    } catch (err) {
        res.sendStatus(500);
        console.log(err);
    }
}
