export interface Task {
    id: string
    title: string
    description?: string
    dueDate?: Date
    createdAt: Date
    completed: boolean
    priority: 'low' | 'medium' | 'high'
}