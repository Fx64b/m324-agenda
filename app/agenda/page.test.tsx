import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import AgendaPage from './page'

describe('AgendaPage', () => {
    it('allows adding a new task', () => {
        render(<AgendaPage />)

        const input = screen.getByTestId('task-input')
        const button = screen.getByRole('button', { name: /add/i })

        fireEvent.change(input, { target: { value: 'Test task' } })
        fireEvent.click(button)

        expect(screen.getByText('Test task')).toBeInTheDocument()
    })

    it('does not add empty tasks', () => {
        render(<AgendaPage />)

        const button = screen.getByRole('button', { name: /add/i })
        const tasksBefore = screen.queryAllByRole('article')

        fireEvent.click(button)

        const tasksAfter = screen.queryAllByRole('article')
        expect(tasksAfter.length).toBe(tasksBefore.length)
    })
})