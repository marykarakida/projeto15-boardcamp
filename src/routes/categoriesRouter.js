import express from 'express';

import { listCategories, createCategory } from '../controlleres/categoriesController.js';
import validateCategory from '../middlewares/categoriesValidation.js';

const router = express.Router();

router.get('/', listCategories);
router.post('/', validateCategory, createCategory);

export default router;
