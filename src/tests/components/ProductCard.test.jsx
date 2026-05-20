import { screen } from '@testing-library/react'
import { renderWithProviders } from '../renderWithProviders.jsx'
import ProductCard from '../../components/ProductCard.jsx'

const product = {
  id: 25,
  name: 'pikachu',
  title: 'Pikachu',
  image: 'https://example.com/pikachu.png',
  formattedPrice: '$1,234',
  types: [
    {
      icon: 'https://example.com/electric.png',
      name: 'electric',
    },
  ],
}

describe('ProductCard', () => {
  it('renders product core information and links to detail', () => {
    renderWithProviders(<ProductCard product={product} />)

    expect(screen.getByRole('heading', { name: 'Pikachu' })).toBeInTheDocument()
    expect(screen.getByText('#025')).toBeInTheDocument()
    expect(screen.getByText('Generacion 1')).toBeInTheDocument()
    expect(screen.getByText('electric')).toBeInTheDocument()
    expect(document.querySelector('.pokemon-type img')).toHaveAttribute(
      'src',
      'https://example.com/electric.png',
    )
    expect(screen.getByText('$1,234')).toBeInTheDocument()
    expect(screen.getByText('Ver detalle')).toBeInTheDocument()
    expect(screen.getByRole('img', { name: 'Pikachu' })).toHaveAttribute(
      'src',
      product.image,
    )
    expect(screen.getByRole('link')).toHaveAttribute('href', '/products/pikachu')
  })
})
