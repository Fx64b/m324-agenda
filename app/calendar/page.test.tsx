import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import CalendarPage from './page'
import { format, addMonths, subMonths } from 'date-fns'

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

describe('CalendarPage', () => {
    beforeEach(() => {
        localStorageMock.clear()
    })

    describe('Calendar Navigation', () => {
        it('displays the current month and year', () => {
            render(<CalendarPage />)
            const currentDate = new Date()
            const formattedDate = format(currentDate, 'MMMM yyyy')
            expect(screen.getByText(formattedDate)).toBeInTheDocument()
        })

        it('navigates to next month when clicking forward button', () => {
            render(<CalendarPage />)
            const currentDate = new Date()
            const nextMonth = format(addMonths(currentDate, 1), 'MMMM yyyy')

            // Use getAllByRole and find the one with the right icon
            const buttons = screen.getAllByRole('button', { name: /next month/i })
            const nextButton = buttons.find(button =>
                button.querySelector('.lucide-chevron-right'))

            if (!nextButton) throw new Error('Next button not found')

            fireEvent.click(nextButton)
            expect(screen.getByText(nextMonth)).toBeInTheDocument()
        })

        it('navigates to previous month when clicking back button', () => {
            render(<CalendarPage />)
            const currentDate = new Date()
            const previousMonth = format(subMonths(currentDate, 1), 'MMMM yyyy')

            fireEvent.click(screen.getByRole('button', { name: /previous month/i }))
            expect(screen.getByText(previousMonth)).toBeInTheDocument()
        })
    })

    describe('Task Display', () => {
        it('displays tasks on their respective dates', () => {
            // Set up a task in localStorage
            const task = {
                id: '1',
                title: 'Test Task',
                dueDate: new Date().toISOString(),
                createdAt: new Date().toISOString(),
                completed: false,
                priority: 'high'
            }
            localStorageMock.setItem('tasks', JSON.stringify([task]))

            render(<CalendarPage />)
            expect(screen.getByText('Test Task')).toBeInTheDocument()
        })

        it('applies correct styling to tasks based on priority', () => {
            const task = {
                id: '1',
                title: 'High Priority Task',
                dueDate: new Date().toISOString(),
                createdAt: new Date().toISOString(),
                completed: false,
                priority: 'high'
            }
            localStorageMock.setItem('tasks', JSON.stringify([task]))

            render(<CalendarPage />)
            const taskElement = screen.getByText('High Priority Task')
            expect(taskElement.closest('.text-red-500')).toBeInTheDocument()
        })

        it('shows completed tasks with strikethrough', () => {
            const task = {
                id: '1',
                title: 'Completed Task',
                dueDate: new Date().toISOString(),
                createdAt: new Date().toISOString(),
                completed: true,
                priority: 'medium'
            }
            localStorageMock.setItem('tasks', JSON.stringify([task]))

            render(<CalendarPage />)
            const taskElement = screen.getByText('Completed Task')
            expect(taskElement.closest('.line-through')).toBeInTheDocument()
        })
    })

    describe('Calendar Layout', () => {
        it('displays all days of the week', () => {
            render(<CalendarPage />)
            const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
            weekdays.forEach(day => {
                expect(screen.getByText(day)).toBeInTheDocument()
            })
        })

        it('renders the correct number of day cells', () => {
            render(<CalendarPage />)
            const dayCells = screen.getAllByTestId('day-cell')
            expect(dayCells.length).toBeGreaterThanOrEqual(35)
            expect(dayCells.length).toBeLessThanOrEqual(42)
        })
    })
})