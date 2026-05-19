import { fetchProductExtra } from './productExtrasApi.js'

const API_BASE_URL = 'https://pokeapi.co/api/v2'

function formatPokemonName(name) {
  return name
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ')
}

function formatCurrency(value) {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
    maximumFractionDigits: 0,
  }).format(value)
}

function getPokemonImage(pokemon) {
  return (
    pokemon.sprites.other?.['official-artwork']?.front_default ||
    pokemon.sprites.other?.home?.front_default ||
    pokemon.sprites.front_default
  )
}

function getPokemonImages(pokemon) {
  const imageCandidates = [
    {
      label: 'Arte oficial',
      src: pokemon.sprites.other?.['official-artwork']?.front_default,
    },
    {
      label: 'Home',
      src: pokemon.sprites.other?.home?.front_default,
    },
    {
      label: 'Frente',
      src: pokemon.sprites.front_default,
    },
    {
      label: 'Espalda',
      src: pokemon.sprites.back_default,
    },
    {
      label: 'Frente shiny',
      src: pokemon.sprites.front_shiny,
    },
    {
      label: 'Espalda shiny',
      src: pokemon.sprites.back_shiny,
    },
  ]

  const uniqueImages = []
  const usedSources = new Set()

  imageCandidates.forEach((image) => {
    if (image.src && !usedSources.has(image.src)) {
      usedSources.add(image.src)
      uniqueImages.push(image)
    }
  })

  return uniqueImages.slice(0, 6)
}

function getPokemonPrice(pokemon) {
  const baseValue = pokemon.base_experience || pokemon.weight || pokemon.id
  return Math.max(99, baseValue * 9 + pokemon.height * 13)
}

function formatApiName(name) {
  return name.replaceAll('-', ' ')
}

function getFlavorText(species) {
  const spanishEntry = species.flavor_text_entries.find(
    (entry) => entry.language.name === 'es',
  )
  const englishEntry = species.flavor_text_entries.find(
    (entry) => entry.language.name === 'en',
  )
  const entry = spanishEntry || englishEntry

  return entry?.flavor_text.replace(/\s+/g, ' ') || null
}

async function requestJson(url) {
  const response = await fetch(url)

  if (!response.ok) {
    throw new Error('No pudimos consultar PokeAPI. Intenta nuevamente.')
  }

  return response.json()
}

async function fetchPokemonSpecies(pokemon) {
  try {
    const species = await requestJson(pokemon.species.url)
    const genus =
      species.genera.find((entry) => entry.language.name === 'es') ||
      species.genera.find((entry) => entry.language.name === 'en')

    return {
      captureRate: species.capture_rate,
      description: getFlavorText(species),
      genus: genus?.genus || null,
      growthRate: species.growth_rate?.name || null,
      habitat: species.habitat?.name || null,
    }
  } catch {
    return null
  }
}

async function mapPokemonToProduct(pokemon, { includeSpecies = false } = {}) {
  const price = getPokemonPrice(pokemon)
  const extra = await fetchProductExtra(pokemon.name)
  const species = includeSpecies ? await fetchPokemonSpecies(pokemon) : null

  return {
    id: pokemon.id,
    name: pokemon.name,
    title: formatPokemonName(pokemon.name),
    image: getPokemonImage(pokemon),
    images: getPokemonImages(pokemon),
    price,
    formattedPrice: formatCurrency(price),
    height: pokemon.height,
    weight: pokemon.weight,
    baseExperience: pokemon.base_experience,
    order: pokemon.order,
    types: pokemon.types.map(({ type }) => type.name),
    abilities: pokemon.abilities.map(({ ability }) => ability.name),
    moves: pokemon.moves.slice(0, 12).map(({ move }) => formatApiName(move.name)),
    stats: pokemon.stats.map(({ base_stat, stat }) => ({
      label: formatApiName(stat.name),
      value: base_stat,
    })),
    species,
    extra,
  }
}

async function requestPokemon(urlOrName) {
  const url = urlOrName.startsWith('http')
    ? urlOrName
    : `${API_BASE_URL}/pokemon/${urlOrName.toLowerCase().trim()}`

  const response = await fetch(url)

  if (response.status === 404) {
    throw new Error('No encontramos un producto con ese nombre.')
  }

  if (!response.ok) {
    throw new Error('No pudimos consultar PokeAPI. Intenta nuevamente.')
  }

  return response.json()
}

export async function fetchProductsPage(limit = 20, offset = 0) {
  const response = await fetch(`${API_BASE_URL}/pokemon?limit=${limit}&offset=${offset}`)

  if (!response.ok) {
    throw new Error('No pudimos cargar el catalogo inicial.')
  }

  const data = await response.json()
  const pokemonDetails = await Promise.all(
    data.results.map((pokemon) => requestPokemon(pokemon.url)),
  )

  return {
    hasMore: Boolean(data.next),
    products: await Promise.all(pokemonDetails.map(mapPokemonToProduct)),
  }
}

export async function fetchDefaultProducts(limit = 20, offset = 0) {
  const data = await fetchProductsPage(limit, offset)

  return data.products
}

export async function fetchProductByName(name) {
  const pokemon = await requestPokemon(name)

  return mapPokemonToProduct(pokemon, { includeSpecies: true })
}
