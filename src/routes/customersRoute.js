import express from 'express';

import { createCustomer } from '../controlleres/customersController.js';
import validateCustomer from '../middlewares/customersValidation.js';

const router = express.Router();

router.post('/', validateCustomer, createCustomer);

export default router;
