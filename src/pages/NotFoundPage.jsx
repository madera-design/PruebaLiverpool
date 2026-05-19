import { Link } from 'react-router-dom'

function NotFoundPage() {
  return (
    <section className="page-section" aria-labelledby="not-found-title">
      <p className="eyebrow">404</p>
      <h1 id="not-found-title">Pagina no encontrada</h1>
      <p>La ruta solicitada no existe dentro de la prueba tecnica.</p>

      <Link className="text-link" to="/products">
        Ir al catalogo
      </Link>
    </section>
  )
}

export default NotFoundPage
