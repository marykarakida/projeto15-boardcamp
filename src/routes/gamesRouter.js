import express from 'express';

import { listGames, createGame } from '../controlleres/gamesController.js';
import validateGame from '../middlewares/gamesValidation.js';

const router = express.Router();

router.get('/', listGames);
router.post('/', validateGame, createGame);

export default router;
