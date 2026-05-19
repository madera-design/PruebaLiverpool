import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useParams } from 'react-router-dom'
import Loader from '../components/Loader.jsx'
import StatusMessage from '../components/StatusMessage.jsx'
import {
  loadProductDetail,
  selectProductDetailError,
  selectProductDetailStatus,
  selectSelectedProduct,
} from '../features/products/productsSlice.js'

function formatPokemonNumber(id) {
  return `#${String(id).padStart(3, '0')}`
}

function formatHeight(height) {
  return `${(height / 10).toFixed(1)} m`
}

function formatWeight(weight) {
  return `${(weight / 10).toFixed(1)} kg`
}

function ProductDetailPage() {
  const { productName } = useParams()
  const dispatch = useDispatch()
  const product = useSelector(selectSelectedProduct)
  const status = useSelector(selectProductDetailStatus)
  const error = useSelector(selectProductDetailError)
  const [selectedSection, setSelectedSection] = useState({
    pokemonName: productName,
    section: 'summary',
  })
  const [selectedImage, setSelectedImage] = useState({
    pokemonName: productName,
    index: 0,
  })
  const activeSection =
    selectedSection.pokemonName === productName ? selectedSection.section : 'summary'
  const activeImageIndex =
    selectedImage.pokemonName === productName ? selectedImage.index : 0
  const isLoading = status === 'loading'

  useEffect(() => {
    dispatch(loadProductDetail(productName))
  }, [dispatch, productName])

  return (
    <section className="detail-page" aria-labelledby="detail-title">
      <Link className="text-link" to="/products">
        Volver al catalogo
      </Link>

      {isLoading ? (
        <>
          <Loader label="Preparando informacion del Pokemon" />
          <article className="detail-card detail-card--skeleton" aria-hidden="true">
            <div className="skeleton skeleton--detail-image" />
            <div className="detail-card__content">
              <div className="skeleton skeleton--title skeleton--wide" />
              <div className="skeleton skeleton--paragraph" />
              <div className="skeleton skeleton--paragraph skeleton--short" />
            </div>
          </article>
        </>
      ) : null}

      {error ? (
        <StatusMessage
          actionLabel="Reintentar"
          message={error}
          onAction={() => dispatch(loadProductDetail(productName))}
          title="No fue posible cargar el Pokemon"
          variant="error"
        />
      ) : null}

      {!isLoading && !error && product ? (
        <article className="detail-card pokemon-detail">
          <div className="detail-card__media">
            <span className="pokemon-number">{formatPokemonNumber(product.id)}</span>
            <img
              src={product.images?.[activeImageIndex]?.src || product.image}
              alt={`${product.title} ${product.images?.[activeImageIndex]?.label || ''}`.trim()}
            />

            {product.images?.length > 1 ? (
              <>
                <button
                  type="button"
                  className="carousel-button carousel-button--previous"
                  aria-label="Imagen anterior"
                  onClick={() =>
                    setSelectedImage({
                      pokemonName: productName,
                      index:
                        (activeImageIndex - 1 + product.images.length) %
                        product.images.length,
                    })
                  }
                >
                  ‹
                </button>
                <button
                  type="button"
                  className="carousel-button carousel-button--next"
                  aria-label="Imagen siguiente"
                  onClick={() =>
                    setSelectedImage({
                      pokemonName: productName,
                      index: (activeImageIndex + 1) % product.images.length,
                    })
                  }
                >
                  ›
                </button>
                <div className="carousel-thumbnails" aria-label="Imagenes del Pokemon">
                  {product.images.map((image, index) => (
                    <button
                      type="button"
                      key={image.src}
                      aria-label={`Ver imagen ${image.label}`}
                      aria-pressed={activeImageIndex === index}
                      onClick={() =>
                        setSelectedImage({
                          pokemonName: productName,
                          index,
                        })
                      }
                    >
                      <img src={image.src} alt="" />
                    </button>
                  ))}
                </div>
              </>
            ) : null}
          </div>

          <div className="detail-card__content">
            <p className="eyebrow">Ficha Pokemon</p>
            <div className="pokemon-title-row">
              <h1 id="detail-title">{product.title}</h1>
              {product.species?.genus ? <span>{product.species.genus}</span> : null}
            </div>

            <div className="tag-list pokemon-types" aria-label="Tipos del Pokemon">
              {product.types.map((type) => (
                <span key={type}>{type}</span>
              ))}
            </div>

            <p>
              {product.species?.description ||
                `${product.title} es un Pokemon de tipo ${product.types.join(', ')} con experiencia base de ${product.baseExperience}.`}
            </p>

            <div className="detail-tabs" role="tablist" aria-label="Detalle Pokemon">
              {[
                ['summary', 'Resumen'],
                ['abilities', 'Habilidades'],
                ['stats', 'Stats'],
                ['moves', 'Movimientos'],
              ].map(([section, label]) => (
                <button
                  type="button"
                  key={section}
                  role="tab"
                  aria-selected={activeSection === section}
                  aria-controls={`pokemon-panel-${section}`}
                  id={`pokemon-tab-${section}`}
                  onClick={() =>
                    setSelectedSection({
                      pokemonName: productName,
                      section,
                    })
                  }
                >
                  {label}
                </button>
              ))}
            </div>

            <div className="detail-slider">
              <section
                className="detail-slide"
                id="pokemon-panel-summary"
                role="tabpanel"
                aria-labelledby="pokemon-tab-summary"
                hidden={activeSection !== 'summary'}
              >
                <dl className="product-specs pokemon-facts">
                  <div>
                    <dt>Experiencia base</dt>
                    <dd>{product.baseExperience}</dd>
                  </div>
                  <div>
                    <dt>Altura</dt>
                    <dd>{formatHeight(product.height)}</dd>
                  </div>
                  <div>
                    <dt>Peso</dt>
                    <dd>{formatWeight(product.weight)}</dd>
                  </div>
                  <div>
                    <dt>Orden</dt>
                    <dd>{product.order}</dd>
                  </div>
                  {product.species?.captureRate ? (
                    <div>
                      <dt>Captura</dt>
                      <dd>{product.species.captureRate}</dd>
                    </div>
                  ) : null}
                  {product.species?.habitat ? (
                    <div>
                      <dt>Habitat</dt>
                      <dd>{product.species.habitat}</dd>
                    </div>
                  ) : null}
                </dl>
              </section>

              <section
                className="detail-slide"
                id="pokemon-panel-abilities"
                role="tabpanel"
                aria-labelledby="pokemon-tab-abilities"
                hidden={activeSection !== 'abilities'}
              >
                <h2>Habilidades</h2>
                <div className="tag-list">
                  {product.abilities.map((ability) => (
                    <span key={ability}>{ability}</span>
                  ))}
                </div>
              </section>

              <section
                className="detail-slide"
                id="pokemon-panel-stats"
                role="tabpanel"
                aria-labelledby="pokemon-tab-stats"
                hidden={activeSection !== 'stats'}
              >
                <h2>Estadisticas base</h2>
                <div className="stats-list">
                  {product.stats.map((stat) => (
                    <div className="stat-row" key={stat.label}>
                      <span>{stat.label}</span>
                      <strong>{stat.value}</strong>
                      <div className="stat-bar" aria-hidden="true">
                        <span style={{ width: `${Math.min(stat.value, 160) / 1.6}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              <section
                className="detail-slide"
                id="pokemon-panel-moves"
                role="tabpanel"
                aria-labelledby="pokemon-tab-moves"
                hidden={activeSection !== 'moves'}
              >
                <h2>Movimientos destacados</h2>
                <div className="tag-list">
                  {product.moves.map((move) => (
                    <span key={move}>{move}</span>
                  ))}
                </div>
              </section>
            </div>
          </div>
        </article>
      ) : null}
    </section>
  )
}

export default ProductDetailPage
