import { useCallback, useEffect, useState } from 'react'
import { createTask, deleteTask, fetchTasks, updateTask } from './api/tasks'
import { Board } from './components/Board'
import { EditTaskModal } from './components/EditTaskModal'
import { NewTaskForm } from './components/NewTaskForm'
import type { Task, TaskStatus } from './types'
import './App.css'

function App() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [editingTask, setEditingTask] = useState<Task | null>(null)

  const loadTasks = useCallback(async () => {
    setError(null)
    try {
      const data = await fetchTasks()
      setTasks(data)
    } catch {
      setError('Could not load tasks. Is the API running?')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void loadTasks()
  }, [loadTasks])

  async function handleCreate(title: string, description: string) {
    setError(null)
    try {
      const created = await createTask({ title, description, status: 'todo' })
      setTasks((current) => [...current, created])
    } catch {
      setError('Failed to create task.')
      throw new Error('create failed')
    }
  }

  async function handleMove(taskId: number, status: TaskStatus, position: number) {
    const previous = tasks
    setTasks((current) => {
      const moving = current.find((task) => task.id === taskId)
      if (!moving) return current

      const without = current.filter((task) => task.id !== taskId)
      const next = without.map((task) => {
        if (task.status === moving.status && task.position > moving.position) {
          return { ...task, position: task.position - 1 }
        }
        return task
      })

      const column = next
        .filter((task) => task.status === status)
        .sort((a, b) => a.position - b.position)

      column.splice(position, 0, { ...moving, status, position })
      const renumberedColumn = column.map((task, index) => ({ ...task, position: index }))

      const others = next.filter((task) => task.status !== status)
      return [...others, ...renumberedColumn]
    })

    try {
      await updateTask(taskId, { status, position })
    } catch {
      setTasks(previous)
      setError('Failed to move task. Board restored.')
    }
  }

  async function handleSave(taskId: number, title: string, description: string) {
    setError(null)
    try {
      const updated = await updateTask(taskId, { title, description })
      setTasks((current) => current.map((task) => (task.id === taskId ? updated : task)))
    } catch {
      setError('Failed to update task.')
      throw new Error('update failed')
    }
  }

  async function handleDelete(taskId: number) {
    const previous = tasks
    setTasks((current) => {
      const removing = current.find((task) => task.id === taskId)
      if (!removing) return current
      return current
        .filter((task) => task.id !== taskId)
        .map((task) => {
          if (task.status === removing.status && task.position > removing.position) {
            return { ...task, position: task.position - 1 }
          }
          return task
        })
    })

    try {
      await deleteTask(taskId)
    } catch {
      setTasks(previous)
      setError('Failed to delete task.')
    }
  }

  return (
    <div className="app">
      <header className="app__header">
        <div>
          <p className="app__eyebrow">Local board</p>
          <h1>Kanban</h1>
        </div>
        <NewTaskForm onCreate={handleCreate} />
      </header>

      {error ? <p className="app__error">{error}</p> : null}
      {loading ? <p className="app__status">Loading board…</p> : <Board tasks={tasks} onMove={handleMove} onEdit={setEditingTask} onDelete={handleDelete} />}

      <EditTaskModal
        task={editingTask}
        onClose={() => setEditingTask(null)}
        onSave={handleSave}
      />
    </div>
  )
}

export default App
