import { pool } from './database.js'

const setupDatabase = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS laptops (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        model VARCHAR(30) NOT NULL,
        processor VARCHAR(30) NOT NULL,
        memory INTEGER NOT NULL CHECK (memory IN (8, 16, 32)),
        storage INTEGER NOT NULL CHECK (storage IN (256, 512, 1024)),
        color VARCHAR(20) NOT NULL,
        total_price NUMERIC(10, 2) NOT NULL CHECK (total_price >= 0),
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        CHECK (model IN ('Everyday', 'Professional', 'Gaming')),
        CHECK (processor IN ('Standard', 'Performance')),
        CHECK (color IN ('Silver', 'Black', 'Blue')),
        CHECK (NOT (model = 'Everyday' AND memory = 32))
      )
    `)

    console.log('Laptops table ready.')

    const { rows } = await pool.query(
      'SELECT COUNT(*)::INTEGER AS count FROM laptops'
    )

    if (rows[0].count === 0) {
      await pool.query(`
        INSERT INTO laptops
          (name, model, processor, memory, storage, color, total_price)
        VALUES
          ('Daily Companion', 'Everyday', 'Standard',
           8, 256, 'Silver', 500),
          ('Developer Pro', 'Professional', 'Performance',
           16, 512, 'Black', 1140),
          ('Gaming Beast', 'Gaming', 'Performance',
           32, 1024, 'Blue', 1720)
      `)

      console.log('Three sample laptop builds added.')
    } else {
      console.log('Existing laptop builds preserved.')
    }

    console.log('BuildALaptop database setup complete.')
  } catch (error) {
    console.error('Database setup failed:', error.message)
    process.exitCode = 1
  } finally {
    await pool.end()
  }
}

setupDatabase()