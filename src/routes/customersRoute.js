import express from 'express';

import { listCustomers, createCustomer, fetchUser } from '../controlleres/customersController.js';
import validateCustomer from '../middlewares/customersValidation.js';

const router = express.Router();

router.get('/', listCustomers);
router.post('/', validateCustomer, createCustomer);

router.get('/:id', fetchUser);

export default router;
