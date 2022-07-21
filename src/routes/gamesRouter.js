import express from 'express';

import { listGames, createGame } from '../controlleres/gamesController.js';

const router = express.Router();

router.get('/', listGames);
router.post('/', createGame);

export default router;
