import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import LaptopAPI from '../services/LaptopAPI'

const prices = {
  model: { Everyday: 500, Professional: 800, Gaming: 1200 },
  processor: { Standard: 0, Performance: 200 },
  memory: { 8: 0, 16: 80, 32: 180 },
  storage: { 256: 0, 512: 60, 1024: 140 },
  color: { Silver: 0, Black: 0, Blue: 0 }
}

const colors = {
  Silver: '#b8c2cc',
  Black: '#303640',
  Blue: '#3578c8'
}

const CreateLaptop = () => {
  const navigate = useNavigate()

  const { id } = useParams()
  const isEditing = Boolean(id)

  const [build, setBuild] = useState({
    name: '',
    model: 'Everyday',
    processor: 'Standard',
    memory: 8,
    storage: 256,
    color: 'Silver'
  })

  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  const [loading, setLoading] = useState(isEditing)
  const [loadError, setLoadError] = useState('')

  useEffect(() => {
    let active = true

    setError('')
    setLoadError('')

    if (!id) {
      setBuild({
        name: '',
        model: 'Everyday',
        processor: 'Standard',
        memory: 8,
        storage: 256,
        color: 'Silver'
      })
      setLoading(false)

      return () => {
        active = false
      }
    }

    setLoading(true)

    LaptopAPI.getLaptop(id)
      .then((laptop) => {
        if (active) {
          setBuild({
            name: laptop.name,
            model: laptop.model,
            processor: laptop.processor,
            memory: Number(laptop.memory),
            storage: Number(laptop.storage),
            color: laptop.color
          })
        }
      })
      .catch((error) => {
        if (active) setLoadError(error.message)
      })
      .finally(() => {
        if (active) setLoading(false)
      })

    return () => {
      active = false
    }
  }, [id])

  const total = Object.keys(prices).reduce(
    (sum, feature) => sum + prices[feature][build[feature]],
    0
  )

  const handleChange = (event) => {
    const { name, value } = event.target

    setBuild((previous) => ({
      ...previous,
      [name]: ['memory', 'storage'].includes(name)
        ? Number(value)
        : value
    }))

    setError('')
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (!build.name.trim()) {
      setError('Please enter a build name.')
      return
    }

    if (build.model === 'Everyday' && build.memory === 32) {
      setError('The Everyday model does not support 32 GB memory.')
      return
    }

    setSaving(true)
    setError('')

    try {

      if (isEditing) {
        await LaptopAPI.updateLaptop(id, build)
      } else {
        await LaptopAPI.createLaptop(build)
      }

      navigate('/laptops')
    } catch (error) {
      setError(error.message)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <main className="container">
        <p role="status">Loading build...</p>
      </main>
    )
  }

  if (loadError) {
    return (
      <main className="container">
        <p role="alert">{loadError}</p>
      </main>
    )
  }

  return (
    <main className="container">
      <h1>{isEditing ? 'Edit Your Laptop' : 'Customize Your Laptop'}</h1>
      <p>Choose your specifications and save your perfect build.</p>

      <div className="builder-layout">
        <form onSubmit={handleSubmit}>
          <label htmlFor="build-name">Build Name</label>
          <input
            id="build-name"
            name="name"
            value={build.name}
            onChange={handleChange}
            placeholder="My Work Laptop"
            maxLength={100}
            required
          />

          {Object.entries(prices).map(([feature, options]) => (
            <label key={feature} htmlFor={feature}>
              {feature.charAt(0).toUpperCase() + feature.slice(1)}

              <select
                id={feature}
                name={feature}
                value={build[feature]}
                onChange={handleChange}
              >
                {Object.entries(options).map(([option, price]) => {
                  let label = option

                  if (feature === 'memory') {
                    label = `${option} GB`
                  }

                  if (feature === 'storage') {
                    label = option === '1024' ? '1 TB' : `${option} GB`
                  }

                  return (
                    <option
                      key={option}
                      value={option}
                      disabled={
                        (feature === 'memory' &&
                          option === '32' &&
                          build.model === 'Everyday') ||
                        (feature === 'model' &&
                          option === 'Everyday' &&
                          build.memory === 32)
                      }
                    >
                      {label} — {price === 0 ? 'Included' : `$${price}`}
                    </option>
                  )
                })}
              </select>
            </label>
          ))}

          <p className="compatibility-note" role="status">
            {build.model === 'Everyday'
              ? 'Everyday supports 8 GB or 16 GB memory. Choose Professional or Gaming for 32 GB.'
              : build.memory === 32
                ? '32 GB memory requires the Professional or Gaming model.'
                : 'Your selected options are compatible.'}
          </p>

          {error && <p className="build-error" role="alert">{error}</p>}

          <button type="submit" disabled={saving}>
            {saving ? 'Saving...' : isEditing ? 'Save Changes' : 'Save Build'}
          </button>
        </form>

        <article className="build-preview">
          <h2>{build.name.trim() || 'Your Laptop'}</h2>

          <div
            className="laptop-preview"
            style={{ '--laptop-color': colors[build.color] }}
            role="img"
            aria-label={`${build.color} ${build.model} laptop`}
          >
            <div className="laptop-screen">
              <span>💻</span>
              <strong>{build.model}</strong>
              <small>{build.processor} Processor</small>
              <small>{build.memory} GB RAM</small>
              <small>
                {build.storage === 1024
                  ? '1 TB'
                  : `${build.storage} GB`} SSD
              </small>
            </div>
            <div className="laptop-base" />
          </div>

          <p>{build.color} finish</p>

          <h3 aria-live="polite">
            Total: {total.toLocaleString('en-US', {
              style: 'currency',
              currency: 'USD'
            })}
          </h3>

          <small className="preview-note">
            Everyday models support up to 16 GB of memory.
          </small>
        </article>
      </div>
    </main>
  )
}

export default CreateLaptop