import { Link } from 'react-router-dom'

function getPokemonTypeClassName(type) {
  return `pokemon-type pokemon-type--${type.toLowerCase()}`
}

function ProductCard({ product }) {
  const pokemonNumber = `#${String(product.id).padStart(3, '0')}`
  const types = product.types || []

  return (
    <Link className="product-card" to={`/products/${product.name}`}>
      <div className="product-card__image-wrap">
        <span className="product-card__number">{pokemonNumber}</span>
        <img src={product.image} alt={product.title} loading="lazy" />
      </div>

      <div className="product-card__content">
        <h2>{product.title}</h2>
        {types.length > 0 ? (
          <div className="product-card__types" aria-label="Tipos del Pokemon">
            {types.map((type) => (
              <span className={getPokemonTypeClassName(type)} key={type}>
                {type}
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
