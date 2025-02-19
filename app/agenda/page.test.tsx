import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import AgendaPage from './page'

// Mock localStorage
const localStorageMock = (() => {
    let store: { [key: string]: string } = {}
    return {
        getItem: (key: string) => store[key] || null,
        setItem: (key: string, value: string) => {
            store[key] = value.toString()
        },
        clear: () => {
            store = {}
        }
    }
})()

Object.defineProperty(window, 'localStorage', {
    value: localStorageMock
})

describe('AgendaPage', () => {
    beforeEach(() => {
        localStorageMock.clear()
    })

    describe('Task Creation', () => {
        it('adds a new task with basic information', () => {
            render(<AgendaPage />)

            const titleInput = screen.getByPlaceholderText('Task title...')
            const addButton = screen.getByRole('button', { name: /add/i })

            fireEvent.change(titleInput, { target: { value: 'New Test Task' } })
            fireEvent.click(addButton)

            expect(screen.getByText('New Test Task')).toBeInTheDocument()
        })

        it('adds a task with full details', () => {
            render(<AgendaPage />)

            const titleInput = screen.getByPlaceholderText('Task title...')
            const descriptionInput = screen.getByPlaceholderText('Description (optional)')
            const priorityTrigger = screen.getByRole('combobox')

            fireEvent.change(titleInput, { target: { value: 'Important Task' } })
            fireEvent.change(descriptionInput, { target: { value: 'Must be done ASAP' } })
            fireEvent.click(priorityTrigger)
            fireEvent.click(screen.getByRole('option', { name: 'High' }))

            fireEvent.click(screen.getByRole('button', { name: /add/i }))

            expect(screen.getByText('Important Task')).toBeInTheDocument()
            expect(screen.getByText('Must be done ASAP')).toBeInTheDocument()
            expect(screen.getByText('high')).toBeInTheDocument()
        })

        it('prevents adding empty tasks', () => {
            render(<AgendaPage />)

            const addButton = screen.getByRole('button', { name: /add/i })
            const tasksBefore = screen.queryAllByRole('article')

            fireEvent.click(addButton)

            const tasksAfter = screen.queryAllByRole('article')
            expect(tasksAfter.length).toBe(tasksBefore.length)
        })
    })

    describe('Task Management', () => {
        it('toggles task completion status', () => {
            render(<AgendaPage />)

            // Add a task
            const titleInput = screen.getByPlaceholderText('Task title...')
            fireEvent.change(titleInput, { target: { value: 'Toggle Test Task' } })
            fireEvent.click(screen.getByRole('button', { name: /add/i }))

            // Find and click the toggle button using aria-label
            const toggleButton = screen.getByRole('button', { name: /toggle task completion/i })

            fireEvent.click(toggleButton)
            expect(screen.getByText('Toggle Test Task')).toHaveClass('line-through')

            fireEvent.click(toggleButton)
            expect(screen.getByText('Toggle Test Task')).not.toHaveClass('line-through')
        })

        it('deletes a task', () => {
            render(<AgendaPage />)

            // Add a task
            const titleInput = screen.getByPlaceholderText('Task title...')
            fireEvent.change(titleInput, { target: { value: 'Task to Delete' } })
            fireEvent.click(screen.getByRole('button', { name: /add/i }))

            // Find and click delete button using aria-label
            const deleteButton = screen.getByRole('button', { name: /delete task/i })

            fireEvent.click(deleteButton)
            expect(screen.queryByText('Task to Delete')).not.toBeInTheDocument()
        })
    })

    describe('Filtering', () => {
        it('filters completed tasks', () => {
            render(<AgendaPage />)

            // Add a task
            const titleInput = screen.getByPlaceholderText('Task title...')
            fireEvent.change(titleInput, { target: { value: 'Completed Task' } })
            fireEvent.click(screen.getByRole('button', { name: /add/i }))

            // Complete the task
            const toggleButton = screen.getByRole('button', { name: /toggle task completion/i })
            fireEvent.click(toggleButton)

            // Switch to completed filter
            fireEvent.click(screen.getByRole('tab', { name: /completed/i }))

            expect(screen.getByText('Completed Task')).toBeInTheDocument()
        })
    })
})