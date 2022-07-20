import express from 'express';

import { createGame } from '../controlleres/gamesController.js';

const router = express.Router();

router.post('/', createGame);

export default router;
