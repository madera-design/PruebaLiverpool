import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { render } from '@testing-library/react'
import SearchBar from './SearchBar.jsx'

describe('SearchBar', () => {
  it('calls change and submit handlers', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    const onSubmit = vi.fn((event) => event.preventDefault())
    const onReset = vi.fn()

    render(
      <SearchBar
        value=""
        onChange={onChange}
        onSubmit={onSubmit}
        onReset={onReset}
        isLoading={false}
      />,
    )

    await user.type(screen.getByLabelText('Buscar pokemon'), 'mew')
    await user.click(screen.getByRole('button', { name: 'Buscar' }))
    await user.click(screen.getByRole('button', { name: 'Limpiar' }))

    expect(onChange).toHaveBeenCalled()
    expect(onSubmit).toHaveBeenCalledTimes(1)
    expect(onReset).toHaveBeenCalledTimes(1)
  })
})
