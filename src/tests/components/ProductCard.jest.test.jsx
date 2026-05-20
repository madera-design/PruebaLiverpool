import { screen } from '@testing-library/react'
import { renderWithJest } from '../renderWithJest.jsx'
import ProductCard from '../../components/ProductCard.jsx'

const product = {
  id: 150,
  name: 'mewtwo',
  title: 'Mewtwo',
  image: 'https://example.com/mewtwo.png',
  formattedPrice: '$2,490',
  types: ['psychic'],
}

describe('ProductCard with Jest', () => {
  test('shows product information and detail link', () => {
    renderWithJest(<ProductCard product={product} />)

    expect(screen.getByRole('heading', { name: 'Mewtwo' })).toBeInTheDocument()
    expect(screen.getByText('#150')).toBeInTheDocument()
    expect(screen.getByText('Liverpool Collection')).toBeInTheDocument()
    expect(screen.getByText('psychic')).toBeInTheDocument()
    expect(screen.getByText('$2,490')).toBeInTheDocument()
    expect(screen.getByText('Ver detalle')).toBeInTheDocument()
    expect(screen.getByRole('img', { name: 'Mewtwo' })).toHaveAttribute(
      'src',
      product.image,
    )
    expect(screen.getByRole('link')).toHaveAttribute('href', '/products/mewtwo')
  })
})
