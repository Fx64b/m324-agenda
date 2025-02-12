import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import Home from './page'

describe('Home', () => {
    it('renders a button', () => {
        render(<Home />)
        const button = screen.getByRole('button', { name: /button/i })
        expect(button).toBeInTheDocument()
    })
})