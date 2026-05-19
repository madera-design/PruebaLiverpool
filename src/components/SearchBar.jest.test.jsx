import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { jest } from '@jest/globals'
import SearchBar from './SearchBar.jsx'

describe('SearchBar with Jest', () => {
  test('fires submit and reset actions', async () => {
    const user = userEvent.setup()
    const onChange = jest.fn()
    const onReset = jest.fn()
    const onSubmit = jest.fn((event) => event.preventDefault())

    render(
      <SearchBar
        value=""
        onChange={onChange}
        onSubmit={onSubmit}
        onReset={onReset}
        isLoading={false}
      />,
    )

    await user.type(screen.getByLabelText('Buscar pokemon'), 'pikachu')
    await user.click(screen.getByRole('button', { name: 'Buscar' }))
    await user.click(screen.getByRole('button', { name: 'Limpiar' }))

    expect(onChange).toHaveBeenCalled()
    expect(onSubmit).toHaveBeenCalledTimes(1)
    expect(onReset).toHaveBeenCalledTimes(1)
  })

  test('disables search button while loading', () => {
    render(
      <SearchBar
        value="mew"
        onChange={jest.fn()}
        onSubmit={jest.fn()}
        onReset={jest.fn()}
        isLoading
      />,
    )

    expect(screen.getByRole('button', { name: 'Buscar' })).toBeDisabled()
  })
})
