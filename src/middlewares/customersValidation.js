import connection from '../databases/postgres.js';
import customerSchema from '../models/customer.js';

export default async function validateCustomer(req, res, next) {
    const newCustomer = req.body;

    const joiValidation = customerSchema.validate(newCustomer, { abortEarly: false });

    if (joiValidation.error) {
        console.log(joiValidation.error);
        return res.sendStatus(400);
    }

    try {
        const customers = await connection.query('SELECT * FROM customers WHERE cpf = $1', [newCustomer.cpf]);

        if (customers.rowCount === 1) {
            return res.sendStatus(400);
        }

        next();
    } catch (err) {
        res.sendStatus(500);
        console.log(err);
    }
}
