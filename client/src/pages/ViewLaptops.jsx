import React, { useEffect, useState } from 'react'
import LaptopAPI from '../services/LaptopAPI'
import { Link } from 'react-router-dom'

const ViewLaptops = () => {
  const [laptops, setLaptops] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [deletingId, setDeletingId] = useState(null)

  useEffect(() => {
    let active = true

    const loadLaptops = async () => {
      try {
        const data = await LaptopAPI.getLaptops()

        if (active) {
          setLaptops(data)
        }
      } catch (error) {
        if (active) {
          setError(error.message)
        }
      } finally {
        if (active) {
          setLoading(false)
        }
      }
    }

    loadLaptops()

    return () => {
      active = false
    }
  }, [])

    const handleDelete = async (laptop) => {
    if (!window.confirm(`Delete "${laptop.name}"?`)) return

    setDeletingId(laptop.id)
    setError('')

    try {
      await LaptopAPI.deleteLaptop(laptop.id)

      setLaptops((previous) =>
        previous.filter((item) => item.id !== laptop.id)
      )
    } catch (error) {
      setError(error.message)
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <main className="container">
      <h1>Saved Laptop Builds</h1>
      <p>Your custom laptops, all in one place.</p>

      {loading && <p role="status">Loading builds...</p>}
      {error && <p role="alert">{error}</p>}

      {!loading && !error && laptops.length === 0 && (
        <p>No builds yet. Create your first laptop!</p>
      )}

      <div className="laptop-grid">
        {laptops.map((laptop) => (
          <article key={laptop.id}>
            <h2>{laptop.name}</h2>
            <p>{laptop.model} Laptop</p>

            <ul>
              <li>Processor: {laptop.processor}</li>
              <li>Memory: {laptop.memory} GB</li>
              <li>
                Storage: {laptop.storage === 1024
                  ? '1 TB'
                  : `${laptop.storage} GB`}
              </li>
              <li>Color: {laptop.color}</li>
            </ul>

            <strong>
              {Number(laptop.total_price).toLocaleString('en-US', {
                style: 'currency',
                currency: 'USD'
              })}
                        </strong>

            <div className="build-actions">
              <Link to={`/laptops/${laptop.id}`} role="button">
                Details
              </Link>

              <button
                type="button"
                className="secondary"
                onClick={() => handleDelete(laptop)}
                disabled={deletingId !== null}
              >
                {deletingId === laptop.id ? 'Deleting...' : 'Delete'}
              </button>
              <Link to={`/edit/${laptop.id}`} role="button">
                Edit
              </Link>
            </div>
          </article>
        ))}
      </div>
    </main>
  )
}

export default ViewLaptops