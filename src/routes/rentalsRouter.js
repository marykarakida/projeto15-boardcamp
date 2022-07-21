import express from 'express';

import { createRentals } from '../controlleres/rentalsController.js';
import validateRental from '../middlewares/rentalsValidation.js';

const router = express.Router();

router.post('/', validateRental, createRentals);

export default router;
