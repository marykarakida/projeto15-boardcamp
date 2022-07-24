import connection from '../databases/postgres.js';

export async function listCustomers(req, res) {
    const { cpf, order, desc, limit, offset } = req.query;

    let filter = '';
    const params = [];

    if (cpf) {
        filter += `WHERE cpf LIKE $${params.length + 1} `;
        params.push(`${cpf}%`);
    }

    if (order) {
        filter += `ORDER BY "${order}" ${desc ? 'DESC' : ''}`;
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
        const customers = await connection.query(
            `SELECT 
                customers.*,
                birthday::VARCHAR,
                COUNT(rentals.id)::double precision AS "rentalsCount"
            FROM customers
            LEFT JOIN rentals ON customers.id = "customerId" 
            GROUP BY customers.id
            ${filter}`,
            params
        );

        res.status(200).send(customers.rows);
    } catch (err) {
        res.sendStatus(500);
        console.log(err);
    }
}

export async function createCustomer(req, res) {
    const { name, phone, cpf, birthday } = req.body;

    try {
        const customers = await connection.query('SELECT * FROM customers WHERE cpf = $1', [cpf]);

        if (customers.rowCount === 1) {
            return res.sendStatus(400);
        }

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

export async function fetchCustomer(req, res) {
    const customerId = req.params.id;

    try {
        const customer = await connection.query('SELECT *, birthday::VARCHAR FROM customers WHERE id = $1', [
            customerId
        ]);

        if (customer.rowCount === 0) {
            return res.sendStatus(404);
        }

        res.status(200).send(customer.rows[0]);
    } catch (err) {
        res.sendStatus(500);
        console.log(err);
    }
}

export async function updateCustomer(req, res) {
    const { name, phone, cpf, birthday } = req.body;
    const customerId = req.params.id;

    try {
        const customers = await connection.query('SELECT * FROM customers WHERE cpf = $1 AND id <> $2', [
            cpf,
            customerId
        ]);

        if (customers.rowCount === 1) {
            return res.sendStatus(409);
        }

        await connection.query('UPDATE customers SET name = $1, phone = $2, cpf = $3, birthday = $4 WHERE id = $5', [
            name,
            phone,
            cpf,
            birthday,
            customerId
        ]);

        res.sendStatus(201);
    } catch (err) {
        res.sendStatus(500);
        console.log(err);
    }
}
