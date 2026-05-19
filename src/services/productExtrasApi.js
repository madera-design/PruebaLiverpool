const EXTRAS_API_URL = 'http://localhost:3001/productExtras'

export async function fetchProductExtra(name) {
  try {
    const response = await fetch(`${EXTRAS_API_URL}/${name}`)

    if (response.status === 404) {
      return null
    }

    if (!response.ok) {
      throw new Error('Extras unavailable')
    }

    return response.json()
  } catch {
    return null
  }
}
