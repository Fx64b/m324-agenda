'use client'

import { useTasks } from '@/hook/useTasks'
import { type Task } from '@/lib/types'
import {
    Calendar,
    CalendarDays,
    CheckCircle2,
    Circle,
    PlusCircle,
    Trash2,
} from 'lucide-react'

import { useState } from 'react'

import Link from 'next/link'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { DatePicker } from '@/components/ui/date-picker'
import { Input } from '@/components/ui/input'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'

export default function AgendaPage() {
    const { tasks, setTasks } = useTasks()
    const [newTask, setNewTask] = useState('')
    const [description, setDescription] = useState('')
    const [priority, setPriority] = useState<'low' | 'medium' | 'high'>(
        'medium'
    )
    const [dueDate, setDueDate] = useState<Date | undefined>()
    const [filter, setFilter] = useState('all')

    const handleAddTask = (e: React.FormEvent) => {
        e.preventDefault()
        if (!newTask.trim()) return

        const task: Task = {
            id: crypto.randomUUID(),
            title: newTask.trim(),
            description: description.trim() || undefined,
            dueDate,
            createdAt: new Date(),
            completed: false,
            priority,
        }

        setTasks((prev) => [task, ...prev])
        setNewTask('')
        setDescription('')
        setPriority('medium')
        setDueDate(undefined)
    }

    const toggleTaskCompletion = (taskId: string) => {
        setTasks((prev) =>
            prev.map((task) =>
                task.id === taskId
                    ? { ...task, completed: !task.completed }
                    : task
            )
        )
    }

    const deleteTask = (taskId: string) => {
        setTasks((prev) => prev.filter((task) => task.id !== taskId))
    }

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'high':
                return 'text-red-500'
            case 'medium':
                return 'text-yellow-500'
            case 'low':
                return 'text-green-500'
            default:
                return ''
        }
    }

    const filteredTasks = tasks.filter((task) => {
        if (filter === 'completed') return task.completed
        if (filter === 'active') return !task.completed
        if (filter === 'high')
            return task.priority === 'high' && !task.completed
        if (filter === 'due-soon') {
            if (!task.dueDate || task.completed) return false
            const today = new Date()
            const dueDate = new Date(task.dueDate)
            const diffTime = dueDate.getTime() - today.getTime()
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
            return diffDays <= 3 && diffDays >= 0
        }
        return true
    })

    return (
        <div className="container mx-auto max-w-2xl p-4">
            <Card>
                <CardHeader>
                    <div className={'flex w-full items-center justify-between'}>
                        <CardTitle>Agenda</CardTitle>
                        <Link href={'/calendar'}>
                            <Button
                                variant="outline"
                                size="icon"
                                aria-label="Next month"
                            >
                                <CalendarDays />
                            </Button>
                        </Link>
                    </div>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleAddTask} className="mb-6 space-y-4">
                        <Input
                            value={newTask}
                            onChange={(e) => setNewTask(e.target.value)}
                            placeholder="Task title..."
                            data-testid="task-input"
                        />
                        <Textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Description (optional)"
                        />
                        <div className="flex gap-4">
                            <Select
                                value={priority}
                                onValueChange={(
                                    value: 'low' | 'medium' | 'high'
                                ) => setPriority(value)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Priority" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="low">Low</SelectItem>
                                    <SelectItem value="medium">
                                        Medium
                                    </SelectItem>
                                    <SelectItem value="high">High</SelectItem>
                                </SelectContent>
                            </Select>
                            <DatePicker date={dueDate} onSelect={setDueDate} />
                            <Button type="submit">
                                <PlusCircle className="mr-2" />
                                Add
                            </Button>
                        </div>
                    </form>

                    <Tabs
                        defaultValue="all"
                        className="w-full"
                        onValueChange={setFilter}
                    >
                        <TabsList className="grid w-full grid-cols-5">
                            <TabsTrigger value="all">All</TabsTrigger>
                            <TabsTrigger value="active">Active</TabsTrigger>
                            <TabsTrigger value="completed">
                                Completed
                            </TabsTrigger>
                            <TabsTrigger value="high">
                                High Priority
                            </TabsTrigger>
                            <TabsTrigger value="due-soon">Due Soon</TabsTrigger>
                        </TabsList>
                    </Tabs>

                    <div className="mt-4 space-y-2">
                        {filteredTasks.map((task) => (
                            <Card
                                key={task.id}
                                className={task.completed ? 'opacity-60' : ''}
                            >
                                <CardContent className="p-4">
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-start gap-3">
                                            <button
                                                onClick={() =>
                                                    toggleTaskCompletion(
                                                        task.id
                                                    )
                                                }
                                                className="mt-1 text-primary hover:text-primary/80"
                                                aria-label="Toggle task completion"
                                            >
                                                {task.completed ? (
                                                    <CheckCircle2 />
                                                ) : (
                                                    <Circle />
                                                )}
                                            </button>
                                            <div className="space-y-1">
                                                <span
                                                    className={
                                                        task.completed
                                                            ? 'line-through'
                                                            : ''
                                                    }
                                                >
                                                    {task.title}
                                                </span>
                                                {task.description && (
                                                    <p className="text-sm text-muted-foreground">
                                                        {task.description}
                                                    </p>
                                                )}
                                                <div className="flex gap-2">
                                                    <Badge
                                                        variant="outline"
                                                        className={getPriorityColor(
                                                            task.priority
                                                        )}
                                                    >
                                                        {task.priority}
                                                    </Badge>
                                                    {task.dueDate && (
                                                        <Badge variant="outline">
                                                            <Calendar className="mr-1 h-3 w-3" />
                                                            {new Date(
                                                                task.dueDate
                                                            ).toLocaleDateString()}
                                                        </Badge>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => deleteTask(task.id)}
                                            className="text-destructive transition-colors hover:bg-destructive/10 hover:text-destructive/90"
                                            aria-label="Delete task"
                                        >
                                            <Trash2 className={'!h-6 !w-6'} />
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
