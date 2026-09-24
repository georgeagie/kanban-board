import {
  DndContext,
  type DragEndEvent,
  DragOverlay,
  type DragStartEvent,
  PointerSensor,
  closestCorners,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import { useMemo, useState } from 'react'
import type { Task, TaskStatus } from '../types'
import { COLUMNS } from '../types'
import { Column } from './Column'

type BoardProps = {
  tasks: Task[]
  onMove: (taskId: number, status: TaskStatus, position: number) => Promise<void>
  onEdit: (task: Task) => void
  onDelete: (taskId: number) => void
}

function isTaskStatus(value: string | number): value is TaskStatus {
  return value === 'todo' || value === 'in_progress' || value === 'done'
}

export function Board({ tasks, onMove, onEdit, onDelete }: BoardProps) {
  const [activeTask, setActiveTask] = useState<Task | null>(null)
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 6 },
    }),
  )

  const tasksByStatus = useMemo(() => {
    const grouped: Record<TaskStatus, Task[]> = {
      todo: [],
      in_progress: [],
      done: [],
    }
    for (const task of [...tasks].sort((a, b) => a.position - b.position)) {
      grouped[task.status].push(task)
    }
    return grouped
  }, [tasks])

  function findStatus(id: string | number): TaskStatus | null {
    if (isTaskStatus(id)) return id
    const task = tasks.find((item) => item.id === id)
    return task?.status ?? null
  }

  function handleDragStart(event: DragStartEvent) {
    const task = tasks.find((item) => item.id === event.active.id)
    setActiveTask(task ?? null)
  }

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    setActiveTask(null)
    if (!over) return

    const activeId = Number(active.id)
    const activeTaskItem = tasks.find((task) => task.id === activeId)
    if (!activeTaskItem) return

    const overId = over.id
    const toStatus = findStatus(overId)
    if (!toStatus) return

    const columnTasks = tasksByStatus[toStatus].filter((task) => task.id !== activeId)
    let toPosition = columnTasks.length

    if (!isTaskStatus(overId)) {
      const overIndex = columnTasks.findIndex((task) => task.id === overId)
      if (overIndex >= 0) {
        toPosition = overIndex
      }
    }

    if (activeTaskItem.status === toStatus && activeTaskItem.position === toPosition) {
      return
    }

    await onMove(activeId, toStatus, toPosition)
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={() => setActiveTask(null)}
    >
      <div className="board">
        {COLUMNS.map((column) => (
          <Column
            key={column.id}
            id={column.id}
            title={column.title}
            tasks={tasksByStatus[column.id]}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </div>
      <DragOverlay>
        {activeTask ? (
          <article className="task-card task-card--overlay">
            <h3 className="task-card__title">{activeTask.title}</h3>
            {activeTask.description ? (
              <p className="task-card__description">{activeTask.description}</p>
            ) : null}
          </article>
        ) : null}
      </DragOverlay>
    </DndContext>
  )
}
