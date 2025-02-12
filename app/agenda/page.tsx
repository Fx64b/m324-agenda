'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { type Task } from '@/lib/types'

export default function AgendaPage() {
    const [tasks, setTasks] = useState<Task[]>([])
    const [newTask, setNewTask] = useState('')

    const handleAddTask = (e: React.FormEvent) => {
        e.preventDefault()
        if (!newTask.trim()) return

        const task: Task = {
            id: crypto.randomUUID(),
            title: newTask.trim(),
            createdAt: new Date(),
            completed: false
        }

        setTasks(prev => [task, ...prev])
        setNewTask('')
    }

    return (
        <div className="container mx-auto p-4 max-w-2xl">
            <Card>
                <CardHeader>
                    <CardTitle>Agenda</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleAddTask} className="flex gap-2">
                        <Input
                            value={newTask}
                            onChange={(e) => setNewTask(e.target.value)}
                            placeholder="Add a new task..."
                            data-testid="task-input"
                        />
                        <Button type="submit">Add</Button>
                    </form>

                    <div className="mt-4 space-y-2">
                        {tasks.map(task => (
                            <Card key={task.id}>
                                <CardContent className="p-4">
                                    {task.title}
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}