import { useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Loader from '../components/Loader.jsx'
import ProductCard from '../components/ProductCard.jsx'
import ProductGridSkeleton from '../components/ProductGridSkeleton.jsx'
import SearchBar from '../components/SearchBar.jsx'
import StatusMessage from '../components/StatusMessage.jsx'
import {
  loadDefaultProducts,
  loadMoreProducts,
  selectCachedProductsCount,
  selectProducts,
  selectProductsError,
  selectProductsHasMore,
  selectProductsLastUpdated,
  selectProductsPagingStatus,
  selectProductsQuery,
  selectProductsStatus,
  searchProductByName,
  setQuery,
} from '../features/products/productsSlice.js'

function ProductListPage() {
  const dispatch = useDispatch()
  const products = useSelector(selectProducts)
  const query = useSelector(selectProductsQuery)
  const status = useSelector(selectProductsStatus)
  const pagingStatus = useSelector(selectProductsPagingStatus)
  const error = useSelector(selectProductsError)
  const cachedProductsCount = useSelector(selectCachedProductsCount)
  const lastUpdated = useSelector(selectProductsLastUpdated)
  const hasMore = useSelector(selectProductsHasMore)
  const loadMoreRef = useRef(null)
  const isLoading = status === 'loading'
  const isPagingLoading = pagingStatus === 'loading'
  const canLoadMore = !query && !isLoading && !error && hasMore
  const lastUpdatedLabel = lastUpdated
    ? new Intl.DateTimeFormat('es-MX', {
        hour: '2-digit',
        minute: '2-digit',
      }).format(lastUpdated)
    : 'sin sincronizar'

  useEffect(() => {
    if (status === 'idle') {
      dispatch(loadDefaultProducts())
    }
  }, [dispatch, status])

  useEffect(() => {
    const sentinel = loadMoreRef.current

    if (!sentinel || !canLoadMore) {
      return undefined
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          dispatch(loadMoreProducts())
        }
      },
      { rootMargin: '220px' },
    )

    observer.observe(sentinel)

    return () => observer.disconnect()
  }, [canLoadMore, dispatch])

  function handleSearchSubmit(event) {
    event.preventDefault()

    const normalizedQuery = query.trim().toLowerCase()

    if (!normalizedQuery) {
      dispatch(loadDefaultProducts())
      return
    }

    dispatch(searchProductByName(normalizedQuery))
  }

  function handleResetSearch() {
    dispatch(setQuery(''))
    dispatch(loadDefaultProducts())
  }

  return (
    <section className="catalog-page" aria-labelledby="products-title">
      <div className="catalog-heading">
        <p className="eyebrow">Pokedex</p>
        <h1 id="products-title">Catálogo Pokémon</h1>
        <p>
          Explora productos inspirados en PokeAPI. Busca por nombre o navega el
          catalogo inicial.
        </p>
        <div className="state-panel" aria-label="Estado del catalogo">
          <span>{cachedProductsCount} productos en cache</span>
          <span>Actualizado: {lastUpdatedLabel}</span>
        </div>
      </div>

      <SearchBar
        value={query}
        onChange={(event) => dispatch(setQuery(event.target.value))}
        onSubmit={handleSearchSubmit}
        onReset={handleResetSearch}
        isLoading={isLoading}
      />

      {isLoading ? (
        <>
          <Loader label="Consultando PokeAPI" />
          <ProductGridSkeleton />
        </>
      ) : null}

      {error ? (
        <StatusMessage
          actionLabel="Reintentar"
          message={error}
          onAction={handleResetSearch}
          title="No fue posible cargar resultados"
          variant="error"
        />
      ) : null}

      {!isLoading && !error && products.length === 0 ? (
        <StatusMessage
          actionLabel="Ver catalogo inicial"
          message="Prueba con otro nombre de Pokemon."
          onAction={handleResetSearch}
          title="Sin resultados"
        />
      ) : null}

      {!isLoading && !error && products.length > 0 ? (
        <>
          <div className="product-grid">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {canLoadMore || isPagingLoading ? (
            <div className="load-more-sentinel" ref={loadMoreRef}>
              {isPagingLoading ? (
                <Loader label="Cargando mas productos" />
              ) : (
                <span>Desplazate para cargar mas productos</span>
              )}
            </div>
          ) : null}
        </>
      ) : null}
    </section>
  )
}

export default ProductListPage
