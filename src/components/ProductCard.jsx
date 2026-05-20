import { Link } from 'react-router-dom'

function getPokemonTypeName(type) {
  return typeof type === 'string' ? type : type.name
}

function getPokemonTypeIcon(type) {
  return typeof type === 'string' ? null : type.icon
}

function getPokemonTypeClassName(type) {
  return `pokemon-type pokemon-type--${getPokemonTypeName(type).toLowerCase()}`
}

function getPokemonGeneration(id) {
  const generations = [
    [151, 1],
    [251, 2],
    [386, 3],
    [493, 4],
    [649, 5],
    [721, 6],
    [809, 7],
    [905, 8],
    [1025, 9],
  ]
  const generation = generations.find(([maxId]) => id <= maxId)?.[1]

  return generation ? `Generación ${generation}` : 'Generación especial'
}

function ProductCard({ product }) {
  const pokemonNumber = `#${String(product.id).padStart(3, '0')}`
  const pokemonGeneration = getPokemonGeneration(product.id)
  const types = product.types || []

  return (
    <Link className="product-card" to={`/products/${product.name}`}>
      <div className="product-card__image-wrap">
        <span className="product-card__number">{pokemonNumber}</span>
        <span className="product-card__badge">{pokemonGeneration}</span>
        <img src={product.image} alt={product.title} loading="lazy" />
      </div>

      <div className="product-card__content">
        <h2>{product.title}</h2>
        {types.length > 0 ? (
          <div className="product-card__types" aria-label="Tipos del Pokemon">
            {types.map((type) => (
              <span className={getPokemonTypeClassName(type)} key={getPokemonTypeName(type)}>
                {getPokemonTypeIcon(type) ? (
                  <img src={getPokemonTypeIcon(type)} alt="" aria-hidden="true" />
                ) : null}
                {getPokemonTypeName(type)}
              </span>
            ))}
          </div>
        ) : null}
        <p>{product.formattedPrice}</p>
        <span className="product-card__cta">Ver detalle</span>
      </div>
    </Link>
  )
}

export default ProductCard
