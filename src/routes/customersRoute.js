import express from 'express';

import { listCustomers, createCustomer, fetchCustomer, updateCustomer } from '../controlleres/customersController.js';
import validateCustomer from '../middlewares/customersValidation.js';

const router = express.Router();

router.get('/', listCustomers);
router.post('/', validateCustomer, createCustomer);

router.get('/:id', fetchCustomer);
router.put('/:id', validateCustomer, updateCustomer);

export default router;
