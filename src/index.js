import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import categoriesRouter from './routes/categoriesRouter.js';
import gamesRouter from './routes/gamesRouter.js';
import customerRouter from './routes/customersRoute.js';

const app = express();

dotenv.config();
app.use(cors());
app.use(express.json());

app.use('/categories', categoriesRouter);
app.use('/games', gamesRouter);
app.use('/customers', customerRouter);

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
    console.log('Server running on port', PORT);
});
