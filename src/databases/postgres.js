import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

const { Pool } = pg;
const connectionString = process.env.DATABASE_URL;

const connection = new Pool({
    connectionString
});

export default connection;
