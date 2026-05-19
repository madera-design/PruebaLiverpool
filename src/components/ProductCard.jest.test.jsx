import { screen } from '@testing-library/react'
import { renderWithJest } from '../test/renderWithJest.jsx'
import ProductCard from './ProductCard.jsx'

const product = {
  id: 150,
  name: 'mewtwo',
  title: 'Mewtwo',
  image: 'https://example.com/mewtwo.png',
  formattedPrice: '$2,490',
}

describe('ProductCard with Jest', () => {
  test('shows product information and detail link', () => {
    renderWithJest(<ProductCard product={product} />)

    expect(screen.getByRole('heading', { name: 'Mewtwo' })).toBeInTheDocument()
    expect(screen.getByText('#150')).toBeInTheDocument()
    expect(screen.getByText('$2,490')).toBeInTheDocument()
    expect(screen.getByRole('img', { name: 'Mewtwo' })).toHaveAttribute(
      'src',
      product.image,
    )
    expect(screen.getByRole('link')).toHaveAttribute('href', '/products/mewtwo')
  })
})
