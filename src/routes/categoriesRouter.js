import express from "express";

import { listCategories, createCategory } from "../controlleres/categoriesController.js";

const router = express.Router();

router.get("/", listCategories);
router.post("/", createCategory);

export default router;
