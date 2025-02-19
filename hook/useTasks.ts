import { useState, useEffect } from 'react'
import { type Task } from '@/lib/types'

export function useTasks() {
    const [tasks, setTasks] = useState<Task[]>(() => {
        if (typeof window !== 'undefined') {
            const storedTasks = localStorage.getItem('tasks')
            if (storedTasks) {
                return JSON.parse(storedTasks).map((task: any) => ({
                    ...task,
                    dueDate: task.dueDate ? new Date(task.dueDate) : undefined,
                    createdAt: new Date(task.createdAt)
                }))
            }
        }
        return []
    })

    useEffect(() => {
        if (tasks.length > 0) {
            localStorage.setItem('tasks', JSON.stringify(tasks))
        }
    }, [tasks])

    return {
        tasks,
        setTasks
    }
}