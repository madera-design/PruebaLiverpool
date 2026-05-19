function ProductGridSkeleton({ count = 8 }) {
  return (
    <div className="product-grid" aria-hidden="true">
      {Array.from({ length: count }).map((_, index) => (
        <div className="product-card product-card--skeleton" key={index}>
          <div className="skeleton skeleton--image" />
          <div className="product-card__content">
            <div className="skeleton skeleton--title" />
            <div className="skeleton skeleton--price" />
          </div>
        </div>
      ))}
    </div>
  )
}

export default ProductGridSkeleton
