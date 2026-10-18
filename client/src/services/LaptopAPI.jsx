const BASE_URL = '/api/laptops'

const request = async (url, options = {}) => {
  const response = await fetch(url, options)
  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.error || 'The request failed.')
  }

  return data
}

const getLaptops = () => request(BASE_URL)

const getLaptop = (id) => request(`${BASE_URL}/${id}`)

const createLaptop = (laptop) =>
  request(BASE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(laptop)
  })

const updateLaptop = (id, laptop) =>
  request(`${BASE_URL}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(laptop)
  })

const deleteLaptop = (id) =>
  request(`${BASE_URL}/${id}`, {
    method: 'DELETE'
  })

export default {
  getLaptops,
  getLaptop,
  createLaptop,
  updateLaptop,
  deleteLaptop
}