import { pool } from '../config/database.js'

const prices = {
  model: { Everyday: 500, Professional: 800, Gaming: 1200 },
  processor: { Standard: 0, Performance: 200 },
  memory: { 8: 0, 16: 80, 32: 180 },
  storage: { 256: 0, 512: 60, 1024: 140 },
  color: { Silver: 0, Black: 0, Blue: 0 }
}

const validateBuild = (body) => {
  const name = body.name

  if (
    typeof name !== 'string' ||
    !name.trim() ||
    name.trim().length > 100
  ) {
    return { error: 'Enter a build name between 1 and 100 characters.' }
  }

  const selections = {
    model: body.model,
    processor: body.processor,
    memory: body.memory,
    storage: body.storage,
    color: body.color
  }

  for (const [feature, value] of Object.entries(selections)) {
    if (
      !['string', 'number'].includes(typeof value) ||
      !Object.hasOwn(prices[feature], value)
    ) {
      return { error: `Choose a valid ${feature} option.` }
    }
  }

  if (body.model === 'Everyday' && Number(body.memory) === 32) {
    return {
      error: 'The Everyday model does not support 32 GB memory.'
    }
  }

  const totalPrice = Object.entries(selections).reduce(
    (total, [feature, value]) => total + prices[feature][value],
    0
  )

  return {
    values: [
      name.trim(),
      body.model,
      body.processor,
      Number(body.memory),
      Number(body.storage),
      body.color,
      totalPrice
    ]
  }
}

const validId = (id) =>
  /^[1-9]\d*$/.test(id) && Number(id) <= 2147483647

const handleError = (res, error) => {
  console.error(error)
  return res.status(500).json({
    error: 'A database error occurred. Please try again.'
  })
}

export const getLaptops = async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM laptops ORDER BY id DESC'
    )

    res.json(result.rows)
  } catch (error) {
    handleError(res, error)
  }
}

export const getLaptop = async (req, res) => {
  if (!validId(req.params.id)) {
    return res.status(400).json({ error: 'Invalid laptop ID.' })
  }

  try {
    const result = await pool.query(
      'SELECT * FROM laptops WHERE id = $1',
      [req.params.id]
    )

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Laptop not found.' })
    }

    res.json(result.rows[0])
  } catch (error) {
    handleError(res, error)
  }
}

export const createLaptop = async (req, res) => {
  const { error, values } = validateBuild(req.body ?? {})

  if (error) {
    return res.status(400).json({ error })
  }

  try {
    const result = await pool.query(
      `INSERT INTO laptops
        (name, model, processor, memory, storage, color, total_price)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      values
    )

    res.status(201).json(result.rows[0])
  } catch (error) {
    handleError(res, error)
  }
}

export const updateLaptop = async (req, res) => {
  if (!validId(req.params.id)) {
    return res.status(400).json({ error: 'Invalid laptop ID.' })
  }

  const { error, values } = validateBuild(req.body ?? {})

  if (error) {
    return res.status(400).json({ error })
  }

  try {
    const result = await pool.query(
      `UPDATE laptops
       SET name = $1,
           model = $2,
           processor = $3,
           memory = $4,
           storage = $5,
           color = $6,
           total_price = $7
       WHERE id = $8
       RETURNING *`,
      [...values, req.params.id]
    )

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Laptop not found.' })
    }

    res.json(result.rows[0])
  } catch (error) {
    handleError(res, error)
  }
}

export const deleteLaptop = async (req, res) => {
  if (!validId(req.params.id)) {
    return res.status(400).json({ error: 'Invalid laptop ID.' })
  }

  try {
    const result = await pool.query(
      'DELETE FROM laptops WHERE id = $1 RETURNING id',
      [req.params.id]
    )

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Laptop not found.' })
    }

    res.json({ message: 'Laptop deleted.' })
  } catch (error) {
    handleError(res, error)
  }
}