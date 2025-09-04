// Create PostgreSQL Connection Pool here !
import * as pg from "pg";
const { Pool } = pg.default;

const connectionPool = new Pool({
  connectionString:
    "postgresql://postgres:changriri@localhost:5432/Quora Mock PostgreSQL",
});

export default connectionPool;
