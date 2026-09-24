import { api } from './client'
import type { Task, TaskCreate, TaskStatus, TaskUpdate } from '../types'

type TaskListResponse = {
  tasks: Task[]
}

export async function fetchTasks(status?: TaskStatus): Promise<Task[]> {
  const { data } = await api.get<TaskListResponse>('/tasks', {
    params: status ? { status } : undefined,
  })
  return data.tasks
}

export async function createTask(payload: TaskCreate): Promise<Task> {
  const { data } = await api.post<Task>('/tasks', payload)
  return data
}

export async function updateTask(id: number, payload: TaskUpdate): Promise<Task> {
  const { data } = await api.patch<Task>(`/tasks/${id}`, payload)
  return data
}

export async function deleteTask(id: number): Promise<void> {
  await api.delete(`/tasks/${id}`)
}
