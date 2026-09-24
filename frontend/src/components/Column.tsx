import { useDroppable } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import type { Task, TaskStatus } from '../types'
import { TaskCard } from './TaskCard'

type ColumnProps = {
  id: TaskStatus
  title: string
  tasks: Task[]
  onEdit: (task: Task) => void
  onDelete: (taskId: number) => void
}

export function Column({ id, title, tasks, onEdit, onDelete }: ColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id,
    data: { type: 'column', status: id },
  })

  return (
    <section className={`column ${isOver ? 'column--over' : ''}`}>
      <header className="column__header">
        <h2>{title}</h2>
        <span className="column__count">{tasks.length}</span>
      </header>
      <div ref={setNodeRef} className="column__list">
        <SortableContext items={tasks.map((task) => task.id)} strategy={verticalListSortingStrategy}>
          {tasks.length === 0 ? (
            <p className="column__empty">No tasks</p>
          ) : (
            tasks.map((task) => (
              <TaskCard key={task.id} task={task} onEdit={onEdit} onDelete={onDelete} />
            ))
          )}
        </SortableContext>
      </div>
    </section>
  )
}
