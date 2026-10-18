import pg from 'pg'
import dotenv from 'dotenv'

import { fileURLToPath } from 'node:url'

dotenv.config({
  path: fileURLToPath(new URL('../.env', import.meta.url))
})

if (!process.env.PGHOST) {
  throw new Error('PGHOST is missing. Check server/.env.')
}

console.log('Database host:', process.env.PGHOST)

const config = {
    user: process.env.PGUSER,
    password: process.env.PGPASSWORD,
    host: process.env.PGHOST,
    port: process.env.PGPORT,
    database: process.env.PGDATABASE,
    ssl: {
      rejectUnauthorized: false
    }
}

export const pool = new pg.Pool(config)