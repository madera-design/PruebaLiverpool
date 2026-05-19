import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderWithJest } from '../test/renderWithJest.jsx'
import LoginPage from './LoginPage.jsx'

describe('LoginPage password visibility', () => {
  test('toggles password field visibility', async () => {
    const user = userEvent.setup()

    renderWithJest(<LoginPage />)

    const passwordInput = document.querySelector('#password')
    const toggleButton = screen.getByRole('button', { name: 'Ver contrasena' })

    expect(passwordInput).toHaveAttribute('type', 'password')

    await user.click(toggleButton)

    expect(passwordInput).toHaveAttribute('type', 'text')
    expect(
      screen.getByRole('button', { name: 'Ocultar contrasena' }),
    ).toHaveAttribute('aria-pressed', 'true')

    await user.click(screen.getByRole('button', { name: 'Ocultar contrasena' }))

    expect(passwordInput).toHaveAttribute('type', 'password')
  })
})
