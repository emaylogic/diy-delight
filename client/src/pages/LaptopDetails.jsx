import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import LaptopAPI from '../services/LaptopAPI'

const LaptopDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [laptop, setLaptop] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    let active = true

    setLoading(true)
    setError('')

    LaptopAPI.getLaptop(id)
      .then((data) => {
        if (active) setLaptop(data)
      })
      .catch((error) => {
        if (active) setError(error.message)
      })
      .finally(() => {
        if (active) setLoading(false)
      })

    return () => {
      active = false
    }
  }, [id])

  const handleDelete = async () => {
    if (!window.confirm(`Delete "${laptop.name}"?`)) return

    setDeleting(true)
    setError('')

    try {
      await LaptopAPI.deleteLaptop(id)
      navigate('/laptops')
    } catch (error) {
      setError(error.message)
      setDeleting(false)
    }
  }

  return (
    <main className="container">
      <Link to="/laptops">← Saved Builds</Link>

      {loading && <p role="status">Loading build...</p>}
      {error && <p role="alert">{error}</p>}

      {!loading && laptop && (
        <article>
          <h1>{laptop.name}</h1>
          <p>Model: {laptop.model}</p>
          <p>Processor: {laptop.processor}</p>
          <p>Memory: {laptop.memory} GB</p>
          <p>
            Storage: {laptop.storage === 1024
              ? '1 TB'
              : `${laptop.storage} GB`}
          </p>
          <p>Color: {laptop.color}</p>

          <h2>
            {Number(laptop.total_price).toLocaleString('en-US', {
              style: 'currency',
              currency: 'USD'
            })}
          </h2>
          <Link to={`/edit/${laptop.id}`} role="button">
            Edit Build
          </Link>
          <button
            type="button"
            onClick={handleDelete}
            disabled={deleting}
          >
            {deleting ? 'Deleting...' : 'Delete Build'}
          </button>
        </article>
      )}
    </main>
  )
}

export default LaptopDetails