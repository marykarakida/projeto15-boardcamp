import rentalSchema from '../models/rentals.js';

export default function validateRental(req, res, next) {
    const newRental = req.body;

    const joiValidation = rentalSchema.validate(newRental, { abortEarly: false });

    if (joiValidation.error) {
        return res.sendStatus(400);
    }

    next();
}
