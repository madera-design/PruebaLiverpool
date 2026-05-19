import { screen } from '@testing-library/react'
import { renderWithProviders } from '../test/renderWithProviders.jsx'
import ProductCard from './ProductCard.jsx'

const product = {
  id: 25,
  name: 'pikachu',
  title: 'Pikachu',
  image: 'https://example.com/pikachu.png',
  formattedPrice: '$1,234',
}

describe('ProductCard', () => {
  it('renders product core information and links to detail', () => {
    renderWithProviders(<ProductCard product={product} />)

    expect(screen.getByRole('heading', { name: 'Pikachu' })).toBeInTheDocument()
    expect(screen.getByText('#025')).toBeInTheDocument()
    expect(screen.getByText('$1,234')).toBeInTheDocument()
    expect(screen.getByRole('img', { name: 'Pikachu' })).toHaveAttribute(
      'src',
      product.image,
    )
    expect(screen.getByRole('link')).toHaveAttribute('href', '/products/pikachu')
  })
})
