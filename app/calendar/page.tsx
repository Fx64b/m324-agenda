'use client'

import { useTasks } from '@/hook/useTasks'
import {
    addMonths,
    eachDayOfInterval,
    endOfMonth,
    endOfWeek,
    format,
    isSameMonth,
    startOfMonth,
    startOfWeek,
    subMonths,
} from 'date-fns'
import { ChevronLeft, ChevronRight, ListTodo } from 'lucide-react'

import { useMemo, useState } from 'react'

import Link from 'next/link'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function CalendarPage() {
    const { tasks } = useTasks()
    const [currentDate, setCurrentDate] = useState(new Date())

    const navigateMonth = (direction: 'forward' | 'back') => {
        setCurrentDate((current) =>
            direction === 'forward'
                ? addMonths(current, 1)
                : subMonths(current, 1)
        )
    }

    const calendarDays = useMemo(() => {
        const monthStart = startOfMonth(currentDate)
        const monthEnd = endOfMonth(currentDate)
        const calendarStart = startOfWeek(monthStart)
        const calendarEnd = endOfWeek(monthEnd)

        return eachDayOfInterval({ start: calendarStart, end: calendarEnd })
    }, [currentDate])

    const getTasksForDate = (date: Date) => {
        const dayTasks = tasks.filter((task) => {
            if (!task.dueDate) return false
            const taskDate = new Date(task.dueDate)
            return (
                taskDate.getDate() === date.getDate() &&
                taskDate.getMonth() === date.getMonth() &&
                taskDate.getFullYear() === date.getFullYear()
            )
        })

        return dayTasks.sort((a, b) => {
            const priorityOrder = { high: 0, medium: 1, low: 2 }
            return priorityOrder[a.priority] - priorityOrder[b.priority]
        })
    }

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'high':
                return 'text-red-500 border-red-500'
            case 'medium':
                return 'text-yellow-500 border-yellow-500'
            case 'low':
                return 'text-green-500 border-green-500'
            default:
                return ''
        }
    }

    return (
        <div className="container mx-auto max-w-7xl p-4">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-6">
                    <CardTitle>{format(currentDate, 'MMMM yyyy')}</CardTitle>
                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={() => navigateMonth('back')}
                            aria-label="Previous month"
                        >
                            <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={() => navigateMonth('forward')}
                            aria-label="Next month"
                        >
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                        <Link href={'/agenda'}>
                            <Button
                                variant="outline"
                                size="icon"
                                aria-label="Go to agenda view"
                            >
                                <ListTodo />
                            </Button>
                        </Link>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="mb-px grid grid-cols-7 gap-px">
                        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(
                            (day) => (
                                <div
                                    key={day}
                                    className="flex h-12 items-center justify-center bg-muted font-medium"
                                >
                                    {day}
                                </div>
                            )
                        )}
                    </div>

                    <div className="grid grid-cols-7 gap-px bg-muted">
                        {calendarDays.map((day, index) => {
                            const dayTasks = getTasksForDate(day)
                            const isCurrentMonth = isSameMonth(day, currentDate)

                            return (
                                <div
                                    key={index}
                                    data-testid="day-cell"
                                    className={`min-h-[150px] bg-background p-2 ${
                                        !isCurrentMonth ? 'opacity-50' : ''
                                    }`}
                                >
                                    <div className="mb-2 font-medium">
                                        {format(day, 'd')}
                                    </div>
                                    <div className="max-h-[100px] space-y-1 overflow-y-auto">
                                        {dayTasks.map((task) => (
                                            <Badge
                                                key={task.id}
                                                variant="outline"
                                                className={`w-full justify-start truncate text-xs ${getPriorityColor(
                                                    task.priority
                                                )} ${
                                                    task.completed
                                                        ? 'line-through opacity-50'
                                                        : ''
                                                }`}
                                            >
                                                {task.title}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
