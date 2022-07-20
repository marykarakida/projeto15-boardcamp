import express from "express";

import { createCategory } from "../controlleres/categoriesController.js";

const router = express.Router();

router.post("/", createCategory);

export default router;
