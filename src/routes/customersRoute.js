import express from 'express';

import { listCustomers, createCustomer } from '../controlleres/customersController.js';
import validateCustomer from '../middlewares/customersValidation.js';

const router = express.Router();

router.get('/', listCustomers);
router.post('/', validateCustomer, createCustomer);

export default router;
