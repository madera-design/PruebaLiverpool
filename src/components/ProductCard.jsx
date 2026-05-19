import { Link } from 'react-router-dom'

function ProductCard({ product }) {
  const pokemonNumber = `#${String(product.id).padStart(3, '0')}`

  return (
    <Link className="product-card" to={`/products/${product.name}`}>
      <div className="product-card__image-wrap">
        <span className="product-card__number">{pokemonNumber}</span>
        <img src={product.image} alt={product.title} loading="lazy" />
      </div>

      <div className="product-card__content">
        <h2>{product.title}</h2>
        <p>{product.formattedPrice}</p>
      </div>
    </Link>
  )
}

export default ProductCard
