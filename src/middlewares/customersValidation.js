import customerSchema from '../models/customer.js';

export default async function validateCustomer(req, res, next) {
    const newCustomer = req.body;

    const joiValidation = customerSchema.validate(newCustomer, { abortEarly: false });

    if (joiValidation.error) {
        console.log(joiValidation.error);
        return res.sendStatus(400);
    }

    next();
}
