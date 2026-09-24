import { type FormEvent, useEffect, useState } from 'react'
import type { Task } from '../types'

type EditTaskModalProps = {
  task: Task | null
  onClose: () => void
  onSave: (taskId: number, title: string, description: string) => Promise<void>
}

export function EditTaskModal({ task, onClose, onSave }: EditTaskModalProps) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (task) {
      setTitle(task.title)
      setDescription(task.description)
    }
  }, [task])

  if (!task) return null

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    const trimmed = title.trim()
    if (!task || !trimmed || saving) return

    setSaving(true)
    try {
      await onSave(task.id, trimmed, description.trim())
      onClose()
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="modal-backdrop" role="presentation" onClick={onClose}>
      <form
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="edit-task-title"
        onClick={(event) => event.stopPropagation()}
        onSubmit={handleSubmit}
      >
        <h2 id="edit-task-title">Edit task</h2>
        <label>
          Title
          <input
            type="text"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            required
          />
        </label>
        <label>
          Description
          <textarea
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            rows={4}
          />
        </label>
        <div className="modal__actions">
          <button type="button" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" disabled={saving || !title.trim()}>
            {saving ? 'Saving…' : 'Save'}
          </button>
        </div>
      </form>
    </div>
  )
}
