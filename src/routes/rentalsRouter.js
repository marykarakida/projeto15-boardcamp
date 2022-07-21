import express from 'express';

import { listRentals, createRentals, returnRental } from '../controlleres/rentalsController.js';
import validateRental from '../middlewares/rentalsValidation.js';

const router = express.Router();

router.get('/', listRentals);
router.post('/', validateRental, createRentals);

router.post('/:id/return', returnRental);

export default router;
